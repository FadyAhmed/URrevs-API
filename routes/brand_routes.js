const express = require('express');
const router = express.Router();
const Brand = require('../models/brand');

// get all brands
router.get('/brands', function (req, res) {
    Brand.find({}).then(function (brands) {
        res.send(brands);
    });
});

// add brand (admin)
router.post('/brand', function (req, res, next) {
    Brand.updateOne({ "brand_name": req.body.brand_name }, req.body, { upsert: true }).then(function (doc) {
        res.send(doc);
    }).catch(next)
});

// delete brand (admin)
router.delete('/brands/:brandId', function (req, res) {
    Brand.deleteOne({ "_id": req.params.brandId }).then(function (val) {
        res.send(val);
    })
});

// delete brand story (admin or mod)
router.delete('/brandstory/:brandId', function (req, res) {
    Brand.findOneAndUpdate(
        { "_id": req.params.brandId },
        { $pull: { story: { _id: req.body.story_id } } },
        function (err, doc) {
            if (!err) { res.send(doc); }
            else { res.send(err) }
        }
    );
});

// add brand story (admin or mod)
router.post('/brandstory/:brand', function (req, res, next) {
    Brand.findByIdAndUpdate({ _id: req.params.brand },
        { $push: { story: req.body } }, function (err, doc) {
            if (!err) res.send(doc);
        }
    );
});

module.exports = router;