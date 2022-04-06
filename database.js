var fs = require("fs");
const { debug, Console } = require('console');
var file = "database.db";
var exists = fs.existsSync(file);
const sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database(file);

// db.serialize(function() {
//     db.each("SELECT Name FROM Menu", function(err, row) {
//         console.log(row.Name);
//     });
// });
// db.close();

function getMenu(callback, errorcallback) {
    var query = `   SELECT Menu.ID, Menu.Name, Menu.Image, Menu.Price, Menu.Size, Menu.IsVeggie, MenuCategory.Name
                    FROM Menu, MenuCategory
                    WHERE Menu.Category = MenuCategory.ID`;
    db.serialize(() => {
        db.all(query, (error, result) => {
            if (error) {
                console.log("Database error: " + error.message);
                errorcallback(error);
            } else {
                callback(result);
            }
        })

    })
}

module.exports = getMenu