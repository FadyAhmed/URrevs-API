const mongoose = require('mongoose');
const CommentSchema = require('./review_comments');
const Schema = mongoose.Schema;

const AnswerSchema = Schema({
    answer: {
        type: String,
        required: true
    },
    up_votes: {
        type: Number,
        default: 0
    },
    down_votes: {
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    }
});

const YesQuestionSchema = Schema({
    yes: {
        type: Number
    },
    no: {
        type: Number
    },
    question: {
        type: String
    }
});

const QuestionSchema = Schema({
    question: {
        type: YesQuestionSchema,
        required: true
    },
    date: {
        type: String
    },
    likes: {
        type: [LikeSchema]
    },
    answers: {
        type: [AnswerSchema]
    },
    correct_answer: {
        type: AnswerSchema
    }
});

const Question = mongoose.model('question', QuestionSchema, 'questions');

module.exports = Question;