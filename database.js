var fs = require("fs");
const { debug, Console } = require('console');
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

module.exports = { getMenu, getUser }