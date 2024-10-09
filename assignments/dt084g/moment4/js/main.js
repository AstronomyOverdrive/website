"use strict";

// Deklarera variabler
const inputField = document.getElementById("newtodo");
const addButton = document.getElementById("newtodobutton");
const messageField = document.getElementById("message");
const listSection = document.getElementById("todolist");
const clearButton = document.getElementById("clearbutton");
let textPermitted = false;

// Deklarera funktioner
function readStorage(){
    const storedKeys = Object.keys(localStorage); // Skapa en array med alla Web Storage nycklar

    storedKeys.sort((key1, key2) => { // Sortera nycklarna efter numeriskt värde(tid den skapades) genom att jämföra två värden i taget
        return key1 - key2;
    });
    storedKeys.forEach((key) => { // Loopa igenom all data i Web Storage och skapa DOM objekt
        const storedData = localStorage.getItem(key);
        addItem(key, storedData);
    });
}

function writeStorage(){
    if (textPermitted){
        const id = Date.now(); // Skapa unikt id genom att använda UNIX tid
        const itemText = inputField.value; // Hämta text från textrutan

        localStorage.setItem(id, itemText); // Spara värdet i Web Storage
        if (localStorage.getItem(id) === itemText){ // Kollar så att värdet sparades korrekt, lägg i så fall till det i DOM och rensa textrutan
            inputField.value = "";
            addItem(id, itemText);
        } else {
            messageField.innerHTML = "Lagring misslyckades!"; // Meddela användaren att det inte gick att spara
        }
    }
}

function clearStorage(){
    localStorage.clear(); // Rensa Web Storage
    listSection.innerHTML = ""; // Rensa DOM
}

function checkLength(){
    const text = inputField.value; // Hämta text från textrutan

    if (text.length < 5){ // Kollar om texten är tillräckligt lång nog att spara, skriv annars ett meddelande till användaren
        messageField.innerHTML = "Minst antal tecken: 5";
        textPermitted = false;
    } else {
        messageField.innerHTML = "";
        textPermitted = true;
    }
}

function addItem(id, text){ // Skapa en ny <article> i DOM med anteckningen
    listSection.innerHTML += "<article id='" + id + "' onclick='deleteItem(" + id + ")'>" + text + "</article>";
}

function deleteItem(id){
    document.getElementById(id).remove(); // Ta bort vald anteckning från DOM
    localStorage.removeItem(id); // Ta bort vald anteckning från Web Storage
}

// Event handlers
addEventListener("load", readStorage);
inputField.addEventListener("keyup", checkLength);
addButton.addEventListener("click", writeStorage);
clearButton.addEventListener("click", clearStorage);
