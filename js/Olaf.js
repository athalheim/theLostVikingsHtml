Olaf=   {
    abilityA:          "Shield",
    abilityB:          "Shield",
    abilityC:          null,
    isShieldUp:        false,
    step:              8,
    collectibles:      [],
    balloonColor:      [0,0,192,255],
    currentSpriteName: 'sprite1',
    sprite1: {
        currentStyle:  'still',
        src:           "225.png",
        still:         {start: 0, stop: 0},
        stillShieldUp: {start: 9, stop: 9},
        walk:          {start: 1, stop: 8},
        walkshieldUp:  {start:10, stop:17},
        climb:         {start:22, stop:25},
        shocked:       {start:32, stop:32},
    },
 

    /* ########################################################################## */
    moveIncrementX: 0,
    moveIncrementY: 0,
    getMoveIncrementX() { x = Olaf.moveIncrementX; Olaf.moveIncrementX = 0; return x;},
    getMoveIncrementY() { y = Olaf.moveIncrementY; Olaf.moveIncrementY = 0; return y;},


    setPrimaryAbility() {
        /* Olaf the Stout will raise or lower his shield. */
        Olaf.setShieldUp(!Olaf.isShieldUp);
    },
    setSecondaryAbility() {
        /* Olaf the Stout will raise or lower his shield. */
        Olaf.setShieldUp(!Olaf.isShieldUp);
    },

    setShieldUp(isUp) {
        Olaf.isShieldUp = isUp;
        Olaf.setCharacterDrawStyle('sprite1', isUp? 'stillShieldUp': 'still');
        Olaf.upShieldArea                        = null;
        if(isUp) {
            Olaf.upShieldArea                    = {
                x0: (Olaf.x - 16),
                y0: (Olaf.y - 64),
                x1: (Olaf.x + 16),
                y1: (Olaf.y - 32),
            };
        }
    },

    isCharacterSpriteStyle(sprite, style) {
        if (Erik.currentSpriteName === sprite) {
            return (Erik[sprite].currentStyle === style);
        }
        return false;
    },

        // Sprite style and index
    setCharacterDrawStyle(sprite, style) {
        if (Olaf[sprite]) {
            Olaf.currentSpriteName               = sprite;
            thisSprite                           = Olaf[sprite];
            if (thisSprite[style]) {
                thisSprite.currentStyle          = style;
                thisSpriteStyle                  = thisSprite[style];
                if (thisSpriteStyle.end) {
                    if (thisSpriteStyle.index === -1) {
                        thisSpriteStyle.index    = thisSpriteStyle.start;
                    }
                } else {
                    thisSpriteStyle.index        = thisSpriteStyle.start;
                }
            }
        }
    },
    incrementCharacterSpriteIndex() {
        thisSprite                               = Olaf[Olaf.currentSpriteName];
        thisSpriteStyle                          = thisSprite[thisSprite.currentStyle];
        thisSpriteStyle.index   += 1;
        if (thisSpriteStyle.index > thisSpriteStyle.end) {
            thisSpriteStyle.index                = thisSpriteStyle.start;
        }
    },
    getcharacterCurrentSpriteIndex() {
        thisSprite                               = Olaf[Olaf.currentSpriteName];
        thisSpriteStyle                          = thisSprite[thisSprite.currentStyle];
        return thisSpriteStyle.index;
    },


    wasHit(hitImpact) {
        health.Olaf.status                      -= hitImpact;
        Olaf.previous                            = {};
        Olaf.previous.sprite                     = Olaf.currentSpriteName;
        Olaf.previous.style                      = Olaf[Olaf.previous.sprite].currentStyle;
        Olaf.previous.countDown                  = 10;
        Olaf.setCharacterDrawStyle('sprite1', 'shocked');
    },


    /* ########################################################################## */
        // Draw character
    drawCharacter(ctx) {
        sx                                   = (Olaf.getcharacterCurrentSpriteIndex() * 32);
        if (Olaf.isFacingLeft) {
            thisCtx                          = Olaf.thisCanvas.getContext("2d");
            thisCtx.scale(-1, 1);
            thisCtx.drawImage(Olaf.sprite1.image,   sx, 0, 32, 32,   0,  0, -32, 32);
            thisCtx                          = null;
            ctx.drawImage(Olaf.thisCanvas, (Olaf.x - 16), (Olaf.y - 32));
        } else {
            ctx.drawImage(Olaf.sprite1.image,   
                sx,            0,             32, 32,     
                (Olaf.x - 16), (Olaf.y - 32), 32, 32);
        }
        if (Olaf.previous) {
            Olaf.previous.countDown             -= 1;
            if (Olaf.previous.countDown === 0) {
                Olaf.setCharacterDrawStyle(Olaf.previous.sprite, Olaf.previous.style);
                delete Olaf.previous;
            }
        }
    },   
};

initializeImages(Olaf);

/* -\\- */
