const mongoose = require('mongoose');
const { createIndexes } = require('./article');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: {
        type: String,
        required: true,
        createIndex: true
    },
    user_name: {
        type: String,
        required: true,
    },
    user_avatar: {
        type: String,
        required: true
    },
    user_email: {
        type: String,
        required: true
    },
    famous: {
        type: Boolean,
        required: true
    },
    famous_photo: {
        type: String
    },
    owned_products: {
        type: [String]
    },
    reviews_id: {
        type: [String]
    },
    points: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;