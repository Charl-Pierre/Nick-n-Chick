//processes the menu and prints them onto the page with some nice styling
const tempAside = document.createElement('aside');
var bucketList;
window.addEventListener('load', function () {
onLoad();
})

//get and process menu
function getMenu(callback) {
    $.ajax({
        url: 'getMenu',
        type: 'GET',
        dataType: 'json',
        success: function (result) {
            callback(processMenu(result));
        },
        error: function (error) {
            //if it fails, log the error and return an empty menu
            console.log(error);
            callback(new Menu([]))
        }
    })
}

function processMenu(menuJSON) {
    categories = {};
    //for each element in the JSON, it adds it to the list of categories
    menuJSON.forEach(element => {
        if(!(element.Category in categories))
        {
            categories[element.Category] = [];
        }
        categories[element.Category].push(element);
    });
    var menu = new Menu();
    for (var element1 in categories) {
        var category = new Category(element1);

        categories[element1].forEach(element2 => {
            var item = new Item(element2.Name, element2.ID, element2.Price, element2.Size, element2.IsVeggie, element2.Image);
            category.addItem(item);
        });
        menu.addCategory(category);
    }
    return menu;
}

function onLoad() {

    const menuSection = document.getElementsByTagName('section')[0];
    menuSection.classList.add('menuSection');

    getMenu(menu => {
        menuSection.insertBefore(menu.element, menuSection.lastChild);
    });
    
    bucketList = new BucketList();
    menuSection.appendChild(bucketList.element);

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
        //adds an item html to category html
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
    ID;
    price;
    size;
    isVeggie;
    element;
    bucketElement;
    imgstr
    count = 0;
    constructor(name, ID, price, size, isVeggie, imgstr) {
        //Apply specifications of item
        this.name = name;
        this.ID = ID;
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

// BucketList is how we call our 'shopping cart'. 
//It's a pun on the term bucket list and the buckets that our chicken comes in
class BucketList {
    list= [];
    element;
    orderButton;
    constructor(){

        //Create DOM element for the list
        this.element = document.createElement('aside');
        this.element.id = 'bucketList';
        var txt = document.createElement('b').appendChild(document.createTextNode('Bucket list:'));
        this.element.appendChild(txt);
        this.element.classList.add('bucketList');

        //Create DOM element for the 'place order' button
        var orderForm = document.createElement('form');
        this.orderButton = document.createElement('input');
        this.orderButton.type = 'submit';
        this.orderButton.value = "Place order (0)";
        this.orderButton.classList.add('logknop');
        this.orderButton.onclick = placeOrder;

        //Append everything appropriately
        orderForm.appendChild(this.orderButton);
        this.element.appendChild(orderForm);
        
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
        this.orderButton.value = 'Place Order (' + total + ')';
        if (this.list.length == 0) this.orderButton.value = 'Place Order (0)';
    }
}

function placeOrder()
{
    event.preventDefault();

    //Prevent users from placing an empty order
    if (bucketList.list.length == 0){
        window.alert("Can't place an empty order!")
    }
    else {
        orderItems = [];
        
        //Extract the necessary data out of the bucketlist
        bucketList.list.forEach(element => {
            orderItems.push({id: element.ID, amount: element.count });
        });

        //Send a POST request
        $.ajax({
            url: 'placeOrder',
            type: 'POST',
            dataType: 'json',
            data: {order: orderItems},

            //If the order was succesfully placed, reload the page
            success: function (result) {
                location.reload();
            },
            //If the user is not logged in, send them to the login page.
            error: function (error) {
                window.location.replace('/account');
                
            }
        });
    }
}

