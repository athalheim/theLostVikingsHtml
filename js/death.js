// The Lost Vikings - Death module
death = {
    screen:                                      null,
    sources:                                     ['resume.png', 'death.png'],
    entryIcon:                                   null,
    entryIconSrc:                                'entryIcon.png',
    entryIconLocation:                           0,
    music:                                       "death.mp3",
    imageObjects:                                ['Olaf', 'Baleog', 'Eric'],
    gameOver:                                    {src: "gameOver.png"},
    loop:                                        0,

    /* ########################################################################## */
    // Display death screens:
    initialize() {
        loadMusic(death.music);
        death.entryIcon                          = document.createElement("img");
        death.entryIcon.src                      = imagesPath + death.entryIconSrc;
        death.loop                               = 0;
        death.screen                             = document.createElement("img");
        death.screen.onload                      = function()   { death.stepDeathScreen(); };
        death.screen.src                         = imagesPath + death.sources.pop();

    },

    stepDeathScreen() {
        with (tlvCanvas.getContext("2d")) {
            save();
            scale(appScale, appScale);
            drawImage(death.screen, 0, 0);
            characterNames                       = Object.keys(vikings.characters);
            Object.keys(vikings.characters).forEach(characterName => {
                character                        = vikings.characters[characterName];
                characterDeath                   = character.death;
                if (character.health > 0) {
                    drawImage(characterDeath.image,  (6 + (i * 50)), 144)  
                }
            });
            restore();
        }
        death.loop                              += 1;
        if (death.loop <= 100) {
            requestAnimationFrame(death.stepDeathScreen);
        } else {
            document.addEventListener('keydown', death.handleEntryKey, true);
            death.screen                         = document.createElement("img");
            death.screen.onload                  = function() { death.displayResumeScreen(0); };
            death.screen.src                     = imagesPath + death.sources.pop();
        }
    },


    /* ########################################################################## */
    // Entry screen handling:
    //  Options:
    //   0: -Resume Scene (default)
    //   1: -New game
    //   2: -Get password
    //   3: -Exit
    //  Events
    handleEntryKey(e) {
        switch (e.key) {
            case 'ArrowUp':    e.preventDefault(); death.displayResumeScreen(-1); break;
            case 'ArrowDown':  e.preventDefault(); death.displayResumeScreen(+1); break;
            case 'Enter':      e.preventDefault(); death.processEnterKey();
        }    
    },
    //  Display
    displayResumeScreen(cursorIncrement) {
        death.entryIconLocation                 += cursorIncrement;
        death.entryIconLocation                  = Math.max(death.entryIconLocation, 0);
        death.entryIconLocation                  = Math.min(death.entryIconLocation, 3);
        with (tlvCanvas.getContext("2d")) {
            save();
            scale(appScale, appScale);
            drawImage(death.screen, 0, 0);
            drawImage(death.entryIcon, 90, (107 + (death.entryIconLocation * 16)));
            restore();
        }
    },

    processEnterKey() {
        switch(death.entryIconLocation) {
            case 0:
                // Resume Scene
                death.returnToScene();
                break;
            case 1:
                // New game:
                sm.sceneNo                       = 1;
                death.returnToScene();
                break;
            case 2:
                if (getPassword()) death.returnToScene();
                break;
            default:
                // Exit:
                death.gameOver.image             = document.createElement("img");
                death.gameOver.image.onload      = function()   {
                    document.removeEventListener('keydown', handleEntryKey, true);
                    with (tlvCanvas.getContext("2d")) {
                        save();
                        scale(appScale, appScale);
                        drawImage(death.gameOver.image, 0, 0);
                        restore();
                    };
                    death.removeDeathScript();
                    sm.removeSceneManagerScript();
                    vikings.removeVikingsScript();
                    delete view;
                };
                death.gameOver.image.src         = imagesPath + death.gameOver.src;
        }
    },
    /* ########################################################################## */
    /* Final step                                                                 */
    /*  Entry is done: Load view module with selected scene                       */
    removeDeathScript() {
        document.removeEventListener('keydown', death.handleEntryKey, true);
        removeScript("death");
    },
    returnToScene() {
        death.removeDeathScript();
        sm.initializeScene();
    }
};
death.initialize();

/* -\\- */
