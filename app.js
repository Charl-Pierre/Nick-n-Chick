var express = require('express');
var app = express();
var path = require("path");
var morgan = require('morgan');

var router = require('./routes');
const { nextTick } = require('process');

app.use(morgan('tiny'));

var staticPath = path.join(__dirname, "/public");
app.use(express.static(staticPath));
app.use('/', router);

router.test();

app.listen(8081);
module.exports = app;