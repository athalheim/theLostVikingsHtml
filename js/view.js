// The Lost Vikings - View module
view = {
        // View location and size
    x:                                           0,
    y:                                           0,
    width:                                       320,
    height:                                      176,
    sceneCanvas:                                 null,
        // Character location parameters
    halfWidth:                                   160,
    halfHeight:                                  88,
        // Scene view parameters
    rightMostX:                                  0,
    bottomMostY:                                 0,

    focusPixelsDisplacement:                     16,


    /* ########################################################################## */

    initialize() {
        view.sceneCanvas                         = document.createElement('canvas');
        view.sceneCanvas.width                   = view.width;
        view.sceneCanvas.height                  = view.height;
    },
        // Updated when a scene is loaded:
    setSceneParameters() {
        view.rightMostX                          = (scene.foregroung.image.width  - view.width);
        view.bottomMostY                         = (scene.foregroung.image.height - view.height);
    },
    getViewOriginX() { return Math.min(Math.max(( vikings.currentCharacter.x       - view.halfWidth ), 0), view.rightMostX);  },
    getViewOriginY() { return Math.min(Math.max(((vikings.currentCharacter.y - 16) - view.halfHeight), 0), view.bottomMostY); },
    getViewCenter()  { return {x: (view.x + (view.width  >> 1)), y: (view.y + (view.height >> 1))} },
        /* Keep current character centered on screen */
    focusOnCurrentCharacter() {
        view.x                                   = view.getViewOriginX();
        view.y                                   = view.getViewOriginY();
    },
        /* Switch character focus, using 'Control' key */
    switchFocusToCurrentCharacter() {
        nextX                                    = view.getViewOriginX();
        nextY                                    = view.getViewOriginY();
        deltaX                                   = (nextX - view.x);
        deltaY                                   = (nextY - view.y);
        maxDelta                                 = Math.max(Math.abs(deltaX), Math.abs(deltaY));
        loopCount                                = Math.floor(maxDelta / view.focusPixelsDisplacement);
        if (loopCount > 0) {
            view.loop                            = {
                                                    initial:    {x:view.x,               y: view.y},
                                                    increment:  {x:(deltaX / loopCount), y:(deltaY / loopCount)},
                                                    index:      0,
                                                    count:      loopCount
                                                   };
        }
    },


    /* ########################################################################## */
    /* Main Display Procedure */
    displayScene() {
            /* ********************************************************************* */
            /* Step 0: Moving/keeping focus on current character                     */
            /* ********************************************************************* */
        if (view.loop) {
            view.loop.index                     += 1;
            view.x                               = Math.round(view.loop.initial.x + (view.loop.index * view.loop.increment.x));
            view.y                               = Math.round(view.loop.initial.y + (view.loop.index * view.loop.increment.y));
            if (view.loop.index === view.loop.count) { delete view.loop; }
        } else {
            view.focusOnCurrentCharacter();
        }
        
            /* ********************************************************************* */
            /* Step 1: Build scene at scale 1:1                                      */
            /*  background, foreground, sprites, characters and balloons             */
            /* ********************************************************************* */
        ctx                                      = view.sceneCanvas.getContext("2d");
        ctx.save();
            // Translate to view area
        ctx.translate(-view.x, -view.y);
            /* Fade in when scene is loaded */
        if (typeof scene.alpha === 'undefined') { scene.alpha  = 0.0; }
        else if (scene.alpha < 1.0)             { scene.alpha += view.sceneAlphaIncrement; if (scene.alpha > 1.0) scene.alpha = 1.0; }
        ctx.globalAlpha                          = Math.pow(scene.alpha, 2);
        if (scene.background) {
            ctx.save();
            ctx.fillStyle                        = ctx.createPattern(scene.background.image, 'repeat');
            ctx.fillRect(0, 0, vikings.width, vikings.height);
            ctx.restore();
        }
        ctx.drawImage(scene.foregroung.image, 0, 0);
        collectibles.drawCollectibles(ctx);
        sprites.drawSprites(ctx);
        vikings.drawCharacters(ctx);
        ctx.globalAlpha                          = 1.0;
        balloons.drawBalloon(ctx);
        ctx.restore();
        ctx                                      = null;
        delete ctx;

            /* ********************************************************************* */
            /* STEP 2: Display scene and Health records at current scale             */
            /* ********************************************************************* */
        ctx                                      = tlvCanvas.getContext("2d");
        ctx.save();
        ctx.scale(tlvScale, tlvScale);
        ctx.drawImage(view.sceneCanvas, 0, 0);
        health.drawStatus(ctx);
        ctx.restore();
        ctx                                      = null;
        delete ctx;
    },
};

view.initialize();

/* -\\- */
