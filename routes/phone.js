const express = require('express');
const Phone = require('../models/phone');
const router = express.Router();

// add new phone (admin)
router.post('/phone', function (req, res) {
    Phone.updateOne({ "brand": req.body.brand, "device": req.body.device },
        req.body,
        {
            "upsert": true
        },
        function (err, doc) {
            if (!err) {
                res.send(doc)
            } else {
                console.log(err);
                next
            }
        }
    );
});

// get phones
router.get('/phones', function (req, res) {
    const limit = 20;
    const page = parseInt(req.query.page);
    const brand = req.query.brand;
    const product = req.query.product;
    const startIndex = limit * page;

    if (brand != undefined && product != undefined) {
        Phone.find({}, { _id: 1, brand: 1, device: 1 })
            .sort("-publish_date").where("brand", brand).where("device", product)
            .limit(limit).skip(startIndex)
            .then(function (phones) {
                res.send(phones);
            });
    } else if (brand != undefined) {
        Phone.find({}, { _id: 1, brand: 1, device: 1 })
            .sort("-publish_date").where("brand", brand)
            .limit(limit).skip(startIndex)
            .then(function (phones) {
                res.send(phones);
            });
    } else {
        Phone.find({}, { _id: 1, brand: 1, device: 1 })
            .sort("-publish_date")
            .limit(limit).skip(startIndex)
            .then(function (phones) {
                res.send(phones);
            });
    }
});

// get exact phone
router.get('/exactphone', function (req, res) {
    const brand = req.query.brand;
    const product = req.query.product;

    Phone.find({ "brand": brand, "device": product }).then(function (phone) {
        res.send(phone[0]);
    })
});

// delete phone (admin)
router.delete('/phone', function (req, res) {
    Phone.deleteOne({ "_id": req.body.id }).then(function (val) {
        res.send(val);
    })
});

// find phone
router.get('/findphone/:phone', function (req, res) {
    Phone.find(
        { $text: { $search: req.params.phone } }, { _id: 1, brand: 1, device: 1 },
        { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } }).sort({ publish_date: -1 }).limit(20)
        .then(function (results) {
            res.send(results);
        });
});

module.exports = router;