var express = require('express');
var app = express();
var path = require("path");
var morgan = require('morgan');

var router = require('./routes');
const { nextTick } = require('process');

app.use(morgan('tiny'));

var staticPath = path.join(__dirname, "/public");
app.use(express.static(staticPath));
//app.use('/', router);

app.listen(8083);
module.exports = app;