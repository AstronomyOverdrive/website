"use strict";

let listOrder = [25, 50, 75, 100]; // Image positions in sprite sheet

function cycleList(right){ // Cycle through game covers in sprite sheet
    let move;
    if (right){
        move = listOrder.pop();
        listOrder.unshift(move);
    } else {
        move = listOrder.shift();
        listOrder.push(move);
    }
    const element = document.getElementById('carousel');
    element.style.backgroundPosition = listOrder[0]+'%'; // Set correct sprite as background
}

let angleShooters = 0;
let angleRacers = 0;

function rotateImg(img){ // Rotate cover missing image
    if (img === 1){
        const element = document.getElementById('shooters');
        angleShooters += 0.5;
        element.style.transform = 'rotate('+angleShooters+'turn)';
    } else {
        const element = document.getElementById('racing');
        angleRacers += 0.5;
        element.style.transform = 'rotate('+angleRacers+'turn)';
    }
}
