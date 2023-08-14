const express = require('express');
const postRouter = express.Router();
const Post = require('../Models/posts');
const userAuth = require('../Middlewares/user-auth');

postRouter.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author').populate('comments').populate('likes');
        res.json(posts);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

postRouter.post('/', userAuth, async (req, res) => {
    try {
        const {content} = req.body;
        const authorId = req.user._id;
        const post = new Post({content, authorId});
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

postRouter.delete('/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

postRouter.post('/:id/like', userAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const userId = req.user._id;
        const isLiked = post.likes.includes(userId);
        if (isLiked) {
            await post.updateOne({ $pull: { likes: userId } });
        } else {
            await post.updateOne({ $push: { likes: userId } });
        }
        res.status(200).json({ message: 'Post updated' });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

module.exports = postRouter;