const express = require('express');
const Article = require('../models/article');
const router = express.Router();
const User = require('../models/user');
const Like = require('../models/article_like');
const ArticleLike = require('../models/article_like');
const ArticleComment = require('../models/article_comment');

// get articles
router.get('/articles', function (req, res) {
    const limit = 5;
    const page = parseInt(req.query.page);
    const brand = req.query.brand;
    const product = req.query.product;
    const startIndex = limit * page;
    if (brand != undefined && product != undefined) {
        Article.find({}, { "likes": 0, "comments": 0 }).sort("-date").where("brand", brand).where("product", product).limit(limit).skip(startIndex).then(function (revs) {
            res.send(revs);
        });
    } else if (brand != undefined) {
        Article.find({}, { "likes": 0, "comments": 0 }).sort("-date").where("brand", brand).limit(limit).skip(startIndex).then(function (revs) {
            res.send(revs);
        });
    } else {
        Article.find({}, { "likes": 0, "comments": 0 }).sort("-date").limit(limit).skip(startIndex).then(function (revs) {
            res.send(revs);
        });
    }
});

// get excact famous articles
router.get('/articles/:famousId', function (req, res) {
    const limit = 5;
    const page = parseInt(req.query.page);
    const famous = req.params.famousId;
    const startIndex = limit * page;

    Article.find({ "user_id": famous }, { "likes": 0, "comments": 0 }).sort("-date")
        .limit(limit).skip(startIndex)
        .then(function (revs) {
            res.send(revs);
        });
});

// post article
router.post('/article/:user_id', function (req, res, next) {
    // famous check
    User.findById({ "_id": req.params.user_id }).then(function (user) {
        if (user) {
            if (user.famous) {
                Article.create(req.body).then(function (article) {
                    res.send(article);
                });
            } else {
                res.status(403).send({ "error": "not a famous" });
            }
        }
    });
});

// delete article
router.delete('/articles/:article_id', function (req, res, next) {
    Article.deleteOne({ "_id": req.params.article_id }).then(function (val) {
        res.send(val);
    }).catch(next);
});

// like it
router.post('/likeArticle', function (req, res, next) {
    Article.findOneAndUpdate({ "_id": req.body.post_id },
        { $inc: { likes_num: 1 } }, function (err, doc) {
            // res.send({ "doc": doc, "err": err });
        });

    ArticleLike.create(req.body).then(function (doc) {
        res.send(doc);
    });
});

// get likes
router.get('/articlelikes/:articleId', function (req, res) {
    const limit = 20;
    const startIndex = req.query.page * limit;

    ArticleLike.find({}).where('post_id', req.params.articleId)
        .sort('-date').limit(limit).skip(startIndex).then(function (likes) {
            res.send(likes);
        })
});

// get excact like (if user is like or not)
router.get('/islikedArticle/:articleId', function (req, res) {
    ArticleLike.findOne({
        'post_id': req.params.articleId,
        'user_id': req.query.user_id
    }).then(function (result) {
        if (result) {
            res.send(true);
        } else {
            res.send(false);
        }
    });
});

// unlike
router.delete('/likesArticle/:articleId', function (req, res, next) {
    Article.findOneAndUpdate({ "_id": req.params.articleId },
        { $inc: { likes_num: -1 } }, function (err, doc) {
            // res.send({ "doc": doc, "err": err });
        });

    ArticleLike.findOneAndDelete(
        {
            'post_id': req.params.articleId,
            'user_id': req.query.user_id
        }
    ).then(function (result) {
        res.send(result);
    })
});

// comment
router.post('/commentArticle', function (req, res, next) {
    Article.findOneAndUpdate({ "_id": req.body.post_id },
        { $inc: { comments_num: 1 } }, function (err, doc) {
            // res.send({ "doc": doc, "err": err });
        });

    ArticleComment.create(req.body).then(function (doc) {
        res.send(doc);
    })
});

// get comments
router.get('/commentsArticle/:articleId', function (req, res) {
    const limit = 5;
    const startIndex = req.query.page * limit;

    ArticleComment.find({ "post_id": req.params.articleId }
        , { "replies": { $slice: [0, 3] } }
    ).sort('date').limit(limit).skip(startIndex)
        .then(function (comments) {
            res.send(comments);
        });
});

// delete comment (admin)
router.delete('/commentsArticle/:commentId', function (req, res, next) {
    Article.findOneAndUpdate({ "_id": req.body.post_id },
        { $inc: { comments_num: -1 } }, function (err, doc) {
            // res.send({ "doc": doc, "err": err });
        });

    ArticleComment.findByIdAndDelete({ _id: req.params.commentId }).then(function (com) {
        res.send(com);
    });
});

// add reply
router.post('/replyArticle/:commentId', function (req, res, next) {
    ArticleComment.findByIdAndUpdate({ _id: req.params.commentId }
        , { $push: { replies: req.body } }, function (err, doc) {
            if (!err) { res.send('done') }
        });
});

// get comment replies
router.get('/repliesArticle/:commentId', function (req, res) {
    ArticleComment.find({ _id: req.params.commentId }
        , { _id: 1, "replies": 1 })
        .then(function (comments) {
            res.send(comments);
        });
});

module.exports = router;