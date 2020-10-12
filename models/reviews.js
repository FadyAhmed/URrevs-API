const mongoose = require('mongoose');
const CommentSchema = require('./review_comments');
const LikeSchema = require('./review_likes');
const Schema = mongoose.Schema;

// create review Schema & model
const ReviewSchema = new Schema({
    likes_num: {
        type: Number,
        default: 0
    },
    comments_num: {
        type: Number,
        default: 0
    },
    famous: {
        type: Boolean,
    },
    points: {
        type: Number,
        default: 0
    },
    likes: {
        type: [LikeSchema]
    },
    approved: {
        type: Boolean
    },
    brand: {
        type: String,
        required: true,
    },
    brand_bros: {
        type: String
    },
    brand_cons: {
        type: String
    },
    brand_rate: {
        type: Number
    },
    cons: {
        type: String,
        required: true

    },
    date_buy: {
        type: String,
        required: true
    },
    date_rev: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true
    },
    product: {
        type: String,
        required: true,
    },
    pros: {
        type: String,
        required: true

    },
    rate: {
        type: String,
        required: true
    },
    rate1: {
        type: String,
        required: true
    },
    rate2: {
        type: String,
        required: true
    },
    rate3: {
        type: String,
        required: true

    },
    rate4: {
        type: String,
        required: true

    },
    rate5: {
        type: String,
        required: true

    },
    rate6: {
        type: String,
        required: true
    },
    shown: {
        type: Boolean
    },
    user_avatar: {
        type: String,
        required: true
    },
    user_id: {
        type: String
    },
    user_name: {
        type: String,
        required: true
    },
    views: {
        type: Number
    },
});

const Review = mongoose.model('review', ReviewSchema);

module.exports = Review;