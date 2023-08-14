const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
},
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
},
  replies: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply'
    }
],
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);