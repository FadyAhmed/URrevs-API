const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleCommentSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    article_id: {
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
});

const ArticleComment = mongoose.model('comments', ArticleCommentSchema, 'article_comments');

module.exports = ArticleComment;
