const mongoose = require('mongoose');
const { model, mapReduce } = require('./article');
const Schema = mongoose.Schema;

const PhoneSchema = new Schema({
    brand: {
        type: String,
        required: true,
        createIndex: true
    },
    publish_date: {
        type: String
    },
    device: {
        type: String,
        required: true,
        createIndex: true
    },
    aspect_ratio: {
        type: String
    },
    audio_jack: {
        type: Boolean
    },
    battery: {
        type: Map,
    },
    bluetooth: {
        type: Map,
    },
    camera: {
        type: [Map],
    },
    colors: {
        type: [String]
    },
    dimensions: {
        type: Map,
    },
    display: {
        type: String
    },
    features: {
        type: String
    },
    fingerprint: {
        type: Map
    },
    gps: {
        type: Boolean
    },
    ir: {
        type: Boolean
    },
    nfc: {
        type: Boolean
    },
    os: {
        type: Map,
    },
    ppi: {
        type: Number
    },
    price: {
        type: Number
    },
    protection: {
        type: String
    },
    radio: {
        type: Boolean
    },
    resoution: {
        type: Map,
    },
    sensors: {
        type: Map,
    },
    sim: {
        type: [String]
    },
    size: {
        type: Number
    },
    soc: {
        type: Map,
    },
    storage: {

    },
    thumbnail: {
        type: String
    },
    usb: {
        type: Map,
    }
});

const Phone = mongoose.model('phone', PhoneSchema);

module.exports = Phone;