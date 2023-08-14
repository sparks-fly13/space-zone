const express = require('express');
const commentRouter = express.Router();
const Comment = require('../Models/comments');
const User = require('../Models/user');
const Post = require('../Models/posts');
const userAuth = require('../Middlewares/user-auth');

commentRouter.post('/:postId', userAuth, async (req, res) => {
    try {
      const { content } = req.body;
      const postId = req.params.postId;
      const authorId = req.user._id;
      const user = await User.findById(authorId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const comment = new Comment({
        content,
        author: user,
        post: postId,
      });
      await comment.save();
      await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: 'Error creating comment' });
    }
  });

  // Fetch comments for a specific post
commentRouter.get('/:postId', async (req, res) => {
    try {
      const postId = req.params.postId;
  
      // Find the post and populate its comments
      const post = await Post.findById(postId).populate('comments');
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Extract and send the comments
      const comments = post.comments;
      res.status(200).json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: 'Error fetching comments' });
    }
  });
  
  module.exports = commentRouter;