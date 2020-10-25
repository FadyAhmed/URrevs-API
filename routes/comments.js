const express = require('express');
const { update } = require('../models/reviews');
const Review = require('../models/reviews');
const ReviewComment = require('../models/review_comments');
const router = express.Router();

// comment
router.post('/commentReview', function (req, res, next) {
    Review.findOneAndUpdate({ "_id": req.body.post_id },
        { $inc: { comments_num: 1 } }, function (err, doc) {
            // 
        });

    ReviewComment.create(req.body).then(function (doc) {
        res.send(doc);
    })
});

// get comments
router.get('/commentsReview/:reviewId', function (req, res) {
    const limit = 5;
    const startIndex = req.query.page * limit;

    ReviewComment.aggregate([
        { $match: { "post_id": req.params.reviewId } },
        {
            $lookup: {
                from: 'users', localField: 'user_id',
                foreignField: '_id', as: 'user_info'
            }
        },
        { $sort: { "date": 1 } },
        { $skip: startIndex },
        { $limit: limit },
        {
            $project: {
                "user_info.reviews_id": 0, "user_info.owned_products": 0,
                "user_info.points": 0, "user_info.user_email": 0
            }
        },
        {
            $project: {
                _id: 1, date: 1, user_info: 1, comment: 1, post_id: 1,
                replies: { $reverseArray: { $slice: ['$replies', -3] } }
            }
        }
    ]).then(function (comments) {
        res.send(comments);
    });
});

// delete comment (admin)
router.delete('/commentsReview/:commentId', function (req, res, next) {
    ReviewComment.findOneAndUpdate({ "_id": req.body.post_id },
        { $inc: { comments_num: -1 } }, function (err, doc) {
            // res.send({ "doc": doc, "err": err });
        });

    ReviewComment.findByIdAndDelete({ _id: req.params.commentId }).then(function (com) {
        res.send(com);
    });
});

// add reply
router.post('/replyReview/:commentId', function (req, res, next) {
    ReviewComment.findByIdAndUpdate({ _id: req.params.commentId }
        , { $push: { replies: req.body } }, function (err, doc) {
            if (!err) { res.send('done') }
        });
});

// get comment replies
router.get('/repliesReview/:commentId', function (req, res) {
    ReviewComment.find({ _id: req.params.commentId }
        , { _id: 1, "replies": 1 })
        .then(function (comments) {
            res.send(comments);
        });
});


module.exports = router;