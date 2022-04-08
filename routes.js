var express = require('express');
const { send } = require('express/lib/response');
const res = require('express/lib/response');
const { path } = require('path');
var router = express.Router();
var db = require('./database.js');
var sessions = require('express-session');

router.use(sessions({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  resave: false 
}));

router.get('/getMenu', (req, res) => {
    res.contentType('application/json');
    db.getMenu((data) => {
        res.status(200).json(data);
    }, (error) => {
        res.status(501).json({ error: error.message});
    });
});

router.get('/getHistory', (req, res) => {
    res.contentType('application/json');

    if(!req.session.loggedIn){
        res.status(403).json("Not allowed");
        return;
    }

    db.getHistory((orderHistory) => {
        var orders = {};
        orderHistory.forEach(element => {
            var order = {
                ID: element.OrderID,
                Date: element.Date,
                Items: []
            }
            orders[element.OrderID] = order;
        });
        db.getHistoryItems((orderHistoryItems) =>{
            orderHistoryItems.forEach((item) => {
                var order = orders[item.OrderID];
                order.Items.push(item);
            })
            console.log(orders);
            
            res.status(200).json(orders);
        }, (error) => {
            res.status(501).json({ error: error.message});
        }, orderHistory)
    }, (error) => {
        res.status(501).json({ error: error.message});
    }, req.session.userid);
});

router.get('/account', (req, res) => {
    if (req.session.loggedIn)
    {
        res.sendFile('private/account.html', {root: __dirname})
    }
    else
    {
        res.sendFile('private/login.html', {root: __dirname});
    }
});

router.post('/login',(req,res) => {
    db.getUser(() => {
        var session=req.session;
        session.userid=req.body.username;
        req.session.loggedIn = true;
        console.log(req.session)
        res.sendFile('private/account.html',{root:__dirname})
    }, () => {
        res.send('Invalid username or password');
    }, req.body.username, req.body.password);
})

router.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});


module.exports = router, db;