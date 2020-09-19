const express = require('express');
const Review = require('../models/reviews');
const router = express.Router();
const Like = require('../models/review_likes');

router.post('/like/:revid', function (req, res, next) {
    Review.findOneAndUpdate({ "_id": req.params.revid },
        { $push: { likes: req.body } }, function (err, doc) {
            res.send({ "doc": doc, "err": err });
        });
});

router.get('/likes/:revid', function (req, res) {
    const limit = 30;
    const startIndex = req.query.page * limit;
    Review.find({ "_id": req.params.revid }
        , { _id: 1, "likes": { $slice: [startIndex, limit] } }
    ).then(function (likes) {
        console.log(likes);
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

router.delete('/likes/:revid', function (req, res, next) {
    Review.update({ "_id": req.params.revid }
        , { $pull: { likes: { user_id: req.query.userid } } }
    ).then(function (result) {
        res.send(result);
    });
});

module.exports = router;