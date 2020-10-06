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
    user_name: {
        type: String
    },
    user_avatar: {
        type: String
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
});

const Article = mongoose.model('article', ArticleSchema);

module.exports = Article;