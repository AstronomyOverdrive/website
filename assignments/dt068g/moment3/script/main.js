"use strict";

function readStorage(){
    return JSON.parse(localStorage.getItem("trips"));
}

function writeStorage(data){
    localStorage.setItem("trips", JSON.stringify(data));
}

function clearStorage(){
    localStorage.clear();
    window.location.href = "./";
}

function bookTrip(){
    document.getElementById("confirmation").style.display = "block"; // Show processing screen
    // Get data from form
    let newDestination = document.getElementById("destination").value;
    let newFrom = document.getElementById("from").value;
    let newTime = document.getElementById("time").value;
    const newPeople = document.getElementById("people").value;
    const newRecurring = document.getElementById("recurring").checked;
    const newWheelchair = document.getElementById("wheelchair").checked;
    const newAttendant = document.getElementById("attendant").checked;
    const newGuidedog = document.getElementById("guidedog").checked;
    const newMessage = document.getElementById("message").value;

    // Fill in missing information
    if (newDestination === ""){
        newDestination = "Torggatan 2";
    }
    if (newFrom === ""){
        newFrom = "Järnvägsgatan 9";
    }
    if (newTime === ""){
        newTime = "2025-05-27T09:30";
    }

    // Create an array with the data in an object
    const newTrip = [{
        destination: newDestination,
        from: newFrom,
        time: newTime,
        people: newPeople,
        recurring: newRecurring,
        wheelchair: newWheelchair,
        attendant: newAttendant,
        guidedog: newGuidedog,
        message: newMessage
    }];

    const savedTrips = readStorage();

    let save;
    // Add the array to saved array if it exists
    if (savedTrips === null){
        save = newTrip;
    } else {
        save = newTrip.concat(savedTrips);
    }

    // Store trip(s)
    writeStorage(save);

    // Redirect after 2 seconds
    setTimeout(() => {
        window.location.href = "trips.html";
    }, 2000);
}

function getTrip(){
    const element = document.getElementById("trip-container");
    const savedTrips = readStorage();
    if (savedTrips !== null && savedTrips.length !== 0){ // Check if there are any saved trips
        element.innerHTML = "";
        for(let i = 0; i < savedTrips.length; i++){ // Loop through saved trips and create elements for them
            let recurringText;
            if (savedTrips[i].recurring){
                recurringText = "Återkommande";
            } else {
                recurringText = "Ej återkommande";
            }
            const dateTime = savedTrips[i].time.split("T");

            element.innerHTML +=
            `<div class="booked-trip">
                <div class="recurring">(${recurringText})</div>
                <div class="trip-info">
                    <div>&#128197; ${dateTime[0]}</div>
                    <div>&#128337; ${dateTime[1]}</div>
                    <div>&#128665; ${savedTrips[i].from} &rightarrow; ${savedTrips[i].destination}</div>
                </div>
                <div class="action-buttons edit-buttons">
                    <button type="button" onclick="editTrip(${i})" style="color: green;">Ändra bokning</button>
                    <button type="button" onclick="removeTrip(${i})" style="color: red;">Avboka</button>
                </div>
            </div>`;
        }
    } else {
        element.innerHTML = "Boka en resa så dyker den upp här."; // Show if no trips are saved
    }
}

function removeTrip(id){
    const savedTrips = readStorage();
    let newArray = [];
    for(let i = 0; i < savedTrips.length; i++){ // Create a new array with all saved trips except for the one to remove
        if (i !== Number(id)){
            newArray = newArray.concat(savedTrips[i]);
        }
    }
    writeStorage(newArray); // Store the new array
    getTrip();
}

function editTrip(id){
    localStorage.setItem("edit", id); // Setup trip to load data from
    window.location.href = "edit.html"; // Redirect
}

function getData(){
    const savedTrips = readStorage();
    const id = Number(localStorage.getItem("edit")); // Get trip to edit

    // Fill in form elements with the stored data
    document.getElementById("destination").value = savedTrips[id].destination;
    document.getElementById("from").value = savedTrips[id].from;
    document.getElementById("time").value = savedTrips[id].time;
    document.getElementById("people").value = savedTrips[id].people;
    document.getElementById("recurring").checked = savedTrips[id].recurring;
    document.getElementById("wheelchair").checked = savedTrips[id].wheelchair;
    document.getElementById("attendant").checked = savedTrips[id].attendant;
    document.getElementById("guidedog").checked = savedTrips[id].guidedog;
    document.getElementById("message").value = savedTrips[id].message;
    document.getElementById("save-button").onclick = function(){saveEdit(id)};
}

function cancelEdit(){
    window.location.href = "trips.html";
}

function saveEdit(id){
    const savedTrips = readStorage();
    let newArray = [];
    for(let i = 0; i < savedTrips.length; i++){ // Remove old version of the trip
        if (i !== Number(id)){
            newArray = newArray.concat(savedTrips[i]);
        }
    }
    writeStorage(newArray);
    bookTrip(); // Add new version of the trip
}

function getPreferences(){
    const options = JSON.parse(localStorage.getItem("prefer"));
    if (options !== null){ // Make sure preferences exists before loading them
        document.getElementById("wheelchair").checked = options[0];
        document.getElementById("attendant").checked = options[1];
        document.getElementById("guidedog").checked = options[2];
    }
}
