var express = require('express');
const res = require('express/lib/response');
var router = express.Router();
var db = require('./database.js');

router.get('/getMenu', function(req, res, next) {
    console.log('flag2');
    res.contentType('application/json');
    db.getMenu((data) => {
        res.status(200).json(data);
    }, (error) => {
        res.status(501).json({ error: error.message});
    });
});

module.exports = router