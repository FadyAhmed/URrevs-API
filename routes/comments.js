const express = require('express');
const { update } = require('../models/reviews');
const Review = require('../models/reviews');
const router = express.Router();
const Comment = require('../models/review_comments');

router.post('/comment/:revid', function (req, res, next) {
    Review.findOneAndUpdate({ "_id": req.params.revid },
        { $push: { comments: req.body } }, function (err, doc) {
            res.send({ "doc": doc, "err": err });
        });
});

router.get('/comments/:revid', function (req, res) {
    const limit = 3;
    const startIndex = req.query.page * limit;

    Review.find({ "_id": req.params.revid }
        , { _id: 1, "comments": { $slice: [startIndex, limit] } }
    )
        .then(function (comments) {
            res.send(comments[0].comments);
        });
});

router.delete('/comments/:revid', function (req, res, next) {
    Review.update({ "_id": req.params.revid }
        , { $pull: { comments: { user_id: req.query.userid } } }
    ).then(function (result) {
        res.send(result);
    });
});

module.exports = router;