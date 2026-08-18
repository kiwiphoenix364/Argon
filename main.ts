namespace SpriteKind {
    export const MenuSprite = SpriteKind.create()
}

// Timing = 6;
// Cursor = 7
// CONTROLLER_PRIORITY = 8;
// UPDATE_CONTROLLER_PRIORITY = 13;
// CONTROLLER_SPRITES_PRIORITY = 13;
// FOLLOW_SPRITE_PRIORITY = 14;
// PHYSICS_PRIORITY = 15;
// ANIMATION_UPDATE_PRIORITY = 15;
// Shaders - init. at 16 ms and update attached sprites 23-24, renderable update
// Game timing at 17
// Spawn timed projectiles at 18
// UPDATE_INTERVAL_PRIORITY = 19;
// PathFollowObjects - Update pos at 19 and pos animations at 20
// UPDATE_PRIORITY = 20;
// spritedamagetick at 21, SpriteTick at 22
// PRE_RENDER_UPDATE_PRIORITY = 55;
// RENDER_BACKGROUND_PRIORITY = 60;
// RENDER_SPRITES_PRIORITY = 90;
// RENDER_DIAGNOSTICS_PRIORITY = 150;
// MULTIPLAYER_SCREEN_PRIORITY = 190;
// UPDATE_SCREEN_PRIORITY = 200;
// MULTIPLAYER_POST_SCREEN_PRIORITY = 210;




// Main game setup

//let levelData = "{0,0,([10,10,2.356194490192345,40][40,40,2.356194490192345,40][90,100,0,-40]),[66.6541302488668,98.15508250730261,],0,2,1,5}"
let pathArray: Path[]
let idCounter: number
let idCache: number
let lvlEdit = false
let debug = true
game.stats = true

Level.startGame()

//let test2 = new DialogController(DialogText.dialog[0], 0, 60, 160, 120, 100, 50, 160, 60, 0, 0, 100, 60)
let cur = new Cursor(img`
        . . 3 . .
        . . 3 . .
        3 3 . 3 3
        . . 3 . .
        . . 3 . .
`, 1)
/*let test = new Multi_Proj_BOTH(img`
    . . . . . .
    . . . . . .
    3 3 3 3 3 3
    3 3 3 3 3 3
    . . . . . .
    . . . . . .
`, img`
    . . . . . . . e e e e . . . . .
    . . . . . e e 4 5 5 5 e e . . .
    . . . . e 4 5 6 2 2 7 6 6 e . .
    . . . e 5 6 6 7 2 2 6 4 4 4 e .
    . . e 5 2 2 7 6 6 4 5 5 5 5 4 .
    . e 5 6 2 2 8 8 5 5 5 5 5 4 5 4
    . e 5 6 7 7 8 5 4 5 4 5 5 5 5 4
    e 4 5 8 6 6 5 5 5 5 5 5 4 5 5 4
    e 5 c e 8 5 5 5 4 5 5 5 5 5 5 4
    e 5 c c e 5 4 5 5 5 4 5 5 5 e .
    e 5 c c 5 5 5 5 5 5 5 5 4 e . .
    e 5 e c 5 4 5 4 5 5 5 e e . . .
    e 5 e e 5 5 5 5 5 4 e . . . . .
    4 5 4 e 5 5 5 5 e e . . . . . .
    . 4 5 4 5 5 4 e . . . . . . . .
    . . 4 4 e e e . . . . . . . . .
`, true, 5000, 10, 10, 5, 200, 500, 40, 20, 120, 60, 0, 2 * Math.PI, 100, 0, 0, 0.75, 1)
*/
let test2 = new ADV_Projectile_Spawner(() => {
    test2.multi_spawner_line_timed(img`
        . . . . . . . e e e e . . . . .
        . . . . . e e 4 5 5 5 e e . . .
        . . . . e 4 5 6 2 2 7 6 6 e . .
        . . . e 5 6 6 7 2 2 6 4 4 4 e .
        . . e 5 2 2 7 6 6 4 5 5 5 5 4 .
        . e 5 6 2 2 8 8 5 5 5 5 5 4 5 4
        . e 5 6 7 7 8 5 4 5 4 5 5 5 5 4
        e 4 5 8 6 6 5 5 5 5 5 5 4 5 5 4
        e 5 c e 8 5 5 5 4 5 5 5 5 5 5 4
        e 5 c c e 5 4 5 5 5 4 5 5 5 e .
        e 5 c c 5 5 5 5 5 5 5 5 4 e . .
        e 5 e c 5 4 5 4 5 5 5 e e . . .
        e 5 e e 5 5 5 5 5 4 e . . . . .
        4 5 4 e 5 5 5 5 e e . . . . . .
        . 4 5 4 5 5 4 e . . . . . . . .
        . . 4 4 e e e . . . . . . . . .
    `, true, 5000, 10, 100, 10, 100)
}, 1000, 10)