// The Lost Vikings - Vikings module
vikings = {
    names:                                       ['Erik', 'Baleog', 'Olaf'],           
    characterNames:                              null,  // Initialized in 'initializeCurrentCharacter'
    currentCharacter:                            null,
    killModes: [
        'fall',
        'trap',
        'gun',
        'slug',
        //  etc... to define
    ],
        // Navigation keyCodes are processed differently than the previous ones
    navigationKeyCodesToDirections: {
        '37':  'left',  // Navigation arrow Left
        '38':  'up',    // Navigation arrow Up
        '39':  'right', // Navigation arrow Right
        '40':  'down',  // Navigation arrow Down
        '98':  'down',  // Numeric 2: Down
        '100': 'left',  // Numeric 4: Left
        '102': 'right', // Numeric 6: Right
        '104': 'up',    // Numeric 8: Up
    },

        // Key codes handled in this and characters modules
    vikingsModuleKeyCodes: [
        17,              //: Control
    ],
    characterModulesKeyCodes: [
        101,             // Numeric 5: Primary ability
        96,              // Numeric 0: Secondary ability 
        110,             // Numeric Dot(.): Activate buttons, flip switches, etc. and talk to other characters.
        106,             // *: Select an item
        13,              // Enter: Use an item
    ],

    /* ########################################################################## */
    initialize() {
            /* Load character scripts */
        vikings.names.forEach(characterName => {
            loadScript(characterName, scriptPath, null);
        });
        document.removeEventListener("DOMContentLoaded", function() { vikings.initialize(); });
    },

        // Called from sceneManager
    disableVikingsModule() {
        document.removeEventListener("keydown", vikings.handleNavigationKeyDown, true);
        document.removeEventListener("keyup",   vikings.handleNavigationKeyUp,   true);
    },


        // End/terminate game
    removeVikingsScript() {
            // Remove characters
        vikings.names.forEach(name => { removeScript(name); });
            // Remove vikings module
        removeScript('vikings');
        delete vikings;
    },

    
    /* ########################################################################## */
        // Set current character
    initializeCurrentCharacter() {
        vikings.names.forEach(characterName => {
            character                            = vikings.getCharacter(characterName);
            character.thisCanvas                 = document.createElement('canvas');
            character.width                      = 32;
            character.height                     = 32;
            character.collectibles                        = [];
            character.setCharacterDrawStyle('sprite1', 'still');
        });
            // Copy the names: easier to figure when one character is dead by removing his name from the 'characterNames' list
        vikings.characterNames                   = JSON.parse(JSON.stringify(vikings.names));
        vikings.setCurrentCharacter();
        document.addEventListener("keydown", vikings.handleNavigationKeyDown, true);
        document.addEventListener("keyup",   vikings.handleNavigationKeyUp,   true);
    },
    setCurrentCharacter() {
        currentName                              = vikings.characterNames[0];
        vikings.currentCharacter                 = vikings.getCharacter(currentName);
    },

    getCharacter(characterName) {
        return eval(characterName);
    },
        //  Switch character, using 'Control' key or at character death
    switchCharacter(isCurrentCharacterDead) {
        vikings.currentCharacter.currentStyle    = "still";
        if (isCurrentCharacterDead) {
                // Remove character's name from list
            vikings.characterNames.shift();
        }
        if (vikings.characterNames.length > 0) {
                // Pull first name and push at list's end
            currentName                          = vikings.characterNames.shift();
            vikings.characterNames.push(currentName);
                // Set current character from list's new first name
            vikings.setCurrentCharacter();
            view.switchFocusToCurrentCharacter();
        } else {
            // End of scene: replay?
        }
    },

    getNearestCharacter(x, y, distance) {
        for (characterName of vikings.characterNames) {
            character                            = vikings.getCharacter(characterName);
                // Get character at same level
            if (character.y === y) {
                // On same level
                if (Math.abs(character.x - x) <= distance) {
                    // Within distance
                    return character;
                }
            }
        }
        return null;
    },


    /* ########################################################################## */
        // Check whether the character is near a collectible: pick it then.
    isCharacterNearCollectible() {
        if (scene.collectibles) {
            Object.keys(scene.collectibles).forEach(collectibleName => {
                collectibleItem                  = scene.collectibles[collectibleName];
                if (! collectibleItem.picked) {
                    dx                           = (collectibleItem.x - vikings.currentCharacter.x);
                    dy                           = (collectibleItem.y - (vikings.currentCharacter.y - 16));
                    d                            = (Math.sqrt((x * x) + ( y* y)))
                    if (d < 16) {
                        collectibleItem.picked   = true;
                        vikings.currentCharacter.collectibles.push(collectibleItem);
                    }
                }
            });
        }
    },


    /* ########################################################################## */
    // updateCharacterLocation() {
    //     for (characterName of vikings.characterNames) {
    //         if (health[characterName].status <= 0) {
    //             if ()
    //         } else {
    //             character                            = vikings.getCharacter(characterName);
    //             character.updateCharacterLocation();
    //         }
    //     }
    // },


    hitCharacter(character, mode) {
        switch(mode) {
            case 'fall':
                break;
            case 'gun':
                break;
            case 'slug':
                break;
            default:
        }
    },


    killCharacter(character, mode) {
        switch(mode) {
            case 'fall':
                break;
            case 'trap':
                break;
            case 'gun':
                break;
            case 'slug':
                break;
            default:
        }
        vikings.switchCharacter(true);
    },


    /* ########################################################################## */
        // Draw 'living' characters
    drawCharacters(ctx) {
        vikings.characterNames.forEach(characterName => {
            character                            = vikings.getCharacter(characterName);
            character.drawCharacter(ctx);
        });
    },


    /* ########################################################################## */
    /* Key press */
        //  Called from sceneManager.js 'handleKeyDown', only when scene is active:
    handleKeyDown(event) {
        if (vikings.vikingsModuleKeyCodes.indexOf(event.keyCode) > -1) {
                // Proceed only with valid keyCodes
            event.preventDefault();
            switch (event.keyCode) {
                case 17:        vikings.switchCharacter();  break;
            }
        } else if (vikings.characterModulesKeyCodes.indexOf(event.keyCode) > -1) {
                // Proceed only with valid keyCodes
            event.preventDefault();
            switch (keyCode) {
                case 101: // Numeric 5: Primary ability
                    vikings.currentCharacter.setPrimaryAbility();   break;
                case  96: // Numeric 0: Secondary ability 
                    vikings.currentCharacter.setSecondaryAbility(); break;
                case 110: // Numeric Dot(.) Activate sprite: Activate buttons, flip switches, etc. and talk to other characters.
                    sprites.activateSprite(vikings.currentCharacter.x, vikings.currentCharacter.y); break;
                case 106: // *: Access inventory
                    vikings.accessInventory();                      break;
                case  13: //  'Enter': Use an item
                    vikings.selectInventoryItem();                  break;
            }
        }
    },



    /* ########################################################################## */
        // Called from 'sceneManager' module in 'processScene'
    updateCharacterLocation() {
        characterName                            = vikings.characterNames[0];
        if (health[characterName].status <= 0) {
            vikings.switchCharacter(true);
        }


            // Can the move get character into a valid area?
        dx                                       = 0;
        if  (vikings.directionKey === 'left')  {
            dx                                   = -1;
            vikings.currentCharacter.isFacingLeft = true;
        }
        else if  (vikings.directionKey === 'right') {
            dx                                   =  1;
            vikings.currentCharacter.isFacingLeft = false;
        }
        dy                                       = 0;
             if ((vikings.directionKey === 'up')    && sm.isValidMove('up'))    { dy = -1;}
        else if ((vikings.directionKey === 'down')  && sm.isValidMove('down'))  { dy =  1;}
        dx                                      *= vikings.currentCharacter.step;
        dy                                      *= vikings.currentCharacter.step;
           // Update to target area?
        sm.setAreaFromLocation((vikings.currentCharacter.x + dx), (vikings.currentCharacter.y + dy))
            // Set new character location
            //  Set horizontal
            vikings.currentCharacter.x          += dx
            //  Check vertical movement against current character status
        if (vikings.currentCharacter.isCharacterSpriteStyle('sprite1','jump')) {
            vikings.currentCharacter.y          += vikings.currentCharacter.updateJump();
        } else if ((dy < 0) && sm.isValidMove('up')) {
            vikings.currentCharacter.y          += dy;
        } else if ((dy > 0) && sm.isValidMove('down')) {
            vikings.currentCharacter.y          += dy;
        } else if ((vikings.currentCharacter.y < sm.currentArea.y1) && (sm.currentArea.type !== 'ladder')) {
                // Falling...
             vikings.currentCharacter.y      += vikings.currentCharacter.isShieldUp? 8: 16;
        }
            // Confine move to valid area
        vikings.currentCharacter.x               = Math.max(sm.currentArea.x0, vikings.currentCharacter.x);
        vikings.currentCharacter.x               = Math.min(sm.currentArea.x1, vikings.currentCharacter.x);
        vikings.currentCharacter.y               = Math.max(sm.currentArea.y0, vikings.currentCharacter.y);
        vikings.currentCharacter.y               = Math.min(sm.currentArea.y1, vikings.currentCharacter.y);
        vikings.setCharacterAtExit();
     },


    setCharacterAtExit() {
        index                                    = sm.atExit.indexOf(vikings.characterNames[0]);
        if ((vikings.currentCharacter.x === scene.exit.x) && (vikings.currentCharacter.y === scene.exit.y)) {
            if (index === -1) {
                sm.atExit.push(vikings.characterNames[0]);
            }
        } else if (index > -1) {
            sm.atExit.splice(index, 0); 
        }
    },

    directionKey:                                null,
        // Handle only direction keycodes
    handleNavigationKeyDown(event) {
        if (sm.isPaused) return;
        if (event.keyCode in vikings.navigationKeyCodesToDirections) {
            event.preventDefault();
            vikings.directionKey                 = vikings.navigationKeyCodesToDirections[keyCode];
        }
    },
    handleNavigationKeyUp(event) {
        if (sm.isPaused) return;
        if (event.keyCode in vikings.navigationKeyCodesToDirections) {
            event.preventDefault();
            vikings.directionKey                 = null;
        }
    },


};

document.addEventListener("DOMContentLoaded", function() { vikings.initialize(); });

/* -\\- */
