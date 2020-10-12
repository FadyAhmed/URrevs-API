const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CommentSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    post_id: {
        type: String,
        required: true
    },
    date: {
        type: String
    },
    comment: {
        type: String,
        require: true,
    },
    user_avatar: {
        type: String,
    },
    user_name: {
        type: String,
    },
    replies: {
        type: Array
    }
});

const ReviewComment = mongoose.model('reviews_comments', CommentSchema, 'reviews_comments');

module.exports = ReviewComment;
