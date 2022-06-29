// The Lost Vikings - Scene 2: Spaceship
var scene = {
    foregroung:       { src: "scene_02.png" },
    background:       null,
    password:         "GR8T",
    world:            "Spaceship",
    music:            "03 - Space Craft.mp3",
    entry: {
        B0: 'Olaf',
        B1: 'Baleog',
        B3: 'Erik',
    },
    exit: {location: 'Jc'},
    balloons: {
        entry: {
            lines:       [" This completes ", "the Lost Vikings", "      HTML      ", "proof of concept"],
            tail:        null,
            duration:    4000,
            character:   null
        },
    },

    yCoordinates: {
        //'A':  80,
        'B': 224,
        // 'C': 320,
        // 'D': 400,
        // 'E': 512,
        // 'F': 544,
        // 'G': 704,
        // 'H': 720,
        // 'I': 760,
        // 'J': 784,
    },
    xCoordinates: {
        '0': 32,    // Olaf, Left wall(all levels), Gun turret(C,F)
        '1': 64,    // Baleog, Ladder(C-F) left wall, Ladder(G-J)
        //'2': 80,    // Ladder(C-F), Hazard door(J) left side
        '3': 96,    // Erik, Ladder(C-F) right wall
        // '4':104,    // Hazard door(G), Collectible(B)
        // '5':128,    // Hazard door(J) right side, infoDot(B)
        // '6':208,    // Right wall(B), infoDot(B)
        // '7':232,    // Dot
        // '8':256,    // Right wall
        // '9':272,    // Hazard door
        // 'a':288,    // Collectible
        // 'b':296,    // Laser
        'c':320,    // Ladder, wall
        // 'd':392,    // Laser
        // 'e':416,    // Janitor
        // 'f':440,    // Hazard door
        // 'g':464,    // Wall
        // 'h':512,    // Wall
        // 'i':544,    // Janitor
        // 'j':560,    // Left antigrav
        // 'k':568,    // Laser
        // 'l':592,    // Right antigrav, ladder
        // 'm':640,    // Computer
        // 'n':680,    // Laser
        // 'o':688,    // Wall
        // 'p':704,    // Wall
        // 'q':752,    // Wall
        // 'r':768,    // Ladder
        // 's':784,    // Wall
        // 't':840,    // Laser
        // 'u':888,    // Laser
        // 'v':904,    // Laser
        // 'w':960,    // Elevator well
        // 'x':992,    // Wall
    },
    areas: {
        //     // Elevator:
        // IwIw: {type:'trap',     height: 752,   moves: ''},
        //     // Level A floor areas:
        // A9Ae: {type:'floor',    height:  96,   moves: ''},
        // AgAp: {type:'floor',    height:  96,   moves: ''},
        //     // Level B:
        //         // Ladders
        // AcBc: {type:'ladder',                moves: 'up,down,fall',},
        // AlBl: {type:'ladder',                moves: 'up,down,fall',},
                // Floor areas:
        B0B6: {type:'floor',    height: 208,   moves: ''},
        // B6B8: {type:'floor',    height:  48,   moves: ''},
        // B8Be: {type:'floor',    height: 128,   moves: ''},
        // BeBg: {type:'floor',    height:  48,   moves: ''},
        // BgBp: {type:'floor',    height: 128,   moves: ''},
        // BpBq: {type:'floor',    height:  64,   moves: ''},
        // BqBx: {type:'floor',    height: 208,   moves: ''},
        //     // Level C
        //         // Ladder:
        // C2F2: {type:'ladder',                  moves: 'up,down,fall',},
        //         // Antigrav:
        // EjEl:{type:'antigrav',  height: 256,   moves: ''},
        //         // Floor areas:
        // C0Cj: {type:'floor',    height:  64,   moves: ''},
        //     // Level D
        //         // Ladder:
        // DrEr: {type:'ladder',                  moves: 'up,down,fall',},
        //         // Floor areas:
        // DpDw: {type:'floor',    height:  64,   moves: ''},
        //     // Level E:
        // EjEp:{type:'floor',     height: 256,   moves: ''},
        // EpEs:{type:'floor',     height:  96,   moves: ''},
        //     // Level F:
        //         // Ladder:
        // F8G8: {type:'ladder',                  moves: 'up,down,fall',},
        //         // Floor areas:
        // F0Fc: {type:'floor',    height:  64,   moves: ''},
        //     // Level G:
        //         // Ladder:
        // G1J1: {type:'ladder',                  moves: 'up,down,fall',},
        //         // Floor areas:
        // G0Gc: {type:'floor',    height:  64,   moves: ''},
        //     // Level H:
        //         // Floor areas:
        // HhHl: {type:'floor',    height:  64,   moves: ''},
        // HlHo: {type:'floor',    height:  96,   moves: ''},
        // HoHw: {type:'floor',    height:  64,   moves: ''},
        //     // Level J:
        //         // Floor areas:
        // J0Jc: {type:'floor',    height:  64,   moves: ''},
    },

    sprites: {
        // Ax:   {type: 'verticalLaser', span:0},
        // Ax:   {type: 'informationDot', span:0},
        // Ax:   {type: 'button', span:0}, // 301
        // Ax:   {type: 'verticalLaser', span:0},
        // Ax:   {type: 'janitor', span:0},
        // Ax:   {type: 'slug', span:0},
        // Ax:   {type: 'verticalLaser', span:0},

        // Bx:   {type: 'informationDot', span:0},
        // Bx:   {type: 'informationDot', span:0},
        B7:   {type: 'hazardDoor', span:0},
        // Bx:   {type: 'hazardDoor', span:0},
        // Bx:   {type: 'slug', span:0},
        // Bx:   {type: 'informationDot', span:0},

        // Cx:   {type: 'gunTurret', span:0},
        // Cx:   {type: 'slug', span:0},

        // Dx:   {type: 'verticalLaser', span:0},
        // Dx:   {type: 'verticalLaser', span:0},

        // Ex:   {type: 'toggleSwitch', span:0},   // 300

        // Fx:   {type: 'gunTurret', span:0},
        // Fx:   {type: '', span:0},

        // Gx:   {type: 'slug', span:0},
        // Gx:   {type: 'hazardDoor', span:0},
        // Gx:   {type: 'gunTurret', span:0},

        // Hx:   {type: 'janitor', span:0},
        // Hx:   {type: 'verticalLaser', span:0},
        // Hx:   {type: '', span:0},
        // Hx:   {type: 'informationDot', span:0},
        // Hx:   {type: '', span:0},
        // Hx:   {type: 'verticalLaser', span:0},
        // Hx:   {type: 'informationDot', span:0},

        // Ix:   {type: 'horizontalLaser', span:0},

        // Jx:   {type: 'slug', span:0},
        // Jx:   {type: 'hazardDoor', span:0},


    },
    collectibles: {
        // A4:  {type:'apple'},
        // A4:  {type:'bomb'},
        // A4:  {type:'bomb'},

        B5:  {type:'apple', height:64},

        // C4:  {type:'steak'},

        // H4:  {type:'apple'},
    },
};

/* -\\- */
