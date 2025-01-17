// Not my finest work but at least it functions
"use strict";

/* * * * * * * *
 *  Webstorage *
 * * * * * * * */
function readStorage(){
    const data = JSON.parse(localStorage.getItem("cart"));
    if (data !== null){ // Return stored data if it exists, else return an empty array
        return data;
    } else {
        return [];
    }
}

function writeStorage(data){
    localStorage.setItem("cart", JSON.stringify(data));
}

function clearStorage(){
    localStorage.clear();
}

/* * * * * * * * * *
 *  Shopping cart  *
 * * * * * * * * * */
function Item(id, quantity){ // Used to create a new object
    this.id = id;
    this.quantity = quantity;
}

function getJSON(sendData){ // Get available products and send them to the specified function
    fetch("https://williampettersson.eu/assignments/dt200g/moment4/script/products.json")
    .then(response => response.json())
    .then(data => {
        if (sendData === 1){
            displayCart(data.products);
        } else if (sendData === 2){
            getSum(data.products);
        } else if (sendData === 3){
            finishOrder(data.products);
        } else if (sendData === 4){
            getAllProducts(data.products);
        }
    })
    .catch(error => console.log(error))
}

function getAllProducts(products){
    products.forEach(product => { // Loop through all available products and display them
        document.getElementById("products").innerHTML +=
        `<div class="product-container">
            <a href="https://williampettersson.eu/assignments/dt200g/moment4/products/${product.id}.html">
                <picture>
                    <source srcset="https://williampettersson.eu/assignments/dt200g/moment4/assets/images/product${product.id}_1.webp" type="image/webp">
                    <img src="https://williampettersson.eu/assignments/dt200g/moment4/assets/images/product${product.id}_1.jpg" alt="${product.name}">
                </picture>
                <div>
                    ${product.price}:-<br>
                    ${product.name}
                </div>
            </a>
        </div>`;
    });
}

function updateCart(product, quantity, add){
    let cart = readStorage();
    let create = true;
    if (cart !== null && cart.length !== 0){ // Check if the array contains items
        cart.forEach(item => { // Loop through array and set item quantity if found
            if (item.id === product){
                if (add){
                    item.quantity += quantity;
                } else {
                    item.quantity = quantity;
                }
                create = false;
            }
        });
    }
    if (create){ // Item wasn't found so create a new object and add it to the array
        cart.push(new Item(product, quantity));
    }
    writeStorage(cart); // Store updated array
    getJSON(2); // Get total cost in cart
    if (document.getElementById("shopping-cart") !== null){ // Update cart if on checkout page
        getJSON(1);
    }
    if (document.getElementById("amount") !== null){ // Update amount of product in cart if on product page
        displayAmount(product);
    }
}

function displayCart(products){
    const cart = readStorage();
    let data = "";
    cart.forEach(item => { // Loop through array and and everything in it to a string
        if (item.quantity > 0){
            const productInfo = getProductInfo(products, item.id);
            const price = item.quantity * productInfo.price;
            const name = productInfo.name;
            data += `<div>${item.quantity}x <a href="https://williampettersson.eu/assignments/dt200g/moment4/products/${item.id}.html">${name}</a> - ${price}:-
            <span style="white-space: nowrap;">| <button onclick="updateCart('${item.id}', 1, true)">+</button>
            <button onclick="updateCart('${item.id}', -1, true)">-</button>
            <button onclick="updateCart('${item.id}', 0, false)">Ta bort</button></span></div><br>`;
        }
    });
    if (data === ""){ // Check if empty or not and update text accordingly
        data = "Tomt! Lägg till produkter i varukorgen så visas de här.";
    } else {
        data += "<button onclick='placeOrder()'>Slutför köp</button>";
    }
    document.getElementById("shopping-cart").innerHTML = data; // Display cart
}

function displayAmount(product){
    const cart = readStorage();
    cart.forEach(item => { // Loop through array and display amount of current product in it
        if (item.id === product){
            const element = document.getElementById("amount");
            element.innerText = `${item.quantity}x`;
            if (item.quantity > 0){
                element.innerHTML += ` <button onclick="updateCart('${item.id}', -1, true)">-</button> <button onclick="updateCart('${item.id}', 0, false)">Ta bort</button>`;
            }
        }
    });
}

function getProductInfo(products, find){ // Get info for specific product
    let information;
    products.forEach(product => {
        if (product.id === find){
            information = product;
        }
    });
    return information;
}

function getSum(products){ // Get total cost in cart and display it
    let cart = readStorage();
    let sum = 0;
    cart.forEach(item => {
        const productInfo = getProductInfo(products, item.id);
        sum += item.quantity * productInfo.price;
    });
    if (sum === 0) {
        sum = "tom";
    } else {
        sum += ":-";
    }
    document.getElementById("cart-info").innerText = `(${sum})`;
}

function placeOrder(){
    document.getElementById("confirmation").style.display = "block"; // Show processing screen
    // Redirect after 2 seconds
    setTimeout(() => {
        window.location.href = "receipt.html";
    }, 2000);
}

function finishOrder(products){ // Loop through cart, display info and then empty cart
    const cart = readStorage();
    let listItems = "";
    let sum = 0;
    cart.forEach(item => {
        if (item.quantity > 0){
            const productInfo = getProductInfo(products, item.id);
            const price = item.quantity * productInfo.price;
            listItems += `<dd>${item.quantity}x "${productInfo.name}" ${price}:-</dd>`;
            sum += price;
        }
    });
    document.getElementById("purchase").innerHTML = `<dt>Produkter:</dt>${listItems}<dt>Slutsumma:</dt><dd>${sum}:-</dd>`;
    clearStorage();
    getJSON(2);
}

addEventListener("load", getJSON(2)); // Get total cost in cart

/* * * * * * * * * *
 *  Image carousel *
 * * * * * * * * * */
let miniOrder = [100, 0, 50]; // Image positions in sprite sheet
let fullImage = ["img3", "img1", "img2"];

function cycleList(right){ // Cycle through sprite sheet & picture elements
    if (right){
        miniOrder.unshift(miniOrder.pop());
        fullImage.unshift(fullImage.pop());
    } else {
        miniOrder.push(miniOrder.shift());
        fullImage.push(fullImage.shift());
    }
    document.getElementById('mini1').style.backgroundPosition = `${miniOrder[0]}%`;
    document.getElementById('mini2').style.backgroundPosition = `${miniOrder[1]}%`;
    document.getElementById('mini3').style.backgroundPosition = `${miniOrder[2]}%`;
    document.getElementById(`${fullImage[0]}`).style.display = "none";
    document.getElementById(`${fullImage[1]}`).style.display = "block";
    document.getElementById(`${fullImage[2]}`).style.display = "none";
}
