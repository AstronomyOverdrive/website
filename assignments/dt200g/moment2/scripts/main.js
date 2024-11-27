"use strict";

// Listen for button press
document.getElementById("menu-btn").addEventListener("click", openMenu);
document.getElementById("close-btn").addEventListener("click", closeMenu);
// Close menu if user clicks outside of it
document.getElementById("darken-background").addEventListener("click", closeMenu);

// Gather elements
const menuElements = document.querySelectorAll(".menu-open");
const navMenu = document.getElementById("navigation");

// Show menu
function openMenu(){
    menuElements.forEach((element) => {
        element.style.display = "block";
    });
    navMenu.style.display = "block";
}

// Hide menu
function closeMenu(){
    menuElements.forEach((element) => {
        element.style.display = "none";
    });
    navMenu.style.display = "none";
}

function hideMenu(){ /* Fixes bug where menu stays open when changing to desktop */
    if (window.innerWidth >= 1024){
        menuElements.forEach((element) => {
            element.style.display = "";
        });
        navMenu.style.display = "";
    }
};

// Event Handler
addEventListener("resize", hideMenu);
