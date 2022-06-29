// The Lost Vikings - Splash module
splash = {
    interplay:                                   {src: 'interplay.png'},
    siliconAndSynapse:                           {src: 'blizzardSiliconAndSynapse.png'},
    blizzard1:                                   {src: 'blizzardClassicArcade.png'},
    blizzard2:                                   {src: 'blizzardEntertainment.png'},
    blizzard3:                                   {src: 'blizzardTheLostVikings.png'},
    gameEntry:                                   {src: 'blizzardGameEntry.png'},
    gameEntryIcon:                               {src: 'blizzardEntryIcon.png'},
    
    screenList:                                  ['gameEntry', 'blizzard3', 'blizzard2', 'blizzard1', 'siliconAndSynapse', 'interplay'],
    alpha:                                       1.0,
    alphaSlowIncrement:                          0.01,
    alphaFastIncrement:                          0.02,

    gameEntryIconX:                              90,
    gameEntryIconY:                              107,
    gameEntryIconYmin:                           107,
    gameEntryIconYmax:                           123,
    
    music:                                       "01 - Title Theme.mp3",

    /* ########################################################################## */
    // Display splash screens:
    initialize() {
        loadMusic(splash.music);
        initializeImages(splash);
        document.addEventListener('keydown', splash.handleEntryKey, true);
            // Delay to ensure images are loaded
        setTimeout(splash.animateSplash, 100);
    },

    animateSplash() {
        if (splash.alpha < 1.0) {
            splash.displayScreen();
            splash.alpha                        += (splash.screenList)? splash.alphaSlowIncrement: splash.alphaFastIncrement;
            requestAnimationFrame(splash.animateSplash);
        } else if (splash.screenList) {
            splash.screen                        = splash[splash.screenList.pop()].image;
            if (splash.screenList.length === 0)    delete splash.screenList;
            splash.alpha                         = 0.0;
            requestAnimationFrame(splash.animateSplash);
        } else {
            splash.displayScreen();
        }
    },

    // Game entry keyboard event:
    handleEntryKey(event) {
        switch (event.key) {
            case 'Escape':
                // Skip all splashscreens
                event.preventDefault();
                if (splash.screenList) {
                    delete splash.screenList;
                    splash.screen                = splash.gameEntry.image;
                }
                break;
            case 'ArrowUp':
                if (!splash.screenList) {
                    event.preventDefault();
                    splash.gameEntryIconY            = splash.gameEntryIconYmin; 
                    splash.displayScreen(); 
                    break;
                }
            case 'ArrowDown':
                if (!splash.screenList) {
                    event.preventDefault();
                    splash.gameEntryIconY            = splash.gameEntryIconYmax; 
                    splash.displayScreen(); 
                    break;
                }
            case 'Enter':      
                if (!splash.screenList) {
                    event.preventDefault();
                    if ((splash.gameEntryIconY === splash.gameEntryIconYmin) || getPassword()) {
                        document.removeEventListener('keydown', splash.handleEntryKey, true);
                        removeScript("splash");
                        delete splash;
                        sm.initializeScene();
                    }
                }
        }    
    },

    displayScreen() {
        with (tlvCanvas.getContext("2d")) {
            save();
            scale(tlvScale, tlvScale);
            globalAlpha                          = Math.pow(splash.alpha, 2);
            drawImage(splash.screen,     0, 0);
            if (!splash.screenList)  drawImage(splash.gameEntryIcon.image, splash.gameEntryIconX, splash.gameEntryIconY);
            restore();
        }
    },
};

splash.initialize();

/* -\\- */
