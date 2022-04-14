//This script handles any and all requests that have to do with the database.

var fs = require("fs");
const { debug, Console } = require('console');
const res = require("express/lib/response");
var file = "database.db";
var exists = fs.existsSync(file);
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

//Fetch the menu from the database.
function getMenu(callback, errorcallback) {
    var query = `   SELECT Menu.ID, Menu.Name, Menu.Image, Menu.Price, Menu.Size, Menu.IsVeggie, MenuCategory.Name as Category
                    FROM Menu, MenuCategory
                    WHERE Menu.Category = MenuCategory.ID`;
    console.log("Querying menu");
    db.serialize(() => {
        db.all(query, (error, result) => {
            if (error) {
                console.log("Database error: " + error.message);
                errorcallback(error);
            } else {
                console.log("Menu query successful")
                callback(result);
            }
        })

    })
}

//Insert order into database
function placeOrder(callback, order, username) {
    var orderQuery = `   INSERT INTO Orders (Username, Date)
                    VALUES ( ?, ? )`;   
    var date = new Date().toLocaleDateString("nl-NL");

    console.log('adding order to database');
    db.run(orderQuery, [username, date], function(error){
        if (!error){

            //Build a string of all the items in the order
            //Ex. "(1, 0, 1), (1, 2, 1)"
            var orderString = "";
            for(i = 0; i < order.length; i++){
                orderString += '(' + this.lastID + ', ' + order[i].id + ', ' + order[i].amount + ')';
                if (i+1 < order.length){
                    orderString += ', ';
                } else {
                    orderString += ';';
                }
            }
            
            var itemsQuery = `   INSERT INTO OrderItems (OrderID, ItemID, Amount)
                            VALUES` + orderString;
            console.log('adding order items to database');
            db.run(itemsQuery, function(error){
                if (!error){
                    console.log('order placed succesfully!')
                    callback();
                } else {
                    console.log('error adding order items to database');
                }
            })

        } else {
            console.log("Database error: " + error.message);
        }
    })
}

//Checks if user credentials are correct upon attempted login
function getUser(callback, incorrectcallback, username, password) {
    var query = `   SELECT *
                    FROM Users
                    WHERE Users.Username = ? AND Users.Password = ?`;
    db.all(query, [username, password], (error, rows, fields) => {
        if (error) {
            console.log('database error')         
        } else {
            if (rows.length != 0)   {
                console.log('login succesful')
                callback();   
            } else {
                incorrectcallback();
            }
                    
        }
    })
}

//Register a new user to the database
function addUser(callback, errorcallback, username, password, email) {
    var query = `   INSERT INTO Users (Username, Password, Email)
        	        VALUES ( ?, ?, ?)`;
    db.run(query, [username, password, email], function(error){
        if(!error){
            callback();
        } else {
            console.log("Database error: " + error.message);
            errorcallback()
        }
    })
}

//Change the password of an existing user
function changePassword(callback, incorrectcallback, username, oldPW, newPW) {

    //First check whether the old password matches the account
    var getQuery = `    SELECT *
                        FROM Users
                        WHERE Users.Username = ? AND Users.Password = ?`;
    db.all(getQuery, [username, oldPW], (error, rows, fields) => {
        if (error) {
            console.log('database error')         
        } else {
            //If the account was found, update its password
            if (rows.length != 0)   {
                var putQuery = `    UPDATE Users
                                    SET Password = ?
                                    WHERE Username = ?`
                db.run(putQuery, [newPW, username], function(error){
                    if(!error){
                        callback();
                    } else {
                        console.log("Database error: " + error.message);
                    }
                })
            } else {
                incorrectcallback();
            }
                    
        }
    })
}

//Get a list of order ID's matching past orders of a specific user.
function getHistory(callback, errorcallback, username) {
    var query = `   SELECT Orders.OrderID, Orders.Username, Orders.Date
                    FROM Orders
                    WHERE Orders.Username = ?`;
    console.log("Querying history of " + username);
    db.all(query, [username], (error, result) => {
        if (error) {
            console.log("Database error: " + error.message);
            errorcallback(error);
        } else {
            console.log("History query successful")
            callback(result);
        }
    })
}

//Get a list of orderItems pertaining to a list of order ID's
function getHistoryItems(callback, errorcallback, orderHistory) {

    //Concatenate the list of order ID's into a formatted string
    var orderIDs = "";
    for(i = 0; i < orderHistory.length; i++){
        orderIDs += orderHistory[i].OrderID;
        if (i+1 < orderHistory.length){
            orderIDs += ", ";
        }
    }

    //Select all orderItems for which their ID is in the specified list of order ID's
    var query = `  SELECT OrderID, Menu.Name, Menu.Price, Amount
                    FROM (
                        SELECT OrderItems.ItemID as ItemID, OrderItems.Amount AS Amount, OrderItems.OrderID as OrderID
                        FROM OrderItems
                        WHERE OrderItems.OrderID in (` + orderIDs + `)
                    )
                    LEFT JOIN Menu
                    ON Menu.ID = ItemID`
    console.log("Querying items of orders " + orderIDs);
    db.all(query, (error, result) => {
        if (error) {
            console.log("Database error: " + error.message);
            errorcallback(error);
        } else {
            console.log("History query successful")
            callback(result);
        }
    })
}

module.exports = { getMenu, placeOrder, getUser, addUser, changePassword, getHistory, getHistoryItems }