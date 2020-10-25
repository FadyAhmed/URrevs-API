const express = require('express');
const router = express.Router();
const Review = require('../models/reviews');
const User = require('../models/user');
import { verifyUser } from './auth';

// get reviews
router.get('/reviews', function (req, res) {
    const limit = 5;
    const page = parseInt(req.query.page);
    const brand = req.query.brand;
    const product = req.query.product;
    const startIndex = (limit * page);

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
        });
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
        });
    } else {
        Review.aggregate([
            { $sort: { "date_rev": -1 } },
            { $skip: startIndex },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users', localField: 'user_id',
                    foreignField: '_id', as: 'user_info'
                }
            },
            // {
            //     $project: {
            //         likes: 0, comments: 0
            //         , "user_info.reviews_id": 0, "user_info.owned_products": 0,
            //         "user_info.points": 0, "user_info.user_email": 0
            //     }
            // }

        ]).then(function (revs) {
            res.send(revs);
        });
    }
});

// create review
router.post('/review', function (req, res, next) {
    var phone_name = req.body.brand + ' ' + req.body.product;
    var points = parseFloat(((req.body.pros.length + req.body.cons.length) / 10).toFixed(2));

    verifyUser(req.body.token, req.body.user_id).then(function (result) {
        if (result) {
            Review.create(req.body).then(function (rev) {
                res.send(rev);
            }).then(function () {
                User.findByIdAndUpdate({ _id: req.body.user_id }
                    , { $addToSet: { "reviews_id": phone_name }, $inc: { points: points } }
                    , function (err, doc) { });
            });
        } else {
            res.status(403).send('there\'s a problem right now');
        }
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