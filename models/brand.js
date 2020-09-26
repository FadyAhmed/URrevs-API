const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorySchema = new Schema({
    photo: {
        type: String,
        required: true
    },
    until: {
        type: Number,
        required: true
    },
    date: {
        type: Number,
        required: true
    }
});

const BrandSchema = new Schema({
    brand_name: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    story: {
        type: [StorySchema]
    }
});

const Brand = mongoose.model('brand', BrandSchema);

module.exports = Brand;