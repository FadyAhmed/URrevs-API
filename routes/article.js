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
        } else { next }
    });
});

// delete article
router.delete('/articles/:article_id', function (req, res, next) {
    Article.deleteOne({ "_id": req.params.article_id }).then(function (val) {
        res.send(val);
    }).catch(next);
});

module.exports = router;