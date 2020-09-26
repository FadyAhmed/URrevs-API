const express = require('express');
const Phone = require('../models/phone');
const router = express.Router();

// add new phone
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

// delete phone 
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