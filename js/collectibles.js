var collectibles = {
    defaultActivationDistance: 16,
    src:          '014.png',
    width:        16,
    height:       16,
        // Position in list gives the index in sprite
    items: [
        'none',
        'fruit',
        'apple',
        'blazingCross',
        'ham',
        'steak',
        'redKey',
        'blueKey',
        'yellowKey',
        'shield',
        'bomb',
        'flamingArrow',
        'gravityBoot',
        'torch',
        'tools',
        'blueFlask',
        'pump',
        'steelBlock',
        'batteries',
        'itemFrame',
        'none',
        'none',
        'none',
        'bin'
    ],

    initialize() {
        collectibles.image                       = document.createElement("img");
        collectibles.image.src                   = imagesPath + collectibles.src;
    },
    initializeSceneCollectibles() {
        Object.keys(scene.collectibles).forEach(collectibleId => {
            theCollectibleItem                   = scene.collectibles[collectibleId];
            theCollectibleItem.wasPicked         = false;
            index                                = collectibles.items.findIndex(item => item === theCollectibleItem.type);
            x                                    = (collectibles.width * index);
            theCollectibleItem.image             = document.createElement('canvas');
            theCollectibleItem.image.width       = collectibles.width;
            theCollectibleItem.image.height      = collectibles.height;
            with(theCollectibleItem.image.getContext("2d")) {
                drawImage(collectibles.image, x, 0, collectibles.width, collectibles.height,
                                              0, 0, collectibles.width, collectibles.height);
            }
        });
    },

    activateCollectible() {
        Object.keys(scene.collectibles).forEach(collectibleId => {
            thisCollectible                      = scene.collectibles[collectibleId];
            dy                                   = (thisCollectible.y - (vikings.currentCharacter.y - 16));
            dx                                   = (thisCollectible.x - vikings.currentCharacter.x);
            d                                    = Math.sqrt((dx * dx)+(dy * dy));
                // At or near same level?
            if (d <= collectibles.defaultActivationDistance) {
                vikings.currentCharacter.collectibles.push(collectibleId);
                thisCollectible.wasPicked    = true;
                // Sound?
            }
        });
    },

    drawCollectibles(ctx) {
        Object.keys(scene.collectibles).forEach(collectibleId => {
            collectibleItem                      = scene.collectibles[collectibleId];
            if (!collectibleItem.wasPicked) {
                ctx.drawImage(collectibleItem.image, collectibleItem.x, collectibleItem.y);
            }
        });
    },
};

collectibles.initialize();

/* -\\- */
