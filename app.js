//imports all modules we need for this webapp and 
var express = require('express');
var app = express();
var path = require("path");
var morgan = require('morgan');
const cookieParser = require("cookie-parser");


var router = require('./routes');
const { nextTick } = require('process');

app.use(morgan('tiny'));

//parse incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serve public pages
app.use('/', router);
var staticPath = path.join(__dirname, "/public");
app.use(express.static(staticPath));

// cookie parser middleware
app.use(cookieParser());



app.listen(8023);
module.exports = app;