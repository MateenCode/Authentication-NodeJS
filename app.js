var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}))
mongoose.Promise=require('bluebird');
mongoose.connect('mongodb://localhost:27017/userschema');
var basedata = mongoose.connection


app.use(session({
  secret: "bluebellicecream",
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: basedata
  })
}))



app.use(express.static(__dirname + '/views'));

var routes = require('./router/authentication');
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});



// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});



app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});
