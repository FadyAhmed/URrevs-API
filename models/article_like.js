const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleLikeLikeSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    article_id: {
        type: String,
        required: true
    },
    date: {
        type: String,
    },
    user_avatar: {
        type: String,
    },
    user_name: {
        type: String,
    }
});

const ArticleLike = mongoose.model('likes', ArticleLikeLikeSchema, 'articles_likes');

module.exports = ArticleLike;
