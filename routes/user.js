const express = require('express');
const User = require('../models/user');
const router = express.Router();

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
                console.log(err);
                next
            }
        }
    );
});

// update products list
router.post('/userproducts/:user_id', function (req, res, next) {
    User.find({ _id: req.params.user_id })
        .update({ $set: { "owned_products": req.body.product } },
            function (err) {
                if (err) {
                    console.log(err);
                    res.send("error");
                } else { res.send("done") }
            }).catch(next);
});

// get user products
router.get('/userproducts/:user_id', function (req, res) {
    User.find({ "_id": req.params.user_id }, { _id: 1, owned_products: 1, }).
        then(function (products) {
            res.send(products);
        })
});

// delete product from owned products
router.delete('/userproducts/:user_id', function (req, res) {
    User.updateOne({ _id: req.params.user_id },
        { $pull: { "owned_products": req.body.product } }
    ).then(function (val) {
        res.send(val);
    });
});

module.exports = router;