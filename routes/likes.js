const express = require('express');
const Review = require('../models/reviews');
const router = express.Router();

// like it
router.post('/like/:revid', function (req, res, next) {
    Review.findOneAndUpdate({ "_id": req.params.revid },
        { $inc: { likes_num: 1 } }, function (err, doc) {
            // res.send({ "doc": doc, "err": err });
        });

    Review.findOneAndUpdate({ "_id": req.params.revid },
        { $push: { likes: req.body } }, function (err, doc) {
            res.send({ "doc": doc, "err": err });
        });
});

// review likes
router.get('/likes/:revid', function (req, res) {
    const limit = 5;
    const startIndex = req.query.page * limit;
    Review.find({ "_id": req.params.revid }
        , { _id: 1, "likes": { $slice: [startIndex, limit] } }
    ).then(function (likes) {
        if (likes != undefined) {
            res.send(likes[0].likes);
        } else {
            res.send({ message: "error" })
        }
    });
});

// get excact like (if user is like or not)
router.get('/isliked/:revid', function (req, res) {
    Review.find({ "_id": req.params.revid }
        , { _id: 1, "likes": { $elemMatch: { user_id: req.query.userid } } }
    ).then(function (like) {
        if (like[0].likes.length == 0) {
            res.send(false);
        } else {
            res.send(true);
        }
    });
});

// unlike
router.delete('/likes/:revid', function (req, res, next) {
    Review.findOneAndUpdate({ "_id": req.params.revid },
        { $inc: { likes_num: -1 } }, function (err, doc) {
            // res.send({ "doc": doc, "err": err });
        });
    Review.updateOne({ "_id": req.params.revid }
        , { $pull: { likes: { user_id: req.query.userid } } }
    ).then(function (result) {
        res.send(result);
    });
});

module.exports = router;