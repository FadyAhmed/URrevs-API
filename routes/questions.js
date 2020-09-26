const { query } = require('express');
const express = require('express');
const Question = require('../models/question');
const router = express.Router();

// post a question (query.userid)
router.post('/question', function (req, res, next) {
    Question.create(req.body).then(function (quest) {
        res.send(quest);
    }).catch(next);
});

// get questions (query.page)
router.get('/questions', function (req, res) {
    const limit = 2;
    const startIndex = req.query.page * limit;

    Question.find().sort({ "date": -1 }).skip(startIndex).limit(limit).then(function (result) {
        res.send(result);
    });
});

// answer
router.post('/answer/:questionId', function (req, res, next) {

    Question.findOneAndUpdate({ _id: req.params.questionId },
        { $push: { answers: req.body } }, function (err, ans) {
            if (!err) {
                res.send(ans);
            } else {
                res.send({ message: "error" })
            }
        });
});

// answer yes or no 
router.post('/answer/yesorno/:questionId', function (req, res, next) {
    if (req.query.ans == 'yes') {
        Question.findOneAndUpdate({ _id: req.params.questionId },
            { $push: { "question_type.yes": req.query.userId } }, function (err, ans) {
                if (!err) {
                    res.send(ans);
                } else {
                    res.send({ message: "error" })
                }
            }).catch(next);
    } else if (req.query.ans == 'no') {
        Question.findOneAndUpdate({ _id: req.params.questionId },
            { $push: { "question_type.no": req.query.userId } }, function (err, ans) {
                if (!err) {
                    res.send(ans);
                } else {
                    res.send({ message: "error" })
                }
            }).catch(next);
    }
});


// up and down vote
router.post('/answer/upordown/:questionId/:answerId', function (req, res, next) {
    if (req.query.ans == 'up') {
        Question.find({ _id: req.params.questionId }).then(function (r) {
           
        });
    } else if (req.query.ans == 'down') {
        Question.findOneAndUpdate({ _id: req.params.questionId },
            { answers: { _id: req.params.anwerId } }, function (err, ans) {
                if (!err) {
                    res.send(ans);
                } else {
                    res.send({ message: "error" })
                }
            }).catch(next);
    }
});

// set verified answer

module.exports = router;