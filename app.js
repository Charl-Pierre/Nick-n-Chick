var express = require('express');
var app = express();
var path = require("path");
var morgan = require('morgan');

var router = require('./routes');
const { nextTick } = require('process');

app.use(morgan('tiny'));

app.use('/', (req, res, next) => {
    console.log('poop');
    next()
  })

app.use('/', router);
var staticPath = path.join(__dirname, "/public");
app.use(express.static(staticPath));





app.listen(8023);
module.exports = app;