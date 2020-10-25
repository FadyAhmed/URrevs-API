const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cron = require('node-cron');
const Brand = require('./models/brand');
var admin = require('firebase-admin');

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
app.use('/urrevs', require('./routes/brand_routes'));

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://urrev.firebaseio.com'
});

// handling error
app.use(function (error, req, res, next) {
    res.status(422).send(error.message);
});

// listen for requests
app.listen(process.env.port || 4000, function () {
 
    
    console.log('listing');
    cron.schedule("0 */1 * * *", function () {
        console.log('d');
        Brand.updateMany(
            {},
            { $pull: { story: { until: { $lt: Math.floor(Date.now() / 1000) } } } });
    });
});