// The Lost Vikings - Erik
Erik =   { 
    abilityA:            'Jump',
    abilityB:            'Bash',
    abilityC:            null,
    isFacingLeft:        false,
    thisCanvas:          null,
    step:                16,
    collectibles:        [],
    balloonColor:        [192,0,0,255],
    currentSpriteName:   'sprite1',
        // Usual sprites
    sprite1: {
        currentStyle:    'still',
        src:             '224.png',
        walk:            {start: 0, end: 7, index:-1},
        jump:            {start: 8, end:11, index:-1, yIndex: 0, ySequence:[-16, -16, -16, -8, -4, -2, -2, 2, 2, 4, 8, 16, 16, 16]},
        run:             {start:12, end:19, index:-1},
        bash:            {start:20, end:33, index:-1},
        climb:           {start:34, end:37, index:-1},
        endClimb:        {start:38, end:39, index:-1},
        shocked:         {start:40, end:40, index:-1},
        pushWall:        {start:41, end:44, index:-1},
        still:           {start:45, end:48, index:-1},
        disappear:       {start:49, end:56, index:-1},
        operator:        {start:57, end:57, index:-1},
        inflate:         {start:58, end:61, index:-1},
    },



    /* ########################################################################## */
    // Primary ability: Jump
    //  Data:       jump:            {start: 8, end:11, index:-1, yIndex: 0, ySequence:[32, 16, 8, 4, 2,  2, -2, -2, -4, -8, -16, -32]},
    setPrimaryAbility() {
        /* 'Erik the Swift will jump to great heights.' */
        if (Erik.currentSpriteName === 'sprite1') {
            if ((Erik.sprite1.currentStyle === 'still') || (Erik.sprite1.currentStyle === 'walk')) {
                Erik.setCharacterDrawStyle('sprite1','jump');
                Erik.sprite1['jump'].index       = Erik.sprite1['jump'].start;
                Erik.sprite1['jump'].yIndex      = 0;
            }
        }
    },

    updateJump() {
        value                                    = Erik.sprite1['jump'].ySequence[Erik.sprite1['jump'].yIndex]
        Erik.sprite1['jump'].yIndex              = ((Erik.sprite1['jump'].yIndex + 1) % Erik.sprite1['jump'].ySequence.length);
        if (Erik.sprite1['jump'].yIndex === 0) {
            Erik.setCharacterDrawStyle('sprite1', 'still');
        }
        return value;
    },


    /* ########################################################################## */
        // Bash
    setSecondaryAbility() {
        /* 'Erik the Swift uses his head to bash while running.' */
        if (Erik.currentSpriteName === 'sprite1') {
            if (Erik.sprite1.currentStyle === 'run') {
                Erik.sprite1.currentStyle === 'bash';
            }
        }
    },
    getBashIndex() {

    },


    /* ########################################################################## */
    isCharacterSpriteStyle(sprite, style) {
        if (Erik.currentSpriteName === sprite) {
            return (Erik[sprite].currentStyle === style);
        }
        return false;
    },
        // Sprite style and index
    setCharacterDrawStyle(sprite, style) {
        if (Erik[sprite]) {
            Erik.currentSpriteName               = sprite;
            thisSprite                           = Erik[sprite];
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
        thisSprite                               = Erik[Erik.currentSpriteName];
        thisSpriteStyle                          = thisSprite[thisSprite.currentStyle];
        thisSpriteStyle.index                   += 1;
        if (thisSpriteStyle.index > thisSpriteStyle.end) {
            thisSpriteStyle.index                = thisSpriteStyle.start;
        }
    },
    getcharacterCurrentSpriteIndex() {
        thisSprite                               = Erik[Erik.currentSpriteName];
        thisSpriteStyle                          = thisSprite[thisSprite.currentStyle];
        return thisSpriteStyle.index;
    },


    wasHit(hitImpact) {
        health.Erik.status                      -= hitImpact;
        Erik.previous                            = {};
        Erik.previous.sprite                     = Erik.currentSpriteName;
        Erik.previous.style                      = Erik[Erik.previous.sprite].currentStyle;
        Erik.previous.countDown                  = 10;
        Erik.setCharacterDrawStyle('sprite1', 'shocked');
    },

    
    /* ########################################################################## */
        // Draw character
    drawCharacter(ctx) {
        sx                                   = (Erik.getcharacterCurrentSpriteIndex() * 32);
        if (Erik.isFacingLeft) {
            thisCtx                          = Erik.thisCanvas.getContext("2d");
            thisCtx.scale(-1, 1);
            thisCtx.drawImage(Erik.sprite1.image,   sx, 0, 32, 32,   0,  0, -32, 32);
            thisCtx                          = null;
            ctx.drawImage(Erik.thisCanvas, (Erik.x - 16), (Erik.y - 32));
        } else {
            ctx.drawImage(Erik.sprite1.image,   
                sx,            0,             32, 32,     
                (Erik.x - 16), (Erik.y - 32), 32, 32);
        }
        if (Erik.previous) {
            Erik.previous.countDown             -= 1;
            if (Erik.previous.countDown === 0) {
                Erik.setCharacterDrawStyle(Erik.previous.sprite, Erik.previous.style);
                delete Erik.previous;
            }
        }
    },
};

initializeImages(Erik);

/* -\\- */
