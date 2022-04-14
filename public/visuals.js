// this file changes the colors of the website according to the user's wishes (as it is configured in the footer)
window.addEventListener('load', function () //boo(se), schrik it's a me
{
    //Get footer object
    var footer = document.getElementsByTagName("footer")[0];

    
    const menuContainer = document.createElement('div');
    menuContainer.classList.add('styleMachine');

    //----------------------------------
    //---Create a element select menu---
    //----------------------------------
    const elementMenu = document.createElement('select');
    elementMenu.name = 'elements';
    elementMenu.id = 'element-select';
    elementMenu.onchange = onChangeElementType;

    //List of element types to capture
    var elementsToCapture = ['body', 'nav', 'header', 'article', 'section', 'aside'];

    //Check for elements and add to elementMenu if present
    for (i = 0; i < elementsToCapture.length; i++)
    {
        if (document.getElementsByTagName(elementsToCapture[i]).length != 0)
        {
            //Create option element
            var option = document.createElement('option');
            option.value = elementsToCapture[i];
            option.innerHTML = elementsToCapture[i];

            //Add option element to menu
            elementMenu.appendChild(option);
        }
    }

    //Add menu to footer of the page
    menuContainer.appendChild(elementMenu);

    //----------------------------------
    //---Create a color select menu---
    //----------------------------------
    const colorMenu = document.createElement('select');
    colorMenu.name = 'colors';
    colorMenu.id = 'color-select';
    colorMenu.onchange = onChangeColor;

    //List of available themes
    var colors = ['Dark', 'Light', 'True Dark'];

    for (i = 0; i < colors.length; i++)
    {
        //Create option element
        var option = document.createElement('option');
        option.value = i;
        option.innerHTML = colors[i];

        //Add option element to menu
        colorMenu.appendChild(option);
    }

    //Add menu to footer of the page
    menuContainer.appendChild(colorMenu);

    //----------------------------------
    //---Create a text size select menu---
    //----------------------------------
    const sizeMenu = document.createElement('select');
    sizeMenu.name = 'textSize';
    sizeMenu.id = 'textSize-select';
    sizeMenu.onchange = onChangeSize;

    //List of available themes
    var sizes = ['Small (50%)', 'Normal(100%)', 'Large (150%)'];

    for (i = 0; i < colors.length; i++)
    {
        //Create option element
        var option = document.createElement('option');
        option.value = i;
        option.innerHTML = sizes[i];
        if (i == 1) option.setAttribute('selected', 0);

        //Add option element to menu
        sizeMenu.appendChild(option);
    }

    //Add menu to footer of the page
    menuContainer.appendChild(sizeMenu);

    //Append menu to the footer
    footer.insertBefore(menuContainer, footer.firstChild);
})

function onChangeElementType(event)
{
    var selectedElementType = event.target.value;
    var colorMenu = document.getElementById('color-select');
    var sizeMenu = document.getElementById('textSize-select');
    var sampleElement = document.getElementsByTagName(selectedElementType)[0];

    //Check for existing themes
    colorMenu.value = 0;
    if (sampleElement.classList.contains('lightTheme')) colorMenu.value = 1;
    if (sampleElement.classList.contains('trueDarkTheme')) colorMenu.value = 2;

    //Check for existing textSizes
    sizeMenu.value = 1;
    if (sampleElement.classList.contains('Small')) sizeMenu.value = 0;
    if (sampleElement.classList.contains('Large')) sizeMenu.value = 2;
}

//Function to be run when the color selector is changed
function onChangeColor(event)
{
    //Get type of element selected
    var selectedElementType = document.getElementById('element-select').value;
    //Get list of selected element type
    var elements = document.getElementsByTagName(selectedElementType);

    //Change all elements of specified type
    for(i = 0; i < elements.length; i++)
    {
        //Remove any existing themes
        elements[i].classList.remove('darkTheme');
        elements[i].classList.remove('lightTheme');
        elements[i].classList.remove('trueDarkTheme');

        //Apply the appropriate theme
        switch(parseInt(event.target.value))
        {
            case 0:
                elements[i].classList.add('darkTheme');
                break;
            case 1:
                elements[i].classList.add('lightTheme');
                break;
            case 2:
                elements[i].classList.add('trueDarkTheme');
                break;
        }
    }

}

function onChangeSize(event)
{
    //Get type of element selected
    var selectedElementType = document.getElementById('element-select').value;
    //Get list of selected element type
    var elements = document.getElementsByTagName(selectedElementType);

    //Change all elements of specified type
    for(i = 0; i < elements.length; i++)
    {
        //Remove any existing size modifiers
        elements[i].classList.remove('Small');
        elements[i].classList.remove('Normal');
        elements[i].classList.remove('Large');

        //Apply the appropriate size modifier
        switch(parseInt(event.target.value))
        {
            case 0:
                elements[i].classList.add('Small');
                break;
            case 1:
                elements[i].classList.add('Normal');
                break;
            case 2:
                elements[i].classList.add('Large');
                break;
        }
    }
}

