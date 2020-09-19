const express = require('express');
const router = express.Router();
const Review = require('../models/reviews');

router.get('/reviews', function (req, res) {
    const limit = 5;
    const page = parseInt(req.query.page);
    const brand = req.query.brand;
    const product = req.query.product;
    const startIndex = limit * page;
    if (brand != undefined && product != undefined) {
        Review.find({}, { "likes": 0, "comments": 0 }).sort("-date_rev").where("brand", brand).where("product", product).limit(limit).skip(startIndex).then(function (revs) {
            res.send(revs);
        });
    } else if (brand != undefined) {
        Review.find({}, { "likes": 0, "comments": 0 }).sort("-date_rev").where("brand", brand).limit(limit).skip(startIndex).then(function (revs) {
            res.send(revs);
        });
    } else {
        Review.find({}, { "likes": 0, "comments": 0 }).sort("-date_rev").limit(limit).skip(startIndex).then(function (revs) {
            res.send(revs);
        });
    }
});

router.post('/reviews', function (req, res, next) {
    Review.create(req.body).then(function (rev) {
        res.send(rev);
    }).catch(next);
});

router.delete('/reviews/:id', function (req, res, next) {
    Review.findByIdAndRemove({ _id: req.params.id }, function (err, doc) {
        if (doc != null) {
            if (err == null) {
                res.send({ message: "Succesfully deleted", doc: doc });
            } else {
                res.send(err);
            }
        } else {
            res.send({ res: "this one deleted before" });
        }
    })
});

module.exports = router;