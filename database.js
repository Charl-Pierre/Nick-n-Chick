var fs = require("fs");
const { debug, Console } = require('console');
const res = require("express/lib/response");
var file = "database.db";
var exists = fs.existsSync(file);
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

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

function getHistoryItems(callback, errorcallback, orderHistory) {
    var orderIDs = "";
    for(i = 0; i < orderHistory.length; i++){
        orderIDs += orderHistory[i].OrderID;
        if (i+1 < orderHistory.length){
            orderIDs += ", ";
        }
    }
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

module.exports = { getMenu, getUser, getHistory, getHistoryItems }