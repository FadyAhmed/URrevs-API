const express = require('express');
const Article = require('../models/article');
const router = express.Router();
const User = require('../models/user');

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

// post article
router.post('/article/:user_id', function (req, res, next) {
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
router.post('/likeArticle/:revid', function (req, res, next) {
    Article.findOneAndUpdate({ "_id": req.params.revid },
        { $push: { likes: req.body } }, function (err, doc) {
            res.send({ "doc": doc, "err": err });
        });
});

// review likes
router.get('/likesArticle/:revid', function (req, res) {
    const limit = 5;
    const startIndex = req.query.page * limit;
    Article.find({ "_id": req.params.revid }
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
router.get('/islikedArticle/:revid', function (req, res) {
    Article.find({ "_id": req.params.revid }
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
router.delete('/likesArticle/:revid', function (req, res, next) {
    Article.update({ "_id": req.params.revid }
        , { $pull: { likes: { user_id: req.query.userid } } }
    ).then(function (result) {
        res.send(result);
    });
});

// comment
router.post('/commentArticle/:revid', function (req, res, next) {
    Article.findOneAndUpdate({ "_id": req.params.revid },
        { $push: { comments: req.body } }, function (err, doc) {
            res.send({ "doc": doc, "err": err });
        });
});

// get comments
router.get('/commentsArticle/:revid', function (req, res) {
    const limit = 3;
    const startIndex = req.query.page * limit;

    Article.find({ "_id": req.params.revid }
        , { _id: 1, "comments": { $slice: [startIndex, limit] } }
    )
        .then(function (comments) {
            res.send(comments[0].comments);
        });
});

// delete comment (admin)
router.delete('/commentsArticle/:revid', function (req, res, next) {
    Article.update({ "_id": req.params.revid }
        , { $pull: { comments: { user_id: req.query.userid } } }
    ).then(function (result) {
        res.send(result);
    });
});

module.exports = router;