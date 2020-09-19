const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    review_id: {
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

//const Like = mongoose.model('likes', LikeSchema, 'reviews_likes');

module.exports = LikeSchema;