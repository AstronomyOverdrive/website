"use strict";

// Define HTML Elements
const stationList = document.getElementById("mainnavlist");
const infoArea = document.getElementById("info");
const selectStations = document.getElementById("numrows");
const headerBackground = document.getElementById("mainheader");
const pageHeader = document.getElementById("logo");
const radioPlayer = document.getElementById("radioplayer");
const playerMenu = document.getElementById("playchannel");
const playerButton = document.getElementById("playbutton");
const showPlayer = document.getElementById("player");
const showSelect = document.getElementById("shownumrows");

// Declare variables
let stationData;
let availableStations;
let chosenURL;
let currentURL;

// Define functions
function getStations(){
    fetch('https://api.sr.se/api/v2/channels?pagination=false&format=json') // Get all channels from SR on one page and in JSON format
    .then(response => response.json())
    .then(data => {
        initialData(data);
    })
    .catch(() => {
        const songsObj = { // Artist - Title and url for each song
            0:{"text":"The Kinks - I'm Not Like Everybody Else","url":"https://www.youtube.com/watch?v=aaiNeZaGrH0"},
            1:{"text":"The Mamas & The Papas - California Dreamin'","url":"https://www.youtube.com/watch?v=fOM4a3-TmAQ"},
            2:{"text":"Die Spitz - Little Flame (Audiotree Live Version)","url":"https://www.youtube.com/watch?v=DqnDy3KTeK4"},
            3:{"text":"Joy Division - She's Lost Control","url":"https://www.youtube.com/watch?v=s4prQ11orEM"},
            4:{"text":"Violent Femmes - Kiss Off","url":"https://www.youtube.com/watch?v=7kxK_-O1bQM"},
            5:{"text":"Charta 77 - När Världssamvetet Tog Semester","url":"https://www.youtube.com/watch?v=I-mRkQ92L8U"},
            6:{"text":"Mimikry - En flicka som är stark","url":"https://www.youtube.com/watch?v=UxGAivzUvQE"},
            7:{"text":"Dia Psalma - Luft","url":"https://www.youtube.com/watch?v=1BO2rDWNm1g"},
            8:{"text":"KSMB - Sex noll två","url":"https://www.youtube.com/watch?v=NtJuhWiamo8"},
            9:{"text":"Kent - VinterNoll2","url":"https://www.youtube.com/watch?v=2IoKYLqGaPc"}
        };
        const randomSong = Math.floor(Math.random() * 10);// Randomly choose a song to show
        const suggestionMessage = "Att lyssna på så länge: <a target='_blank' href='"+songsObj[randomSong].url+"'>"+songsObj[randomSong].text+" [YouTube]</a>";
        const errorMessage = "<h1 style='color:red;'>Nånting gick fel!</h1><p>Tyvärr kunde vi inte ansluta till Sveriges Radios API, försök igen senare.</p>";
        infoArea.innerHTML = errorMessage + suggestionMessage;
        showPlayer.style.display = "none"; // Hide unusable elements
        showSelect.style.display = "none";
    });
}

function initialData(data){
    const welcomeMessage = "<h1>Välkommen till tablåer för Sveriges Radio!</h1><p>Denna webbapplikation använder Sveriges Radios öppna API för tablåer och program.<br>Välj kanal till vänster för att visa tablå.</p>";
    const randomStation = Math.floor(Math.random() * 10); // Randomly choose a station from the first 10, later stations are inconsistent if they air anything
    const randomButton = "<button onclick='getSchedule("+randomStation+")'>Överraska mig!</button>";

    stationData = data; // Save JSON object
    availableStations = data["channels"].length;
    selectStations.value = 10; // Restore input on page refresh
    infoArea.innerHTML = welcomeMessage + randomButton;

    setStationList(10);
    setRadioList(); 
}

function setStationList(amount){
    let listHTML = ""; // Prepare string variable
    if (amount > availableStations){ // Limit requested amount to number of existing stations
        amount = availableStations;
        selectStations.value = availableStations; // Change selected station input to last station
    }
    for (let i = 0; i < amount; i++){ // Create list items for each channel
        const stationName = stationData["channels"][i].name;
        const stationDesc = stationData["channels"][i].tagline;
        listHTML += "<li title='"+stationDesc+"' onclick='getSchedule("+i+")'>"+stationName+"</li>";
    }
    stationList.innerHTML = listHTML;
}

function getSchedule(index){
    const reqSchedule = stationData["channels"][index].scheduleurl+"&pagination=false&format=json";
    fetch(reqSchedule) // Get schedule for station on one page and in JSON format
    .then(response => response.json())
    .then(data => {
        const stationColour = stationData["channels"][index].color; // Get hexcolour for chosen station
        headerBackground.style = "background:#" + stationColour + ";"; // Set header background to station colour
        setScheduleList(data, index);
    })
    .catch(() => {
        infoArea.innerHTML = "<h1>Ingen tablå tillgänglig.</h1>";
    });
}

function setScheduleList(station, index){
    const currentTime = new Date();
    const stationName = stationData["channels"][index].name;
    let scheduleHTML = ""; // Prepare string variable
    
    station.schedule.forEach((Program) => {
        const startTime = new Date(Number(Program.starttimeutc.replace(/\D/g, ''))); // Get UNIX time by scrubbing all non integers with regex
        const endTime = new Date(Number(Program.endtimeutc.replace(/\D/g, '')));

        if (endTime.getTime() > currentTime.getTime()){ // Filter out previous programs
            const startString = correctNum(startTime.getHours()) + ":" + correctNum(startTime.getMinutes()); // Format: HH:MM
            const endString = correctNum(endTime.getHours()) + ":" + correctNum(endTime.getMinutes());
            let subtitleString = ""; // Prepare string variables
            let descriptionString = "";
            let timeLeft = "";

            if (startTime.getTime() < currentTime.getTime()){ // Check if program is currently airing
                timeLeft = " | Tid kvar: " + Math.ceil((endTime.getTime() - currentTime.getTime()) / 60000) + " minuter"; // Calculate UNIX time left of program and convert to minutes
            }
            if (Program.subtitle){ // Check if a subtitle exists
                subtitleString = Program.subtitle;
            }
            if (Program.description){ // Check if description exists
                descriptionString = Program.description;
            }
            const timeString = startString + " - " + endString + timeLeft;
            scheduleHTML += "<article><h3>"+Program.title+"</h3><h4>"+subtitleString+"</h4><h5>"+timeString+"</h5><p>"+descriptionString+"</p></article>";
        }
    })
    infoArea.innerHTML = "<h1>Visar tablå för "+stationName+"<button onclick='playStation("+index+")'>Lyssna</button></h1>" + scheduleHTML;
}

function correctNum(int){ // Correct formatting on numbers less than 10
    if (int < 10){
        return "0" + int;
    } else {
        return int;
    }
}

function updateStations(){
    let selectedAmount = Number(selectStations.value); // Convert input into a number
    setStationList(selectedAmount);
}

function setRadioList(){
    let index = 0;
    let playerHTML = ""; // Prepare string variable
    chosenURL = stationData["channels"][0].liveaudio.url; // Have first channel be default value

    stationData["channels"].forEach((station) => { // Create select options for each channel
        playerHTML += "<option value="+index+">"+station.name+"</option>";
        index += 1;
    });
    playerMenu.innerHTML = playerHTML;
}

function playStation(index){
    currentURL = stationData["channels"][index].liveaudio.url; // Audio file url for current channel
    playAudio(true);
}

function updateAudio(){
    const playerIndex = playerMenu.value; // Get index from the forms value
    chosenURL = stationData["channels"][playerIndex].liveaudio.url; // Audio file url for selected channel
}

function playAudio(direct){
    let urlToPlay;
    if (direct === true){ // Select url based on what function called playAudio
        urlToPlay = currentURL;
    } else {
        urlToPlay = chosenURL;
    }
    if (chosenURL){ // Check if an url exists before creating player
        radioPlayer.innerHTML = "<audio controls='' autoplay=''><source src='"+urlToPlay+"' type='audio/mpeg'></audio>";
    }
}

// Event Handlers
addEventListener("load", getStations);
pageHeader.addEventListener("click", getStations);
selectStations.addEventListener("change", updateStations);
playerMenu.addEventListener("change", updateAudio);
playerButton.addEventListener("click", playAudio);
