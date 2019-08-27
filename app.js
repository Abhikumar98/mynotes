var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors = require('cors')


var app = express();
dotenv.config();
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true },(err,data)=>{
    if(err) return console.log("error occured ===========>",err);
    else console.log("Database connected");
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
