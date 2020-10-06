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
    Like.create(req.body).then(function (doc) {
        res.send(doc);
    });
});

// get likes
router.get('/articlelikes/:articleId', function (req, res) {
    const limit = 5;
    const startIndex = req.query.page * limit;

    ArticleLike.find({}).where('article_id', req.params.articleId)
        .sort('-date').limit(limit).skip(startIndex).then(function (likes) {
            res.send(likes);
        })
});

// get excact like (if user is like or not)
router.get('/islikedArticle', function (req, res) {
    ArticleLike.findById({ _id: req.body._id }).then(function (like) {
        if (like) {
            res.send(true);
        } else {
            res.send(false);
        }
    })
});

// unlike
router.delete('/likesArticle', function (req, res, next) {
    ArticleLike.findByIdAndDelete({ _id: req.body._id }).then(function (d) {
        res.send(d);
    })
});

// comment
router.post('/commentArticle', function (req, res, next) {
    ArticleComment.create(req.body).then(function (doc) {
        res.send(doc);
    })
});

// get comments
router.get('/commentsArticle/:articleId', function (req, res) {
    const limit = 5;
    const startIndex = req.query.page * limit;

    ArticleComment.find({}).where("article_id", req.params.articleId)
        .sort('-date').limit(limit).skip(startIndex)
        .then(function (comments) {
            res.send(comments);
        });
});

// delete comment (admin)
router.delete('/commentsArticle/:commentId', function (req, res, next) {
    ArticleComment.findByIdAndDelete({ _id: req.params.commentId }).then(function (com) {
        res.send(com);
    });
});

module.exports = router;