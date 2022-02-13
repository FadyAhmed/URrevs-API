const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cron = require("node-cron");
const Brand = require("./models/brand");
const morgan = require("morgan");

// set up app
const app = express();

const uri =
  "mongodb+srv://user:5654@urrevsdemo.bungf.mongodb.net/urrevs?retryWrites=true&w=majority";
// const uri = "'mongodb://localhost/urrevs";

// connect to mongodb
mongoose.set("useFindAndModify", false);
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

mongoose.connect(uri, (err) => {
  if (err) console.log(err);
});

mongoose.Promise = global.Promise;

app.use(morgan("tiny"));

app.use(bodyParser.json());

app.use("/urrevs", require("./routes/reviews"));
app.use("/urrevs", require("./routes/likes"));
app.use("/urrevs", require("./routes/comments"));
app.use("/urrevs", require("./routes/questions"));
app.use("/urrevs", require("./routes/user"));
app.use("/urrevs", require("./routes/article"));
app.use("/urrevs", require("./routes/phone"));
app.use("/urrevs", require("./routes/brand_routes"));

// handling error
app.use(function (error, req, res, next) {
  res.status(422).send(error.message);
});

// listen for requests
app.listen(4000, function () {
  console.log("listening");
  cron.schedule("0 */1 * * *", function () {
    console.log("d");
    Brand.updateMany(
      {},
      { $pull: { story: { until: { $lt: Math.floor(Date.now() / 1000) } } } }
    );
  });
});
