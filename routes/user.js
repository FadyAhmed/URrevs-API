const express = require('express');
const User = require('../models/user');
const router = express.Router();

// get all famous users
router.get('/famoususers', function (req, res) {
    User.find({ famous: true }, { "owned_products": 0, "user_email": 0 }).then(function (users) {
        res.send(users);
    });
});

// get exact user data
router.get('/users/:user_id', function (req, res) {
    User.find({ _id: req.params.user_id }).then(function (user) {
        res.send(user);
    });
});

// add or update user profile
router.post('/user/:user_id', function (req, res, next) {
    User.updateOne({ "_id": req.params.user_id },
        req.body,
        {
            "upsert": true
        },
        function (err, doc) {
            if (!err) {
                res.send(doc)
            } else {
                next
            }
        }
    );
});

// get user products
router.get('/userproducts/:user_id', function (req, res) {
    User.find({ "_id": req.params.user_id }, { _id: 1, owned_products: 1, }).
        then(function (products) {
            res.send(products);
        })
});

// update products list
router.post('/userproducts/:user_id', function (req, res, next) {
    User.find({ _id: req.params.user_id }).where('reviews_id', req.body.product).then(function (doc, error) {
        if (doc.length != 0) {
            User.findOneAndUpdate({ _id: req.params.user_id }
                , { $addToSet: { "owned_products": req.body.product } },
                function (err) {
                    if (err) {
                        res.send("error");
                    } else { res.send("done") }
                });
        } else { res.send("error") }
    });

});

// delete product from owned products
router.delete('/userproducts/:user_id', function (req, res) {
    User.updateOne({ _id: req.params.user_id },
        { $pull: { "owned_products": req.query.product } }
    ).then(function (val) {
        res.send(val);
    });
});

// get all users for leaderboard
router.get('/leaderboard', function (req, res) {
    const limit = 20;
    const page = parseInt(req.query.page);
    const startIndex = limit * page;

    User.find({ points: { $gt: 0 } }, { _id: 1, points: 1, user_name: 1, user_avatar: 1 })
        .sort('-points').limit(limit).skip(startIndex).then(function (revs) {
            res.send(revs);
        });
});
module.exports = router;