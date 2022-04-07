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
    //make category obj
    categories = {};
    menuJSON.forEach(element => {
        if(!(element.Category in categories))
        {
            categories[element.Category] = [];
            //console.log('adding new category: ' + element.Category);
        }
        categories[element.Category].push(element);
        //console.log('adding ' + element.Name + " to " + element.Category);

    });
    
    var menu = new Menu();
    for (var element1 in categories) {
        var category = new Category(element1);

        categories[element1].forEach(element2 => {
            var item = new Item(element2.Name, element2.Price, element2.Size, element2.IsVeggie, element2.Image);
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

