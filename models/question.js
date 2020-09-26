const mongoose = require('mongoose');
const LikeSchema = require('./review_likes');
const Schema = mongoose.Schema;

const AnswerSchema = Schema({
    user_id: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    up_votes: {
        type: [String],
        createIndex: true
    },
    down_votes: {
        type: [String],
        createIndex: true
    },
    date: {
        type: String
    }
});

const YesQuestionSchema = Schema({
    product: {
        type: String
    },
    yes: {
        type: [String],
    },
    no: {
        type: [String],
    },
});

const AboutPhoneSchema = Schema({
    product: {
        type: String,
        required: true
    },
    for_users: {
        type: Boolean
    },
    for_famous: {
        type: String
    },
});

const QuestionSchema = Schema({
    question_type_s: {
        type: String,
    },
    question_type: {
        type: YesQuestionSchema || AboutPhoneSchema,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    date: {
        type: String,
        createIndex: true
    },
    likes: {
        type: [LikeSchema]
    },
    answers: {
        type: [AnswerSchema]
    },
    best_answer: {
        type: String
    }
});

const Question = mongoose.model('question', QuestionSchema, 'questions');

module.exports = Question;