// The Lost Vikings - Scene 1: Spaceship
var scene = {
    foregroung:       {src: "scene_01.png"},
    background:       null,
    world:            "Spaceship",
    music:            "03 - Space Craft.mp3",
    entry: {
        D0:          'Erik',
        Be:          'Baleog',
        A0:          'Olaf',
    },
    exit: {location: 'Cd'},
   // password:       'STRT',       // No need for password at initial level: used for tests, then commented-out

        // Balloon object description:
        //  -single balloon / array of balloons
        //  - Each balloon:
        //   --lines    : balloon text lines array
        //   --tail     : pointer to character speaking: 'top', 'bottom' or null
        //   --duration : milliseconds
        //   --character: 'Baleog', 'Erik', 'Olaf', 'current', <sprite> or null
    balloons: {
        entry:  null,    // No need for 'entry' balloon in this level (either null or removed entirely)

            // Single-balloon
        D6:     {
                    lines:       ["You can get hints if", "you stand next to these", "buttons and press 's'."],
                    tail:        'bottom',
                    duration:    2000,
                    character:   'current'
                },

            // Multiple-balloons
        Cb: [
                {
                    lines:       ['All of us must reach', 'the exit to escape.'],
                    tail:        'top',
                    duration:    2000,
                    character:   'current'
                },
                {

                    lines:       ["Press 'CTRL' to", "switch to my buddies."],
                    tail:        'bottom',
                    duration:    2000,
                    character:   'current'
                }
            ],
        exit: [
                {
                    lines:       ['What are we', 'doing here?'],
                    tail:        'top',
                    duration:    1000,
                    character:   'Baleog'
                },
                {
                    lines:       ['I dunno.'],
                    tail:        'bottom',
                    duration:    750,
                    character:   'Olaf'
                },
                {
                    lines:       ['Will you guys', 'just shut up', 'and follow me!'],
                    tail:        'top',
                    duration:    1000,
                    character:   'Erik'
                },
            ],   
    },

        // Locations in scene
        // ***** IMPORTANT NOTE: All references are specified 'yx':, 'y' first! *****
        //  'y' is character BASE
        //  'x' is character CENTER, 
        // All locations allow for character width(32) and height(32), as not to overlap walls...
        //  Example: 16 pixels(half-width) from wall
    yCoordinates: {
        'A':112,    // Balcony
        'B':176,    // Top level
        'C':272,    // Exit corridor
        'D':432,    // Bottom level
        'E':464,    // Zapper trap
        'F':368,    // Collectible
    },
    xCoordinates: {
        '0': 16,    // Left wall on all levels
        '1': 64,    // Balcony end
        '2': 96,    // Zapper trap start
        '3':112,    // Top-left ladder center, Zapper center
        '4':128,    // Zapper trap end
        '5':144,    // Right wall to door, collectible
        '6':168,    // Door center, information dot
        '7':192,    // Left wall to door
        '8':208,    // Bottom ladder center, main room right wall, gun center
        '9':256,    // Left wall on top level
        'a':288,    // Top-right ladder center, slug center
        'b':320,    // Right wall to door, 'all must exit' dialog
        'c':344,    // Door center
        'd':368,    // Left wall to door, EXIT location
        'e':448     // Top level right wall
    },
 
    // Scene areas: left to right, top to bottom, full height
    // Important: scene declaration order is important when evaluating where is located a character
    //   (vertical-movement areas declared before other areas)
    //  Example: ladder-fall-climb, etc... areas should be declared BEFORE walk-jump areas
    areas: {
            // Balcony
        A0A1: {type:'floor',  height: 96, moves: ''},
            // Top level
            //  Set ladders first
        B3C3: {type:'ladder',             moves: 'up,down,fall'},
        BaCa: {type:'ladder',             moves: 'up,down,fall',},
            //  then areas
        B0B1: {type:'floor',  height: 48, moves: ''},           // Under balcony
        B1B8: {type:'floor',  height:160, moves: 'fall'},       // Left room: fall from balcony
        B9Bb: {type:'floor',  height:160, moves: ''},           // Middle room
        BbBd: {type:'floor',  height: 48, moves: ''},           // Door from middle to right rooms
        BdBe: {type:'floor',  height:160, moves: ''},           // Right room
            // Exit corridor
            //  Set ladder first
        C8D8: {type:'ladder',             moves: 'up,down,fall'},
            //  then areas
        C0C5: {type:'floor',  height: 64, moves: ''},           // Exit corridor left
        C5C7: {type:'floor',  height: 48, moves: ''},           // Door in exit corridor
        C7Cd: {type:'floor',  height: 64, moves: ''},           // Exit corridor right
            // Bottom level
            //  Set trap first
        E2E4: {type:'trap',   height:176, moves: 'fall'},       // Trap
            //  then, set room area
        D0D8: {type:'floor',  height:144, moves: ''},           // Bottom level
    },

        // Sprites located by center point, span: action extent
    sprites: {
        B8:   {type:'gunTurret',       span:   -176},    // Gun points and bullet travels (minus sign) left
        //B0:   {type:'gunTurret',       span:    176},    // Gun points and bullet travels (minus sign) left
        Bc:   {type:'hazardDoor'},
        C6:   {type:'hazardDoor'},
        Cb:   {type:'warning'},                          // Used in scene 1: information without dot, near exit
        Ba:   {type:'slug',            span:     96},    // Slug travels from -48 to +48
        E3:   {type:'horizontalLaser', span:     64},    // Laser extends from -32 to +32
        D6:   {type:'informationDot'},
    },

        // Collectibles located by center point
    collectibles: {
        F4:  {type:'apple'},
    },
}

/* -\\- */
