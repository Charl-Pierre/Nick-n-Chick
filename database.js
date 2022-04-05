var fs = require("fs");
const { debug, Console } = require('console');
var file = "database.db";
var exists = fs.existsSync(file);
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
    if(!exists) {
        db.run("CREATE TABLE Stuff (thing TEXT)");
    }
    var stmt = db.prepare("INSERT INTO Stuff VALUES (?)");
    for (var i = 0; i < 1; i++) {
        stmt.run("Penis");
    }
    stmt.finalize();
    db.each("SELECT rowid AS id, thing FROM Stuff", function(err, row) {
        console.log(row.id + ": " + row.thing);
    });
});
db.close();