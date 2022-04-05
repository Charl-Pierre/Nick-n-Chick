var fs = require("fs");
const { debug, Console } = require('console');
var file = "database.db";
var exists = fs.existsSync(file);
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
    db.each("SELECT Name FROM Menu", function(err, row) {
        console.log(row.Name);
    });
});
db.close();