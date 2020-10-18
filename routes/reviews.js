const express = require('express');
const router = express.Router();
const Review = require('../models/reviews');
const User = require('../models/user');

// get reviews
router.get('/reviews', function (req, res, next) {
    const limit = 5;
    const page = parseInt(req.query.page);
    const brand = req.query.brand;
    const product = req.query.product;
    const startIndex = limit * page;

    if (brand != undefined && product != undefined) {
        Review.aggregate([
            { $match: { 'brand': req.query.brand, 'product': req.query.product } },
            {
                $lookup: {
                    from: 'users', localField: 'user_id',
                    foreignField: '_id', as: 'user_info'
                }
            },
            { $sort: { "date_rev": -1 } },
            { $skip: startIndex },
            { $limit: limit },
            {
                $project: {
                    likes: 0, comments: 0
                    , "user_info.reviews_id": 0, "user_info.owned_products": 0,
                    "user_info.points": 0, "user_info.user_email": 0
                }
            }

        ]).then(function (revs) {
            res.send(revs);
        }).catch(next);
    } else if (brand != undefined) {
        Review.aggregate([
            { $match: { 'brand': req.query.brand } },
            {
                $lookup: {
                    from: 'users', localField: 'user_id',
                    foreignField: '_id', as: 'user_info'
                }
            },
            { $sort: { "date_rev": -1 } },
            { $skip: startIndex },
            { $limit: limit },
            {
                $project: {
                    likes: 0, comments: 0
                    , "user_info.reviews_id": 0, "user_info.owned_products": 0,
                    "user_info.points": 0, "user_info.user_email": 0
                }
            }
        ]).then(function (revs) {
            res.send(revs);
        }).catch(next);
    } else {
        Review.aggregate([
            {
                $lookup: {
                    from: 'users', localField: 'user_id',
                    foreignField: '_id', as: 'user_info'
                }
            },
            { $sort: { "date_rev": -1 } },
            { $skip: startIndex },
            { $limit: limit },
            {
                $project: {
                    likes: 0, comments: 0
                    , "user_info.reviews_id": 0, "user_info.owned_products": 0,
                    "user_info.points": 0, "user_info.user_email": 0
                }
            }

        ]).then(function (revs) {
            res.send(revs);
        }).catch(next);
    }
});

// create review
router.post('/review', function (req, res, next) {
    var phone_name = req.body.brand + ' ' + req.body.product;
    var points = (req.body.pros.length + req.body.cons.length) / 4;

    User.findByIdAndUpdate({ _id: req.body.user_id }
        , { $addToSet: { "reviews_id": phone_name }, $inc: { points: points } }
        , function (err, doc) { }).catch(next);

    // TODO: check if user is famous
    Review.create(req.body).then(function (rev) {
        res.send(rev);
    }).catch(next);
});

// delete review (admins)
router.delete('/reviews/:reviewId', function (req, res, next) {
    Review.findByIdAndRemove({ _id: req.params.reviewId }, function (err, doc) {
        if (doc != null) {
            if (err == null) {
                res.send({ message: "Succesfully deleted", doc: doc });
            } else {
                res.send(err);
            }
        } else {
            res.send({ res: "this one deleted before" });
        }
    }).catch(next);
});

module.exports = router;