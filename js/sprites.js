var sprites = {
    defaultActivationDistance:                   16,
        // All sprites located by center-bottom, span: negative is right-to-left
        // NOTE: At design time, only scene 1 sprites are defined.
    gunTurret:       {
        gun: {
            right: { src: '233r.png' },
            left:  { src: '233l.png' },
        },
        bullet: { src: '234.png' },
        cycleDuration:                           4000,  // 3000 milliseconds
        template: {
            hitImpact:                           1,
            gun: {
                width:                           32, 
                height:                          24,
                count:                           2
            },
            bullet: {
                width:                           16,
                height:                          16,
                count:                           4
            },
            cyclesCount:                         48,
        },

        initialize: function(thisSprite, id) {
            Object.assign(thisSprite, this.template);
            thisSprite.gunImage                  = (thisSprite.span > 0)? this.gun.right.image: this.gun.left.image;
            thisSprite.bulletImage               = this.bullet.image;
            thisSprite.gun.currentIndex          = 0;   // Gun is idle
            thisSprite.bullet.currentIndex       = -1;  // Bullet is not visible
                // Set how many view cycles between each gun firing/bullet trajectory action.
            thisSprite.cyclesCount               = Math.round(sprites.gunTurret.cycleDuration / (sm.sceneIntervalDelay));
                // Set gun location
            thisSprite.gun.x                     = thisSprite.x - (thisSprite.gun.width >> 1);
            thisSprite.gun.y                     = (thisSprite.y - thisSprite.gun.height);
            thisSprite.hitCharacter              = null;
            thisSprite.bullet.y                  = (thisSprite.y - thisSprite.gun.height);
            if (Math.sign(thisSprite.span) === 1) {
                thisSprite.bullet.refX           = (thisSprite.gun.x + thisSprite.bullet.width);
                thisSprite.bullet.stepWidth      = (thisSprite.bullet.width >> 1);
            } else {
                thisSprite.bullet.refX           = (thisSprite.x - thisSprite.gun.width);
                thisSprite.bullet.stepWidth      = -(thisSprite.bullet.width >> 1);
            }
                // Set bullet trajectory
            thisSprite.bullet.stepCount          = Math.round(Math.abs(thisSprite.span / thisSprite.bullet.stepWidth));
            thisSprite.loop                      = -1;
            return thisSprite;
        },
        activate() {
            /* Nothing to do here */
        },
        doCycle(thisSprite) {
            thisSprite.loop                     += 1;
            thisSprite.loop                      = (thisSprite.loop % thisSprite.cyclesCount);
            if (thisSprite.loop === 0) {
                    // Gun
                thisSprite.gun.currentIndex      = 1; // Set 'fire' state
                    // Bullet
                thisSprite.bullet.currentIndex   = 0; // Bullet appears...
                thisSprite.bullet.currentStep    = 0; //  ... at gun muzzle
                thisSprite.bullet.x              = thisSprite.bullet.refX;
            } else if (thisSprite.loop <= thisSprite.bullet.stepCount) {
                    // Gun returns to idle
                thisSprite.gun.currentIndex      = 0;
                    // Bullet advances
                thisSprite.bullet.currentStep   += 1
                thisSprite.bullet.x              = thisSprite.bullet.refX + (thisSprite.bullet.stepWidth * thisSprite.bullet.currentStep);
                    // Will bullet hit a character?
                nearX                            = (thisSprite.span < 0)? -16: 32;
                hitCharacter                     = vikings.getNearestCharacter((thisSprite.bullet.x + nearX), (thisSprite.bullet.y + thisSprite.gun.height), 0);
                if (hitCharacter) {
                    thisSprite.loop              = (thisSprite.bullet.stepCount - 1);
                    thisSprite.hitCharacter      = hitCharacter;
                }

            } else if (thisSprite.bullet.currentIndex > -1) {
                // Bullet explodes with sprite parts 1, 2, and 3, then hidden
                thisSprite.bullet.currentStep   += 1
                thisSprite.bullet.currentIndex  += 1;
                // Last part was drawn: disable bullet until next cycle
                if (thisSprite.bullet.currentIndex === thisSprite.bullet.count) {
                    thisSprite.bullet.currentIndex = -1;
                }
                if (thisSprite.hitCharacter) {
                    thisSprite.hitCharacter.wasHit(thisSprite.hitImpact);
                    thisSprite.hitCharacter      = null;
                }
            }
        },

        drawSprite(ctx, thisSprite) {
                // First, Draw bullet, when visible
            if (thisSprite.bullet.currentIndex > -1) {
                x                                = (thisSprite.bullet.currentIndex * thisSprite.bullet.width);
                ctx.drawImage(thisSprite.bulletImage, x,                   0,                   thisSprite.bullet.width, thisSprite.bullet.height,
                                                      thisSprite.bullet.x, thisSprite.bullet.y, thisSprite.bullet.width, thisSprite.bullet.height);
            }
                // Draw gun
            x                                    = (thisSprite.gun.currentIndex * thisSprite.gun.width);
            ctx.drawImage(thisSprite.gunImage, x,                0,                thisSprite.gun.width,    thisSprite.gun.height,
                                               thisSprite.gun.x, thisSprite.gun.y, thisSprite.gun.width,    thisSprite.gun.height);
        },

    },

    hazardDoor: {
        src:'286.png', 
        template: {
            width:    16, 
            height:   24,
            doorSize: 48,
        },
        initialize(thisSprite, id) {
            Object.assign(thisSprite, this.template);
            thisSprite.width                     = Math.abs(thisSprite.width);
            thisSprite.x                        -= (thisSprite.width >> 1);

            thisSprite.image                     = this.image;
            // Set both door panels
            thisSprite.imageUpper                = document.createElement('canvas');
            thisSprite.imageUpper.width          = thisSprite.width;
            thisSprite.imageUpper.height         = thisSprite.height;
            with(thisSprite.imageUpper.getContext("2d")) {
                drawImage(thisSprite.image, 0, 0, thisSprite.width, thisSprite.height,
                                            0, 0, thisSprite.width, thisSprite.height);
            }
            thisSprite.imageLower                = document.createElement('canvas');
            thisSprite.imageLower.width          = thisSprite.width;
            thisSprite.imageLower.height         = thisSprite.height;
            with(thisSprite.imageLower.getContext("2d")) {
                drawImage(thisSprite.image, 0, 32, thisSprite.width, thisSprite.height,
                                            0,  0, thisSprite.width, thisSprite.height);
            }
                // Door span is (24-3) 21 = 3 x 7-pixel steps
            thisSprite.doorClosedSize            = 24;
            thisSprite.doorOpenedSize            = 3;
            // Door is closed at start
            thisSprite.doorCurrentSize           = 24
            return thisSprite;
        },
        activate() {
            /* Nothing to do here */
        },
        doCycle(thisSprite) {
            doorX                                = thisSprite.x + (thisSprite.width * 0.5);
            if (vikings.getNearestCharacter(doorX, thisSprite.y, 64)) {
                this.doDoorCycle(thisSprite, (Math.abs(character.x - doorX) < 32)? 1: 0);
            } else {
                this.doDoorCycle(thisSprite, -1)
            }
        },

        doDoorCycle(thisSprite, openMode) {
            if (openMode === 1) {
                if (thisSprite.doorCurrentSize > thisSprite.doorOpenedSize) { thisSprite.doorCurrentSize  -= 7; }
            } else {
                if (thisSprite.doorCurrentSize < thisSprite.doorClosedSize) { thisSprite.doorCurrentSize  += 7; }
            }
        },

        drawSprite(ctx, thisSprite) {
                // Draw upper panel: from y-48, down with doorCurrentSize
            ctx.drawImage(thisSprite.imageUpper, 0,            0,                                    thisSprite.width, thisSprite.doorCurrentSize,
                                                 thisSprite.x, (thisSprite.y - thisSprite.doorSize), thisSprite.width, thisSprite.doorCurrentSize);
                // Draw lower panel
            y                                    = (thisSprite.y - thisSprite.doorCurrentSize);
            ctx.drawImage(thisSprite.imageLower, 0,            0, thisSprite.width, thisSprite.doorCurrentSize,
                                                 thisSprite.x, y, thisSprite.width, thisSprite.doorCurrentSize);
        },
    },

    horizontalLaser: {
        template: {
            src:                                 '232.png',
            width:                               16, 
            height:                              16, 
            image:                               null,
            cyclesCount:                         4,
            spriteIndex:                         0,
        }, 
        initialize(thisSprite, id) {
            Object.assign(thisSprite, this.template);
            thisSprite.span                      = Math.abs(thisSprite.span);
            thisSprite.y                        -= thisSprite.height;
            thisSprite.x                        -= (thisSprite.span >> 1);
            // Build 'up' image
            thisSprite.image                     = this.template.image;
            thisSprite.imageUp                   = document.createElement('canvas');
            thisSprite.imageUp.width             = thisSprite.span;
            thisSprite.imageUp.height            = thisSprite.height;
            with(thisSprite.imageUp.getContext("2d")) {
                fillStyle                        = createPattern(thisSprite.image, 'repeat');
                fillRect(0, 0, thisSprite.span, thisSprite.height);
            } 
            // Build flipped 'down' image
            thisSprite.imageDown                 = document.createElement('canvas');
            thisSprite.imageDown.width           = thisSprite.span;
            thisSprite.imageDown.height          = thisSprite.height;
            with(thisSprite.imageDown.getContext("2d")) {
                translate(thisSprite.span, 0);
                scale(-1,1);
                drawImage(thisSprite.imageUp, 0, 0);
                setTransform(1,0,0,1,0,0);
            }
            // Set loop parameter
            thisSprite.loop                      = 0;
            return thisSprite;
        },
        activate() {
            /* Nothing to do here */
        },
        doCycle(thisSprite) {
            thisSprite.loop                     += 1;
            thisSprite.loop                      = (thisSprite.loop % thisSprite.cyclesCount);
            if (thisSprite.loop === 0) {
                thisSprite.spriteIndex           = (1 - thisSprite.spriteIndex);
                character                        = vikings.getNearestCharacter(thisSprite.x, thisSprite.y, 16);
                if (character) {
                    vikings.killCharacter(character, 'trap');
                }
            }
        },
        drawSprite(ctx, thisSprite) {
            ctx.drawImage(((thisSprite.spriteIndex === 0)? thisSprite.imageUp: thisSprite.imageDown), thisSprite.x, thisSprite.y);
        },
    },

    informationDot: {
        src:'237.png',
        template: {
            width:16, 
            height:16, 
            count:1,
        },
        initialize(thisSprite, id) {
            Object.assign(thisSprite, this.template);
            thisSprite.id                        = id;
                // Locate 
            thisSprite.image                     = this.image;
            thisSprite.drawnY                    = ((thisSprite.y - 24) - (thisSprite.height >> 1));
            thisSprite.drawnX                    = (thisSprite.x        - (thisSprite.width  >> 1));
            return thisSprite;
        },
        activate() {
            /* Display associated balloons */
        },
        doCycle(thisSprite) {
                // Dot on scene 1 is showed without pressing 's': explains the use.
            if (vikings.isSbuttonPressed || (sm.sceneNo === 1)) {
                if (vikings.getNearestCharacter(thisSprite.x, thisSprite.y, 16)) {
                    balloons.setBalloonsById(thisSprite.id);
                }
                vikings.isSbuttonPressed         = false;
            }
        },
        drawSprite(ctx, thisSprite) {
            ctx.drawImage(thisSprite.image, thisSprite.drawnX, thisSprite.drawnY);
        },
    },

    janitor: {
        src:'235.png',
        balloonColor:        [0,0,255,255],
        template: {
            width:           32, 
            height:          32,
            loop:             0,
            loopLimit:        4,
            spritesCount:     4,
            spriteIndex:      0,
        },
        initialize(thisSprite, id) {
            Object.assign(thisSprite, this.template);
            thisSprite.id                        = id;
            return thisSprite;
        },
        activate() {
            /* Display associated balloons */
        },
        doCycle() {
            thisSprite.loop                      = ((thisSprite.loop + 1) % thisSprite.loopLimit);
            if (thisSprite.loop === 0) {
                thisSprite.spriteIndex           = ((thisSprite.spriteIndex + 1) % thisSprite.spritesCount) ;
            }
            if (vikings.getNearestCharacter(thisSprite.x, thisSprite.y, 32)) {
                balloons.setBalloonsById(thisSprite.id);
            }
        },
        drawSprite(ctx, thisSprite) {
            x                                    = (thisSprite.spriteIndex * thisSprite.width);
            ctx.drawImage(thisSprite.image, x,            0,            thisSprite.width,    thisSprite.height,
                                            thisSprite.x, thisSprite.y, thisSprite.width,    thisSprite.height);
        },
    },

    slug: {
        right:                                   {src: '281r.png',},
        left:                                    {src: '281l.png',},
        stepDuration:                            300,                   // 300 milliseconds per step
        stepWidth:                               4,
        template: {
            hitImpact:         1,
            hitsToKill:        1,
            width:            32, 
            height:           32, 
            spritesCount:      5,
            spriteIndex:      -1,
            cycle:             0,
            cyclesPerStep:     4,
            step:              8,
        },
        initialize(thisSprite, id) {
            Object.assign(thisSprite, this.template);
            thisSprite.id                        = id;
            thisSprite.imageLeft                 = this.left.image;
            thisSprite.imageRight                = this.right.image;
            thisSprite.image                     = this.right.image;
                // Set how many cycles between each slug 'step'.
            thisSprite.cyclesPerStep             = Math.round(sprites.slug.stepDuration / sm.sceneIntervalDelay); 
                // Locate left-most image
            thisSprite.span                      = Math.abs(thisSprite.span);
            thisSprite.x                        -= (thisSprite.span >> 1);
            thisSprite.y                        -= thisSprite.height;
            // Set image x-locations for complete cycle
            steps                                = ((thisSprite.span - thisSprite.width) >> 2);
            thisSprite.xLocations                = [];
            for (i = 0; i <= steps; i += 1) { thisSprite.xLocations.push( (thisSprite.x + (i * this.stepWidth)))}
            for (i = steps; i >= 0; i -= 1) { thisSprite.xLocations.push(-(thisSprite.x + (i * this.stepWidth)))}
            return thisSprite;
        },
        activate() {
            /* Nothing to do here */
        },
        doCycle(thisSprite) {
            thisSprite.cycle                     = ((thisSprite.cycle + 1)      % thisSprite.cyclesPerStep);
            if (thisSprite.cycle === 0) {
                thisSprite.step                  = ((thisSprite.step + 1)        % thisSprite.xLocations.length);
                thisSprite.spriteIndex           = ((thisSprite.spriteIndex + 1) % thisSprite.spritesCount);
                    // xLocation sign indicates which image to use
                thisSprite.image                 = (Math.sign(thisSprite.xLocations[thisSprite.step]) === 1)? thisSprite.imageRight: thisSprite.imageLeft;
                    // then, xLocation must be positive to draw
                thisSprite.x                     = Math.abs(thisSprite.xLocations[thisSprite.step])
                    // Will bullet hit a character?

                hitCharacter                     = vikings.getNearestCharacter((thisSprite.x), (thisSprite.y + thisSprite.height), 16);
                if (hitCharacter) {
                    hitCharacter.wasHit(thisSprite.hitImpact);
                }
            }
        },
        strike() {
            // TO DO
        },
        drawSprite(ctx, thisSprite) {
            x                                    = (thisSprite.spriteIndex * thisSprite.width);
            ctx.drawImage(thisSprite.image, x,            0,            thisSprite.width,    thisSprite.height,
                                            thisSprite.x, thisSprite.y, thisSprite.width,    thisSprite.height);
        },
    },

    RIP: {
        src: '285.png',
        width:                           32, 
        height:                          24,
        count:                           12,
        initialize(thisSprite, id) {
            Object.assign(thisSprite, this.template);
            thisSprite.id                        = id;
        },
        activate() {
            /* Display at killed sprite location */
        },
        doCycle(thisSprite) {
            /* When activated */
        },
        drawSprite(ctx, thisSprite) {
            x                                    = (thisSprite.currentIndex * thisSprite.width);
            ctx.drawImage(thisSprite.image, x,            0,            thisSprite.width,    thisSprite.height,
                                            thisSprite.x, thisSprite.y, thisSprite.width,    thisSprite.height);
        },
    },
    warning: {
        initialize(thisSprite, id) {
            Object.assign(thisSprite, this.template);
            thisSprite.id                        = id;
            return thisSprite;
        },
        doCycle(thisSprite) {
            if (vikings.getNearestCharacter(thisSprite.x, thisSprite.y, 16)) {
                balloons.setBalloonsById(thisSprite.id);
                delete scene.balloons[thisSprite.id];

            }
        },
        drawSprite(ctx, thisSprite) {
            /* Do nothing */
        },
    },


    // Common Procedures
    initializeSceneSprites() {
        Object.keys(scene.sprites).forEach(spriteId => {
            thisSprite                           = scene.sprites[spriteId];
            sprites[thisSprite.type].initialize(thisSprite, spriteId);
        });
    },

    activateSprite(x, y) {
        Object.keys(scene.sprites).forEach(spriteId => {
            thisSprite                           = scene.sprites[spriteId];
                // At or near same level?
            if (Math.abs(thisSprite.y - y) <= sprites.defaultActivationDistance) {
                    // Within distance?
                if (Math.abs(thisSprite.x - x) <= sprites.defaultActivationDistance) {
                    thisSprite.activate();
                }
            }
        });
    },

    doCycle() {
        Object.keys(scene.sprites).forEach(spriteId => {
            thisSprite                           = scene.sprites[spriteId];
            sprites[thisSprite.type].doCycle(thisSprite);
        });
    },

    drawSprites(ctx) {
        Object.keys(scene.sprites).forEach(spriteId => {
            thisSprite                           = scene.sprites[spriteId];
            sprites[thisSprite.type].drawSprite(ctx, thisSprite);
        });
    },
};

initializeImages(sprites);

/* -\\- */
