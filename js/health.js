// The Lost Vikings - Characters health module
health = {
        //  Status location and images
    statusTop:                                   176,
    statusFrame:                                 {src:"001.png"},
    statusHealth:                                {src:"013.png", width: 32, height: 7},

    Erik: {
        active:   {src: '004.png'},
        inactive: {src: '007.png'},
        status:   3,
    },
    Baleog: {
        active:   {src: '005.png'},
        inactive: {src: '008.png'},
        status:   3,
    },
    Olaf: {
        active:   {src: '006.png'},
        inactive: {src: '009.png'},
        status:   3,
    },  
    
        // Update character status: Increase(got food, etc...), decrease(got hit, killed, etc...)
        // Example: kill is -7, apple is +1, etc...
    updateCharacterStatus(increment) {
        currentCharacterName                     = vikings.characterNames[0];
        health[currentCharacterName].status     += increment;
        if (health[currentCharacterName].status <= 0) {
            vikings.switchCharacter(true);
        }
    },

    drawStatus(ctx) {
            // First, draw status (HUD) frame
        ctx.drawImage(health.statusFrame.image, 0, health.statusTop);
            // Status details: Process ALL characters (using 'names')
            //  -Default status background for all characters is 'dead' and no health icon
            //  -Thus, process only live characters
        for (i = 0; i < vikings.names.length; i += 1) {
            characterName                    = vikings.names[i];
            if (vikings.characterNames.indexOf(characterName) > -1) {
                    // Locate this character's health area
                dx                           = (46 + (72 * i));
                dy                           = (health.statusTop + 19);
                    // locate this character's source image: alive when in 'characterNames', active when current, else inactive
                characterImage               = (characterName === vikings.characterNames[0])? health[characterName].active.image: health[characterName].inactive.image;
                ctx.drawImage(characterImage, dx, dy);
                    // Get and display character's health status
                sx                           = (health[characterName].status * health.statusHealth.width);
                dx                          += 1;
                dy                           = (health.statusTop + 43);
                ctx.drawImage(health.statusHealth.image,  sx,  0, health.statusHealth.width, health.statusHealth.height,
                                                          dx, dy, health.statusHealth.width, health.statusHealth.height);                    
            }
        }        
    },
};

initializeImages(health);

/* -\\- */
