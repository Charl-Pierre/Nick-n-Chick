var express = require('express');
const res = require('express/lib/response');
var router = express.Router();
var db = require('./database.js');
var morgan = require('morgan');
router.use(morgan('tiny'));


router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
  })

router.get('/getMenu', (req, res) => {
    res.contentType('application/json');
    db.getMenu((data) => {
        res.status(200).json(data);
    }, (error) => {
        res.status(501).json({ error: error.message});
    });
});

router.get('/', (req, res) => {
    res.send('Birds home page')
  })

module.exports = router