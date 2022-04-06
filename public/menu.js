const tempAside = document.createElement('aside');
var bucketList;
window.addEventListener('load', function () {
onLoad();
})

function getMenu(callback) {
    $.ajax({
        url: 'getMenu',
        type: 'GET',
        dataType: 'json',
        success: function (result) {
            //console.log(result);
            callback(processMenu(result));
        },
        error: function (error) {
            console.log(error);
            callback(new Menu([]))
        }
    })
}

function processMenu(menuJSON) {
    menuJSON.forEach(element => {
        console.log(element);
        


    });
}


function onLoad() {

    const menuSection = document.getElementsByTagName('section')[0];
    menuSection.classList.add('menuSection');

    getMenu(console.log);
    

    //make new bucketlist + menu
    var menu = new Menu();
    bucketList = new BucketList();

    //Make Bucket category + add children.
    c_bucket = new Category("Buckets");
    c_bucket.addItem(new Bucket("Fried Chicken Bucket", 12.99, "10 Pieces", false, 10, 1, "https://i.imgur.com/hk3Wp5r.png"));
    c_bucket.addItem(new Bucket("Deep Fried Chicken Bucket", 12.99, "10 Pieces", false, 10, 1, "https://i.imgur.com/ND2Vzqp.png"));
    c_bucket.addItem(new Bucket("Mixed Chicken Bucket", 15.99, "5 Fried, 5 Spicy Pieces", false, 10, 3, "https://i.imgur.com/RN2Vztc.png"));
    c_bucket.addItem(new Bucket("Hot Chicken Bucket", 15.99, "10 Pieces", false, 10, 3, "https://i.imgur.com/1IytQkC.png"));
    c_bucket.addItem(new Bucket("Veggie Chicken Bucket", 13.99, "10 Pieces", true, 10, 1, "https://i.imgur.com/ND2Vzqp.png"));

    //Make Drinks category + add children.
    c_drinks = new Category("Drinks");
    c_drinks.addItem(new Drink("Cola", 2.99, "500 mL", true, "https://i.imgur.com/Y5u0bNB.png"));
    c_drinks.addItem(new Drink("Fanta", 2.99, "500 mL", true, "https://i.imgur.com/IsWe3Vp.png"));
    c_drinks.addItem(new Drink("Boba", 3.99, "500 mL", true, "https://i.imgur.com/LB1Agw2.png"));
    c_drinks.addItem(new Drink("Special Surprise Drink", 4.99, "500 mL", true, "https://i.imgur.com/pEGOVvM.png"));

    //Make Extras category + add children.
    c_extras = new Category("Extras");
    c_extras.addItem(new Extra("Fries", 1.99, "Small", true, "https://i.imgur.com/kcR6CkI.png"));
    c_extras.addItem(new Extra("Medium Fries", 2.99, "Medium", true,"https://i.imgur.com/kcR6CkI.png"));
    c_extras.addItem(new Extra("Large Fries", 3.99, "Large", true,"https://i.imgur.com/kcR6CkI.png"));

    c_merch = new Category("Merch");
    c_merch.addItem(new Merch("T-Shirt", 13.99, "M", true, 'Black', "images/Merch_Shirt.png"));
    c_merch.addItem(new Merch("Bikini", 15.99, "M", true, 'Red', "images/Merch_Swimsuit.png"));
    c_merch.addItem(new Merch("Baby Rompertje", 10.99, "Smol", true, 'White', "images/Merch_BabyRompertje.png"));

    //add categories to the menu
    menu.addCategory(c_bucket);
    menu.addCategory(c_drinks);
    menu.addCategory(c_extras);
    menu.addCategory(c_merch);

    menuSection.appendChild(bucketList.element);
    menuSection.appendChild(menu.element);

    //final order button
    var orderButton = document.createElement('button');
    orderButton.appendChild(document.createTextNode('Place Order'));
    orderButton.classList.add('Order_Button');

    orderButton.onclick = placeOrder;
    menuSection.appendChild(orderButton);

}

class Menu {
    categories = [];
    element;
    constructor()
    {
        //makes menu + adds classname
        this.element = document.createElement('div');
        this.element.classList.add('Menu');
        this.element.style = 'width: 70%;';
    }

    addCategory(category) {
        //adds an item html to cat html
        this.categories.push(category);
        this.element.appendChild(category.element);
    }
}

class Category {
    items = [];
    element;
    constructor(name){
        this.name = name;
        this.element = document.createElement('div');
        this.element.appendChild(document.createTextNode(this.name));
        this.element.classList.add('Category');
    }

    //add item to the order
    addItem(item){
        this.items.push(item);
        this.element.appendChild(item.element); //adds an item html to cat html
    }
}

class Item {
    name;
    price;
    size;
    isVeggie;
    element;
    bucketElement;
    imgstr
    count = 0;
    constructor(name, price, size, isVeggie, imgstr) {
        //Apply specifications of item
        this.name = name;
        this.price = price;
        this.size = size;
        this.isVeggie = isVeggie;
        this.imgstr = imgstr

        //Create item div and its children
        var text = document.createTextNode(`${this.name} (${this.price})`);
        this.element = document.createElement('div');
        var button = document.createElement('button');
        var minButton = document.createElement('button');
        const img = document.createElement('img');
        img.src = imgstr;


        //Append children to item div
        this.element.appendChild(img);
        this.element.appendChild(text);
        this.element.appendChild(button);
        this.element.appendChild(minButton);

        //Add classes to elements
        this.element.classList.add('Item');
        img.classList.add('MenuImg');
        button.classList.add('Item_Button');
        minButton.classList.add('Item_Button');

        //Add text to buttons
        button.appendChild(document.createTextNode("Add to Bucket"));
        minButton.appendChild(document.createTextNode("Remove from Bucket"));

        //Create element to be added to order list
        this.bucketElement = document.createElement('p');
        this.bucketElement.appendChild(document.createTextNode(`${this.count})`));
        this.bucketElement.appendChild(document.createTextNode(name + "  " + price));


        const _item = this;

        //on click event add button, adds one of the selected item to the order
        const inputHandler = function(e)
        {
            var item = _item;
            item.count += 1;
            bucketList.addItem(item);
            item.bucketElement.childNodes[0].nodeValue = '(' + item.count + ') ';
        }
        button.onclick = inputHandler;

        //on click event remove button, removes one of the selected item from the order
        const minputHandler = function(e)
        {
            var item = _item;

            item.count -= 1;
            item.count = Math.max(item.count, 0);
            if (item.count <= 0)
            {
                item.bucketElement.remove();

            }
            bucketList.removeItem(item);
            item.bucketElement.childNodes[0].nodeValue = '(' + item.count + ') ';
        }
        minButton.onclick = minputHandler;
    }
}

class Bucket extends Item {
    //extra aspects: pieces count, spicyness
    constructor(name, price, size, isVeggie, pieceCount, spicyness, imgstr) {
        super(name, price, size, isVeggie, imgstr);
        this.pieceCount = pieceCount;
        this.spicyness = spicyness;
    }
}

class Drink extends Item  {
}

class Extra extends Item  {
}

class Merch extends Item  {
    //extra aspect: color
    constructor(name, price, size, isVeggie, color, imgstr) {
        super(name, price, size, isVeggie, imgstr);
        this.color = color;
    }
}

class BucketList {
    list= [];
    element;
    constructor(){
        this.element = document.createElement('aside');
        this.element.id = 'bucketList';
        var txt = document.createElement('b').appendChild(document.createTextNode('Bucket list:'));
        this.element.appendChild(txt);
        var totalText = document.createElement('b').appendChild(document.createTextNode(''));
        this.element.appendChild(totalText);
        this.element.classList.add('bucketList');
    }

    addItem(item)
    {
        if (!this.list.includes(item)){
            this.list.push(item);
            this.element.insertBefore(item.bucketElement, this.element.lastChild);
        }
        this.updateTotal();
    }


    removeItem(item)
    {
        if (item.count == 0)
        {
            for (var i = 0; i < this.list.length; i++){
                if (this.list[i].name == item.name){
                    this.list.splice(i, 1);
                    break;
                }
            }
        }
        this.updateTotal();
    }

    updateTotal()
    {
        var total = 0;
        for (var i = 0; i < this.list.length; i++){
            total += this.list[i].price * this.list[i].count;
        }

        total = total.toFixed(2);
        this.element.lastChild.nodeValue = 'Total Price: ' + total;
        if (this.list.length == 0) this.element.lastChild.nodeValue = '';
    }
}

function placeOrder()
{
    if (bucketList.list.length == 0){
        window.alert("Can't place an empty order!")
    }
    else {
        //window.alert('Big McThankies from McSpankies!');
        window.open("https://www.paypal.com/paypalme/nickandco", '_blank').focus();
    }
}

