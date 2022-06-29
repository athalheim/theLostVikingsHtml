// The Lost Vikings - Scene Manager (sm) module
sm = {
    scenesScriptPath:                            "sceneScripts/",
    sceneImagesPath:                             "sceneImages/",

    sceneRoot:                                   "scene_",
    sceneNo:                                     1,
    sceneId:                                     null,

    isPaused:                                    false,

    atExit:                                      [],
    // Moves:
    areaTypes: {
        floor:  'floor',
        ladder: 'ladder',
        trap:   'trap',
    } ,
    currentAreaName:                             null,
    currentArea:                                 null,
    currentAreaMoves:                            0,
    moveString:                                  ['up','down','jump','fall','float'],

        // Key codes handled in this module
    sceneManagerKeyCodes: [
        80,              // P: Pause
        81,              // Q: Quit
    ],

        // Scene's main process variables
    sceneIntervalFlag:                           null,
    sceneIntervalDelay:                          100,
    sceneFadeInDuration:                         1000,
    sceneAlphaIncrement:                         .04,
    

    /* ################################################################### */
    initializeScene(isNextScene) {
        sm.removeScene();
        if (isNextScene) sm.sceneNo             += 1;
        sm.sceneId                               = sm.sceneRoot + sm.sceneNo.toString().padStart(2, '0');
        sm.atExit                                = [];
        loadScript(sm.sceneId, sm.scenesScriptPath, "sm.loadSceneItems();");
    },
    loadSceneItems() {
        if (scene.music) loadMusic(scene.music);
        sm.resolveLocations();
        if (scene.background) {
            // Load scene background
            scene.background.image               = document.createElement("img");
            scene.background.image.onload        = function() { sm.loadSceneForeground(); };
            scene.background.image.src           = sm.sceneImagesPath + scene.background.src;
        } else {
            sm.loadSceneForeground();
        } 
    },

        // IMPORTANT! All locations defined by 'y' (level) first: YX:
    resolveLocations() {
            // Locate characters
        Object.keys(scene.entry).forEach(locationName => {
            characterName                        = scene.entry[locationName];
            character                            = vikings.getCharacter(characterName);
            character.y                          = scene.yCoordinates[locationName.substring(0, 1)];
            character.x                          = scene.xCoordinates[locationName.substring(1, 2)];
        });
            // Locate  exit
        sm.setObjectLocation(scene.exit, scene.exit.location);
            // Locate areas (y0-x0-y1-x1, top-left to bottom-right):
        Object.keys(scene.areas).forEach(areaName => {
            thisArea                             = scene.areas[areaName];
            thisArea.y0                          = scene.yCoordinates[areaName.substring(0, 1)];
            thisArea.x0                          = scene.xCoordinates[areaName.substring(1, 2)];
            thisArea.y1                          = scene.yCoordinates[areaName.substring(2, 3)];
            thisArea.x1                          = scene.xCoordinates[areaName.substring(3, 4)];
            if (thisArea.height) {
                    // Height is used in jump, fall, float, antigrav: compute working height as (area height - character height)
                    //  This will set the maximum level a character can get to.
                thisArea.y0                     -= (thisArea.height - 32);
            }
        });
            // Locate sprites
        Object.keys(scene.sprites).forEach(thisSpriteLocation => {
            sm.setObjectLocation(scene.sprites[thisSpriteLocation], thisSpriteLocation);
        });
            // Locate collectibles
        Object.keys(scene.collectibles).forEach(thisCollectibleLocation => {
            sm.setObjectLocation(scene.collectibles[thisCollectibleLocation], thisCollectibleLocation);
        });
    },
        // Basic locator from first two location characters
    setObjectLocation(thisItem, thisLocation) {
        thisItem.y                               = scene.yCoordinates[thisLocation.substring(0, 1)];
        if (thisItem.height) { thisItem.y       -= thisItem.height; }
        thisItem.x                               = scene.xCoordinates[thisLocation.substring(1, 2)];
    },

    loadSceneForeground() {
        scene.foregroung.image                   = document.createElement("img");
        scene.foregroung.image.onload            = function() { 
            sprites.initializeSceneSprites();
            collectibles.initializeSceneCollectibles();
            vikings.initializeCurrentCharacter();
            view.setSceneParameters();
            view.focusOnCurrentCharacter();
            sm.setAreaFromLocation(vikings.currentCharacter.x, vikings.currentCharacter.y);
            sm.startScene();
            balloons.setSceneEntryBalloons()
        };
        scene.foregroung.image.src               = sm.sceneImagesPath + scene.foregroung.src;
    },


    /* ########################################################################## */
    /* Main Scene Procedure */
    /*  Note: This procedure repeats every 'sm.sceneIntervalDelay' */
    /*        to let procedures complete before next display refresh. */
    startScene()   {
        sm.sceneAlphaIncrement                   = (sm.sceneIntervalDelay / sm.sceneFadeInDuration);
        sm.sceneIntervalFlag                     = setInterval(sm.processScene, sm.sceneIntervalDelay);
    },
    stopScene()    {
        clearInterval(sm.sceneIntervalFlag);
        sm.sceneIntervalFlag                     = null;
    },
    processScene() {
        view.displayScene();
        if (sm.isPaused) return;
        vikings.updateCharacterLocation();
        if (sm.atExit.length === 3) {
            balloons.setBalloonsById('exit');
        }
        collectibles.activateCollectible();
        sprites.doCycle();
    },


    /* ################################################################### */
    // MOVES
        // Should check for dynamic areas: elevators, ...
    setAreaFromLocation(x, y) {
            // Landing on Olaf' shield?
        if (Olaf.isShieldUp) {
            if (((Olaf.upShieldArea.x0 <= x) && (x <= Olaf.upShieldArea.x1)) && ((Olaf.upShieldArea.y0 <= y) && (y <=Olaf.upShieldArea.y1))) {
                sm.currentAreaName               = 'Olaf';
                sm.currentArea                   = Olaf.upShieldArea;
                return true;
            }
        }
            // Dynamic sprites areas: elevators, etc...:
        //  TO DO
            // Otherwise, check all areas
        pathNames                                = Object.keys(scene.areas);
        for (i = 0; i < pathNames.length; i += 1) {
            thisAreaName                         = pathNames[i];
            thisArea                             = scene.areas[thisAreaName];
            if (((thisArea.x0 <= x) && (x <= thisArea.x1)) && ((thisArea.y0 <= y) && (y <= thisArea.y1))) {
                sm.currentAreaName               = thisAreaName
                sm.currentArea                   = thisArea;
                return true;
            }
        }
        return false;
    },

    isValidMove(move) {
        return (sm.currentArea.moves.indexOf(move) > -1);
    },


    /* ########################################################################## */
    exitScene() {
        sm.removeScene();
        loadScript("death", scriptPath, null);
    },
    removeScene() {
        if (sm.sceneId) removeScript(sm.sceneId);
        vikings.disableVikingsModule();
        delete scene;
        sm.isPaused                              = false;
        sm.stopScene();
    },

    togglePauseScene() {
        sm.isPaused                              = !sm.isPaused;
        playMusic();
    },


    /* ################################################################### */
    // Keyboard events
        //  Called from index.js 'handleKeyDown', only when scene is loaded:
    handleKeyDown(event) {
        if (sm.sceneManagerKeyCodes.indexOf(event.keyCode) > -1) {
            event.preventDefault();
            switch (event.keyCode) {
                    // Q:81 Exit scene:
                case 81:        sm.exitScene();               break;  
                    // P:80 Pause scene
                case 80:        sm.togglePauseScene();        break;  
            }
        } else if (!sm.isPaused){
            // Process only when scene is not paused
            vikings.handleKeyDown(event);
        }
    },


    /* ################################################################### */
    // Quit game: disable scene manager
    removeSceneManagerScript() {
        sm.removeScene();
        removeScript('sm');
    },
};

initializeImages(sm);

/* -\\- */
