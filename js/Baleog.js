Baleog= {
    abilityA:          "Sword",
    abilityB:          "BowAndArrow",
    abilityC:          null,
    step:              8,
    collectibles:      [],
    balloonColor:      [0,192,0,255],
    currentSpriteName: 'sprite1',
    sprite1: {
        currentStyle:  'still',
        src:           "221.png",
        still:         {start: 0, stop: 1},
        walk:          {start: 2, stop: 9},
        sword:         {start:18, stop:25},
        bow:           {start:10, stop:17},
        shocked:       {start:41, stop:41},
    },


    /* ########################################################################## */
    moveIncrementX: 0,
    moveIncrementY: 0,
    getMoveIncrementX() { x = Baleog.moveIncrementX; Baleog.moveIncrementX = 0; return x;},
    getMoveIncrementY() { y = Baleog.moveIncrementY; Baleog.moveIncrementY = 0; return y;},


    setPrimaryAbility() {
        /* Baleog the Fierce will swing his mighty sword. */
    },
    setSecondaryAbility() {
        /* Baleog the Fierce will shoot arrows with his bow. */
    },

    isCharacterSpriteStyle(sprite, style) {
        if (Erik.currentSpriteName === sprite) {
            return (Erik[sprite].currentStyle === style);
        }
        return false;
    },


        // Sprite style and index
    setCharacterDrawStyle(sprite, style) {
        if (Baleog[sprite]) {
            Baleog.currentSpriteName             = sprite;
            thisSprite                           = Baleog[sprite];
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
        thisSprite                               = Baleog[Baleog.currentSpriteName];
        thisSpriteStyle                          = thisSprite[thisSprite.currentStyle];
        thisSpriteStyle.index   += 1;
        if (thisSpriteStyle.index > thisSpriteStyle.end) {
            thisSpriteStyle.index                = thisSpriteStyle.start;
        }
    },
    getcharacterCurrentSpriteIndex() {
        thisSprite                               = Baleog[Baleog.currentSpriteName];
        thisSpriteStyle                          = thisSprite[thisSprite.currentStyle];
        return thisSpriteStyle.index;
    },

    wasHit(hitImpact) {
        if (!Baleog.previous) {
            health.Baleog.status                    -= hitImpact;
            Baleog.previous                          = {};
            Baleog.previous.sprite                   = Baleog.currentSpriteName;
            Baleog.previous.style                    = Baleog[Baleog.previous.sprite].currentStyle;
            Baleog.previous.countDown                = 10;
            Baleog.setCharacterDrawStyle('sprite1', 'shocked');
        }
    },


    /* ########################################################################## */
        // Draw character
    drawCharacter(ctx) {
        sx                                   = (Baleog.getcharacterCurrentSpriteIndex() * 32);
        if (Baleog.isFacingLeft) {
            thisCtx                          = Baleog.thisCanvas.getContext("2d");
            thisCtx.scale(-1, 1);
            thisCtx.drawImage(Baleog.sprite1.image,   sx, 0, 32, 32,   0,  0, -32, 32);
            thisCtx                          = null;
            ctx.drawImage(Baleog.thisCanvas, (Baleog.x - 16), (Baleog.y - 32));
        } else {
            ctx.drawImage(Baleog.sprite1.image,   
                sx,            0,             32, 32,     
                (Baleog.x - 16), (Baleog.y - 32), 32, 32);
        }
        if (Baleog.previous) {
            Baleog.previous.countDown             -= 1;
            if (Baleog.previous.countDown === 0) {
                Baleog.setCharacterDrawStyle(Baleog.previous.sprite, Baleog.previous.style);
                delete Baleog.previous;
            }
        }
   },
};

initializeImages(Baleog);

/* -\\- */
