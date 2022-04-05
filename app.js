var express = require('express');
var app = express();
var path = require("path");
var morgan = require('morgan');

var routes = require('./routes');

app.use(morgan('tiny'));

var staticPath = path.join(__dirname, "/public");
app.use(express.static(staticPath));


app.listen(8081);
