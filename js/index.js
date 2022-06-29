// The Lost Vikings - Root scripts
    //   Paths
const imagesPath                                 = "images/";
const musicPath                                  = "music/";
const scriptPath                                 = "js/";

const passwords                                  = ["none",                                                  // Dummy entry to handle level '0'
                                                    "STRT","GR8T","TLPT","GRND",                             // World 2, Spaceship, initial
                                                    "LLM0","FL0T","TRSS","PRHS","CVRN","BBLS","VLCN",        // World 3,
                                                    "QCKS","PHR0","C1R0","SPKS","JMNN","TTRS",               // World 4,
                                                    "JLLY","PLNG","BTRY","JNKR","CBLT","H0PP","SMRT","V8TR", // World 5,
                                                    "NFL8","WKYY","CMB0","8BLL","TRDR","FNTM","WRLR","TRPD", // World 7, (Note: there is no world 6)
                                                    "TFFF","FRGT","4RN4","MSTR"];                            // World 2, Spaceship, final
    // Canvas
const tlvWidth                                   = 320;
const tlvHeight                                  = 240;
var tlvCanvas                                    = null;
var tlvScale                                     = 1.0;
    // Audio
var tlvAudio                                     = null;
    // Toggles
var isSoundActive                                = true;
var isMusicActive                                = true;
    // Key codes handled in this module
var applicationKeyCodes                          = [
    107,             // +: Increase display area
    109,             // -: Decrease display area
    77,              // M: Toggle music
    83,              // S: Toggle sound
];


/* ########################################################################## */
/* Recursively explore object properties to load images. */
/*  Expected object format:       {src:"someImage.png"} */
/*  Returned object format:       {src:"someImage.png", image:<image>}  */
function initializeImages(theObject) {
    for (const key in theObject) {
        var thisObject                           = theObject[key];
        if (thisObject !== null) {
            if (typeof thisObject === 'object') initializeImages(thisObject);
            if (thisObject.hasOwnProperty("src")) {
                thisObject.image                 = document.createElement("img");
                thisObject.image.src             = imagesPath + thisObject.src;
            }
        }
    };
};

function readMe() {
    event.preventDefault();
    window.open('readMe.txt', 'blank');
}

/* ########################################################################## */
// Password ckeck
function getPassword() {
    var entryPassword                            = prompt("Please enter scene password", "");
    if (entryPassword) {
        var passwordIndex                        = passwords.indexOf(entryPassword.toUpperCase());
        if (passwordIndex > 0)  { sm.sceneNo     = passwordIndex;  return true; }
        else                    { alert("Invalid password!"); }
    }
}


/* ########################################################################## */
// Sound control
function toggleSound() { isSoundActive           = !isSoundActive;}
function playSound(soundItem) {
    if (isSoundActive) {
        with (new Audio("data:audio/wav;base64," + soundItem)) {
            play();
        }
    }
}


/* ########################################################################## */
// Music control
function toggleMusic() {
    isMusicActive                                = !isMusicActive;
    playMusic();
}
function loadMusic(music) {
    tlvAudio.src                                 = musicPath + music;
    playMusic();
}
function playMusic() {
         if (tlvAudio.src === "") { return; }
    else if (sm.isPaused)         { tlvAudio.pause(); }
    else if (isMusicActive)       { tlvAudio.play();  }
    else                          { tlvAudio.pause(); }
}


/* ########################################################################## */
// Load application scripts
// "callback" may be defined
function loadScript(scriptId, thisPath, callback){
    removeScript(scriptId);
    theScript                                    = document.createElement("script");
    theScript.id                                 = scriptId;
    if (callback) { theScript.onload             = function () { eval(callback) }; }
    try{
        theScript.src                            = thisPath + scriptId + ".js";
        document.body.appendChild(theScript);
    } catch(ex) {
        delete theScript;
    }
}

// When done with a module, remove it
function removeScript(scriptId) {
    theScript                                    = document.getElementById(scriptId);
    if (theScript) {
        document.body.removeChild(theScript);
    }
}


/* ########################################################################## */
/* Set canvas size: enlarge to fit screen, reduce to preset minimum size      */
function setCanvasSize(scaleFactor) {
    tlvScaleMax                                  = Math.min((window.innerHeight / tlvHeight), (window.innerWidth / tlvWidth)) * 0.99;
    tlvScale                                     = Math.max(Math.min((tlvScale * scaleFactor), tlvScaleMax), 1.0);
    tlvCanvas.width                              = (tlvWidth  * tlvScale);
    tlvCanvas.height                             = (tlvHeight * tlvScale);
}


/* ########################################################################## */
    // Handle keyDown events: 
    //  This module: resize window, toggle music, sound
    //  Else, when a scene is active, proceed to sceneManager for further processing
function handleKeyDown(event) {
    // Set  navigation key flag
    keyCode                                      = event.keyCode;
    if (applicationKeyCodes.indexOf(keyCode) > -1) {
        event.preventDefault();
        switch (keyCode) {
                // +(107): Increase canvas size by 25%:
            case 107: setCanvasSize(1.25);     break;
                // -(109): Decrease canvas size by 25%:
            case 109: setCanvasSize(0.80);     break;
                // M( 77): Toggle music
            case  77:  toggleMusic();          break;
                // S( 83): Toggle sound
            case  83:  toggleSound();          break;
        };  
    } else if (typeof scene !== 'undefined') {
            // Process only when a scene is loaded
        sm.handleKeyDown(event);
    }
}


/* ########################################################################## */
    // Called by body element's 'onload' event:
function initialize() {
    document.addEventListener("keydown",           handleKeyDown, true);
    tlvCanvas                                    = document.getElementsByTagName("canvas")[0];
    tlvAudio                                     = document.getElementsByTagName("audio")[0];
    setCanvasSize(1);
    loadScript("splash", scriptPath, null);
}

/* -\\- */
