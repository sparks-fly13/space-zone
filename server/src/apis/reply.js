const express = require('express');
const replyRouter = express.Router();
const Comment = require('../Models/comments');
const Reply = require('../Models/reply');
const User = require('../Models/user');
const userAuth = require('../Middlewares/user-auth');

// Create a reply to a comment
replyRouter.post('/:commentId', userAuth, async (req, res) => {
  try {
    const { content } = req.body;
    const commentId = req.params.commentId;
    const authorId = req.user._id;

    // Find the user based on the provided ID
    const user = await User.findById(authorId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the comment to which we want to add a reply
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Create the reply
    const reply = new Reply({
      content,
      author: user,
      comment: comment._id,
    });

    // Save the reply and update the comment to include the reply
    await reply.save();
    comment.replies.push(reply);
    await comment.save();

    res.status(201).json(reply);
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({ message: 'Error creating reply' });
  }
});

// Fetch replies for a specific comment
replyRouter.get('/:commentId', async (req, res) => {
    try {
      const commentId = req.params.commentId;
  
      // Find the comment and populate its replies
      const comment = await Comment.findById(commentId).populate('replies');
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      // Extract and send the replies
      const replies = comment.replies;
      res.status(200).json(replies);
    } catch (error) {
      console.error('Error fetching replies:', error);
      res.status(500).json({ message: 'Error fetching replies' });
    }
  });

module.exports = replyRouter;
