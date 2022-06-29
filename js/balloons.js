        // Balloon object description:
        //  -single or multiple (array) balloon
        //  -Id: balloon trigger location: displayed when character gets to the location.
        //   --lines    : balloon text, line per line
        //   --tail     : pointer to character speaking: 'top', 'bottom', null
        //   -- duration: milliseconds
        //   --character: null or character: 'Baleog', 'Erik', 'Olaf', 'current'
        // Single-balloon example:
            // D6:     {
            //     lines:       ["You can get hints if", "you stand next to these", "buttons and press 's'."],
            //     tail:        'bottom',
            //     duration:    1500,
            //     character:   'current'
            // },

var balloons = {
        // Display information, character dialogs, ...
    glyphsTable:                                 {src: "002.png",},
    glyphSize:                                   {width: 8, height: 8},
    defaultColor:                                [128,128,128,255],

        // Balloon frame components indexes
    topLeft:                                      2,
    topSide:                                      3,
    topTail:                                     11,
    topRight:                                     4,

    leftSide:                                     5,
    inside:                                      32,
    rightSide:                                    6,

    bottomLeft:                                   7,
    bottomSide:                                   8,
    bottomTail:                                  10,
    bottomRight:                                  9,

    balloonId:                                   null,


        // Template for 'password' balloon, used on scene entry
    passwordTemplate: {
        lines:       ["Password"],
        tail:        null,
        duration:    1500,
        character:   null,
    },

    /* ########################################################################## */
        // Called once by scene manager module, upon scene entry
    setSceneEntryBalloons() {
        entryBalloons                            = [];
        if (scene.balloons) {
            if (scene.balloons.entry) {
                if (Array.isArray(scene.balloons.entry)) {
                    entryBalloons                    = scene.balloons.entry;
                } else {
                    entryBalloons                    = [scene.balloons.entry];

                }
            }
        }
        if (scene.password) {
            thePasswordBalloon                   = JSON.parse(JSON.stringify(balloons.passwordTemplate))
            thePasswordBalloon.lines.push(scene.password);
            entryBalloons.unshift(thePasswordBalloon);
        }
        if (entryBalloons.length > 0) {
            balloons.currentBalloonId            = 'entry';
            balloons.setBalloons(entryBalloons);
        }
    },

        // Called by sprite object, whenever required
    setBalloonsById(balloonId) {
            // Check first:
        if (scene.balloons) {
            if (scene.balloons[balloonId]) {
                balloons.currentBalloonId        = balloonId;
                balloons.setBalloons(scene.balloons[balloonId]);
            }
        }
    },

        // Called from above
        // Expected input:
        //  Single balloon:    {lines, tail, location, duration[, character]}
        //  Multiple balloons: [{single}, {single}, ...]
    setBalloons(theBalloons) {
        if (Array.isArray(theBalloons)) {
            if (theBalloons.length > 0) {
                balloons.balloonsList            = theBalloons;
            }
        } else {
            balloons.balloonsList                = [theBalloons];
        }
        balloons.setBalloon();
    },

        // Called from above
        // Expected input: balloon(s) array:
        //     [{lines, tail, location, duration[, character]}, ...]
    setBalloon() {
        if (balloons.balloonsList) {
            theBalloon                           = balloons.balloonsList.shift();
            if (balloons.balloonsList.length === 0) {
                balloons.balloonsList            = null;
            }
            balloons.processBalloon(theBalloon);
        } else {
            if (balloons.currentBalloonId === 'exit') {
                sm.initializeScene(true);
            }
            balloons.currentBalloonId            = null;
        }
    },
    processBalloon(theBalloon) {
            // Skip when already displayed:
        if (typeof theBalloon.cycles !== 'undefined')           return;
        vikings.directionKey                     = null;
            // Set parameters
        balloons.currentBalloon                  = theBalloon;
            // Get longest string length
        stringLength                             = 0;
        balloons.currentBalloon.lines.forEach(line => { 
            stringLength                         = Math.max(line.length, stringLength);
        });
            // Build balloon
        glyphsArray                              = []
                // Top
        topTail                                  = (balloons.currentBalloon.tail === 'top')? balloons.topTail: null;
        glyphsArray.push( balloons.buildLineIndexes(stringLength, "", balloons.topLeft, balloons.topSide, balloons.topRight, topTail));
                // Text lines
        balloons.currentBalloon.lines.forEach(line => {
            glyphsArray.push(balloons.buildLineIndexes(stringLength, line.toUpperCase(), balloons.leftSide, balloons.inside, balloons.rightSide, null));
        });
                // Bottom
        bottomTail                               = (balloons.currentBalloon.tail === 'bottom')? balloons.bottomTail: null;
        glyphsArray.push(balloons.buildLineIndexes(stringLength, "", balloons.bottomLeft, balloons.bottomSide, balloons.bottomRight, bottomTail));
            // Build and locate balloon image
        balloons.buildBalloon(glyphsArray, (stringLength + 2));
        balloons.setBalloonColor(balloons.currentBalloon.character);
        balloons.setBalloonLocation(balloons.currentBalloon);
        balloons.currentBalloon.cycles           = Math.round(balloons.currentBalloon.duration / sm.sceneIntervalDelay);
        sm.isPaused                              = true;
    },

    buildLineIndexes(length, line, leftSide, inSide, rightSide, tail) {
        lineArray                                = []
        lineArray.push(leftSide);
        for(i = 0; i < length; i += 1) { lineArray.push((i < line.length)? line.charCodeAt(i): inSide) };
        lineArray.push(rightSide)
        if (tail) lineArray[lineArray.length >> 1] = tail
        return lineArray
    },
    buildBalloon(glyphsArray, glyphCount) {
        balloons.currentBalloon.canvas           = document.createElement('canvas');
        balloons.currentBalloon.canvas.width     = (glyphCount         * balloons.glyphSize.width);
        balloons.currentBalloon.canvas.height    = (glyphsArray.length * balloons.glyphSize.height);
        with (balloons.currentBalloon.canvas.getContext("2d")) {
            y                                    = 0;
            glyphsArray.forEach(glyphIndexList => {
                x                                = 0;
                glyphIndexList.forEach(index => {
                    drawImage(balloons.glyphsTable.image, (balloons.glyphSize.width * index), 0, balloons.glyphSize.width, balloons.glyphSize.height,     
                                                         x,                               y, balloons.glyphSize.width, balloons.glyphSize.height);
                    x                           += balloons.glyphSize.width;
                });
                y                               += balloons.glyphSize.height;
            });
        }
    },
    setBalloonColor(characterName) {
        color                                    = balloons.defaultColor;
        if (characterName === null) {
            color                                = balloons.defaultColor;
        } else if (characterName === 'current') {
            color                                = vikings.currentCharacter.balloonColor;
        } else if (vikings.characterNames.includes(characterName)) {
            color                                = vikings.getCharacter(characterName).balloonColor;
        }
        with (balloons.currentBalloon.canvas.getContext("2d")) {
            imgd                                 = getImageData(0, 0, balloons.currentBalloon.canvas.width, balloons.currentBalloon.canvas.height);
            pixelData                            = imgd.data;
                // Replace alpha=128 pixels with selected color.
            for (var i = 0; i < pixelData.length; i += 4) {
                if (pixelData[i + 3] === 128) {
                    pixelData[i    ]             = color[0]; // red
                    pixelData[i + 1]             = color[1]; // green
                    pixelData[i + 2]             = color[2]; // blue
                    pixelData[i + 3]             = color[3]; // alpha
                }
            }
            putImageData(imgd, 0, 0);
        }
    },
    setBalloonLocation(theBalloon) {
        character                                = null;
        if (theBalloon.character === null) {
            character                            = null;
        } else if (theBalloon.character === 'current') {
            character                            = vikings.currentCharacter;
        } else if (vikings.characterNames.includes(theBalloon.character)) {
            character                            = vikings.getCharacter(theBalloon.character);
        } else {
            character                            = scene.sprites[theBalloon.id];
        }
        if (character === null) {
            // Default to screen center
            viewCenter                           = view.getViewCenter();
            x                                    = viewCenter.x - (theBalloon.canvas.width  * 0.5);
            y                                    = viewCenter.y - (theBalloon.canvas.height * 0.5);
        } else {
            x                                    = (character.x - (theBalloon.canvas.width * 0.5));
                // Reference to character vertical middle location
            y                                    = (character.y - 16);
                // Set balloon below or above character, according to tail location
            if (theBalloon.tail) {
                y                               += (theBalloon.tail === 'top')? 16: -(16 + theBalloon.canvas.height);
            }
        }
        theBalloon.location                      = {x:x, y:y};
    },

        // Called from 'view' module
    drawBalloon(ctx) {
        if (balloons.currentBalloon) {
            balloons.currentBalloon.cycles      -= 1
            if (balloons.currentBalloon.cycles === 0){
                balloons.dismissBalloon();
            } else {
                ctx.drawImage(balloons.currentBalloon.canvas, balloons.currentBalloon.location.x, balloons.currentBalloon.location.y);
            }
        }
    },

    dismissBalloon() {
        sm.isPaused                              = false;
        delete balloons.currentBalloon;
            // Process next balloon (when applicable)
        balloons.setBalloon();
    },
}

initializeImages(balloons);

/* -\\- */
