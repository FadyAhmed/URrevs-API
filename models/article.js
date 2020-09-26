const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LikeSchema = require('../models/review_likes');
const CommentSchema = require('../models/review_comments');

const ArticleSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        createIndex: true
    },
    date: {
        type: String,
        createIndex: true
    },
    product: {
        type: String
    },
    brand: {
        type: String
    },
    content: {
        type: String
    },
    likes: {
        type: [LikeSchema]
    },
    comments: {
        type: [CommentSchema]
    }
});

const Article = mongoose.model('article', ArticleSchema);

module.exports = Article;