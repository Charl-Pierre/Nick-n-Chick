Group 23
Busenur Yilmaz (9296037)
Charl-Pierre Marais (0820830)
Nick Mandoeng (3774744)

http://webtech.science.uu.nl/group23/index.html

Our application uses the following structure: 

(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ 
=-=-=-=-= 
The Files
=-=-=-=-=
app.js sets up the web app and imports all required modules.

The database.db contains all orderable items on our website, i.e. the food, drinks and merch. The database.js extracts the information from this database and routes.js converts it to readable lists. The menu.js script will then read these items from the database and handles how these items are displayed on the Menu part of the website, this menu being menu.html. 

Whenever the client performs an action (makes a request), on one of these html pages: [account.html, login.html, password.html, register.html and menu.html], i.e. the user tries to access a resource, it triggers a function in routes.js which then accesses the resource (in this case the database).

Visuals.js is the script that handles the visual configurations the user can change if they so desire, i.e. light, dark and true dark theme on different aspects of the website.

Style.css handles all css rules applied on the website.

Reserveren.html, aboutus.html, contact.html and index.html are all simple pages that do not use any particular scripts, instead using solely html+css code, and the linked visuals.js file in the footers. The images folder contains the images used on these pages, whereas the images used on the Menu page are uploaded on imgur and linked through there. 

=-=-=-=-=-=-= 
The Database 
=-=-=-=-=-=-=
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
