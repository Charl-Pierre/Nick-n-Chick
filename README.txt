Group 23
Busenur Yilmaz (9296037)
Charl-Pierre Marais (0820830)
Nick Mandoeng (3774744)

http://webtech.science.uu.nl/group23/index.html


{A brief explanation of your web-site, the structure of your application, including every content file and every code file(??????), the structure of your database.}
Whenever a file needs access to a resource from the database, the request first goes through router.js and then executes the target function. waaaaaaaaaaaaaaaaaaaaaaaaaaaaah

...dus.......deze moeten ig allemaal opgenoemd worden??
account.html
login.html
password.html
register.html
aboutus.html
contact.html
index.html
menu.html
reserveren.html
_
app.js
database.js
menu.js
routes.js
visuals.js
_
style.css
database.db

--The Database--
The database contains user accounts, a menu of all the dishes we sell and an order archive that holds all the orders we've had an the items that were ordered
The users are saved in a single table containing the ID, username, password and email of every user.
The menu is saved as a combination of an item table and category table. The category table contains 4 types of things we sell and the item table contains the actual dishes.
Every item has a name, price, size, category, image and a boolean of whether it's vegetarian or not. The images column contains links to the image addresses on Imgur where we saved them.
Orders are saved as a combination of Order and OrderItems. The former contains an order ID, the user that placed the order as well as the date that it was ordered.
The OrderItems table contains all the separate items from all orders. They possess a foreign key to the Order they belong to, a foreign key to the menu item they represent as well as the amount of the item that was ordered.

Registered Users:
Name: Charlie, Password: poep 
Name: Buse, Password: plas
Name: Nick, Password: diarree

SQL Definition:

CREATE TABLE Menu (
    ID       INTEGER PRIMARY KEY AUTOINCREMENT
                     UNIQUE,
    Name     TEXT,
    Image    STRING,
    Price    DECIMAL,
    Size     TEXT,
    IsVeggie BOOLEAN,
    Category INTEGER REFERENCES MenuCategory (ID) 
);
CREATE TABLE MenuCategory (
    ID   INTEGER PRIMARY KEY,
    Name TEXT
);
CREATE TABLE OrderItems (
    OrderID INTEGER REFERENCES Orders (OrderID),
    ItemID  INTEGER REFERENCES Menu (ID),
    Amount  INTEGER
);
CREATE TABLE Orders (
    OrderID  INTEGER PRIMARY KEY AUTOINCREMENT
                     UNIQUE,
    Username TEXT    REFERENCES Users (Username),
    Date     DATE
);
CREATE TABLE Users (
    ID       INTEGER PRIMARY KEY AUTOINCREMENT
                     UNIQUE,
    Username TEXT    UNIQUE,
    Password TEXT,
    Email    TEXT
);

Links to used images:
https://www.dailysquat.com/president-trump-accused-of-ruining-wings-wednesday/
https://www.groupaccommodation.com/properties/thirley-cotes-farm-scarborough-yorkshire
https://www.entrepreneur.com/article/246909
https://www.istockphoto.com/nl/foto/niet-sportief-dikke-man-op-oktoberfest-bier-drinken-en-eten-van-kip-been-op-gele-gm825593056-133964537
https://www.123rf.com/photo_105348251_happy-little-girl-feeding-chickens-in-front-of-chicken-farm-summer-activities-for-kids-.html

All other images were either made by us or made using royalty free assets like Mock up PSDs and publically available social media icons.
