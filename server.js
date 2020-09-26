const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Review = require('./models/reviews');

// set up app
const app = express();

// connect to mongodb
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/urrevs', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

app.use(bodyParser.json());

app.use('/urrevs', require('./routes/reviews'));
app.use('/urrevs', require('./routes/likes'));
app.use('/urrevs', require('./routes/comments'));
app.use('/urrevs', require('./routes/questions'));
app.use('/urrevs', require('./routes/user'));
app.use('/urrevs', require('./routes/article'));
app.use('/urrevs', require('./routes/phone'));

// handling error
app.use(function (error, req, res, next) {
    res.status(422).send(error.message);
});

// listen for requests
app.listen(process.env.port || 4000, function () {
    console.log('listing');
});