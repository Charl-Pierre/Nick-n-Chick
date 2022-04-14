//this script reacts to all client requests and executes the handler functions accordingly

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

//Serve the register page
router.get('/register.html', (req, res) => {
    res.sendFile('private/register.html', {root: __dirname})
})

//Fetches the menu as a list of items to be sorted client-side
router.get('/getMenu', (req, res) => {
    res.contentType('application/json');
    db.getMenu((data) => {
        res.status(200).json(data);
    }, (error) => {
        res.status(501).json({ error: error.message});
    });
});

//Fetches a list of a given user's past orders.
router.get('/getHistory', (req, res) => {
    res.contentType('application/json');

    //If not logged in, disallow history functionality to prevent broken access control
    if(!req.session.loggedIn){
        res.status(403).json("Not allowed");
        return;
    }

    //Get a list of previous order ID's
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

        //Get a list of orderItems matching the order ID's
        db.getHistoryItems((orderHistoryItems) =>{
            //Add orderItem to it's respective order
            orderHistoryItems.forEach((item) => {
                var order = orders[item.OrderID];
                order.Items.push(item);
            })
            
            res.status(200).json(orders);
        }, (error) => {
            res.status(501).json({ error: error.message});
        }, orderHistory)
    }, (error) => {
        res.status(501).json({ error: error.message});
    }, req.session.userid);
});

//Places an order into the database
router.post('/placeOrder', (req, res) => {
    //Check if user is logged in
    if (req.session.loggedIn) {
        db.placeOrder(() => {
            res.status(200).json({ success: "Order placed succesfully"});
        }, req.body.order, req.session.userid);
    } else {
        res.status(403).json({ error: "User is not logged in."});
    }
    
})

/*Routes the user to either the login page or profile based
depending on whether they're logged in or not.*/
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

/*Authenticates the user if they're username/password combination
exists within the database*/
router.post('/login',(req,res) => {
    db.getUser(() => {
        //If logged in succesfully, assign a session ID
        var session=req.session;
        session.userid=req.body.username;
        req.session.loggedIn = true;
        console.log(req.session)

        //Send user to account page as they are now logged in.
        res.sendFile('private/account.html',{root:__dirname})
    }, () => {
        res.send('Invalid username or password');
    }, req.body.username, req.body.password);
})

/*Registers a user in the database*/
router.post('/register', (req, res) => {
    db.addUser(() => {
        //If registered in succesfully, assign a session ID
        var session=req.session;
        session.userid = req.body.username;
        req.session.loggedIn = true;
        console.log(req.session);
        //Send user to account page as they are now logged in.
        res.sendFile('private/account.html',{root:__dirname})
    }, () => {
        //Notify the user if an error occurs
        //This is most likely due to the username being taken already.
        res.send('Failed to register account');
    }, req.body.username, req.body.password, req.body.email)
})

//Logs the user out and destroys the session.
router.get('/logout', (req,res) => {
    console.log('logout test')
    req.session.destroy();
    res.sendFile('public/index.html',{root:__dirname})
});

//Routes the user to a page where they can change their password
router.get('/passwordPage', (req, res) => {
    //Check if logged in to avoid unintended behavior
    if(req.session.loggedIn) {
        res.sendFile('private/password.html',{root:__dirname})
    } else {
        res.sendFile('public/index.html',{root:__dirname})
    }
})

//Changes the user's password if they entered their old one in correctly
router.post('/changePassword', (req, res) => {
    //Check if logged in to avoid unintended behavior
    if(req.session.loggedIn) {
        db.changePassword(() => {
            //Send user back to account page if succesful.
            res.sendFile('private/account.html',{root:__dirname})
        }, () => {
            res.send('Failed to update password');
        }, req.session.userid, req.body.oldpassword, req.body.newpassword);
        
    } else {
        res.sendFile('public/index.html',{root:__dirname})
    }
})


module.exports = router, db;