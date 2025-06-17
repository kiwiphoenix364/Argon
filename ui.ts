let levelData = "{0,0,([10,10,2.356194490192345,40][40,40,2.356194490192345,40][90,100,0,-40]),[66.6541302488668,98.15508250730261,],0,2,1,5}"
let idCounter = 0
let idCache = 0
let pathArray: Path[]
pathArray = []
decompString(levelData)
console.log("loaded")
/*
let pathArray = [new Path(0, idCounter++, [new PathPoint(10, 10), new PathPoint(40, 40), new PathPoint(90, 100)])]
pathArray[0].pointArray[0].curveAngle = 135 * Math.PI / 180
pathArray[0].pointArray[0].curveDis = 40
pathArray[0].pointArray[1].curveAngle = 135 * Math.PI / 180
pathArray[0].pointArray[1].curveDis = 40
pathArray[0].pointArray[2].curveAngle = 0 * Math.PI / 180
pathArray[0].pointArray[2].curveDis = -40
*/
editMode()
function editMode() {
    let currentSelection = 0
    let menu = -1
    let pointIdxSelected = -1
    let selectMenu: SpriteMenu
    let maxDist = 150
    let editSprite: Sprite
    let spinSprite: Sprite
    let delSprite: Sprite
    let exitSprite: Sprite
    let insSprite: Sprite
    let cursor = sprites.create(img`
        . d . d .
        d d . d d
        . . . . .
        d d . d d
        . d . d .
    `, SpriteKind.Player)
    cursor.z = 100
    controller.moveSprite(cursor)
    let menuLeftButton = sprites.create(img`
        . 2 2 2 2 2 .
        2 2 2 2 e 2 2
        2 2 2 e 2 2 2
        2 2 e 2 2 2 2
        2 2 2 e 2 2 2
        2 2 2 2 e 2 2
        . 2 2 2 2 2 .
    `, SpriteKind.Player)
    menuLeftButton.left = 0
    menuLeftButton.top = 0
    menuLeftButton.z = 5
    let menuMiddleButton = sprites.create(img`
        .222222222222222222222222222222222222222222222222222222222222222222222222222222.
        22222222222222222222222222222222222222222222222222222222222222222222222222222222
        22222222222222222222222222222222222222222222222222222222222222222222222222222222
        22222222222222222222222222222222222222222222222222222222222222222222222222222222
        22222222222222222222222222222222222222222222222222222222222222222222222222222222
        22222222222222222222222222222222222222222222222222222222222222222222222222222222
        .222222222222222222222222222222222222222222222222222222222222222222222222222222.
    `, SpriteKind.Player)
    menuMiddleButton.left = menuLeftButton.right + 1
    menuMiddleButton.top = 0
    menuMiddleButton.z = 5
    let menuRightButton = sprites.create(img`
        . 2 2 2 2 2 .
        2 2 e 2 2 2 2
        2 2 2 e 2 2 2
        2 2 2 2 e 2 2
        2 2 2 e 2 2 2
        2 2 e 2 2 2 2
        . 2 2 2 2 2 .
    `, SpriteKind.Player)
    menuRightButton.left = menuMiddleButton.right + 1
    menuRightButton.top = 0
    menuRightButton.z = 5
    let menuPlusButton = sprites.create(img`
        . 2 2 2 2 2 .
        2 2 2 e 2 2 2
        2 2 2 e 2 2 2
        2 e e e e e 2
        2 2 2 e 2 2 2
        2 2 2 e 2 2 2
        . 2 2 2 2 2 .
    `, SpriteKind.Player)
    menuPlusButton.left = menuRightButton.right + 1
    menuPlusButton.top = 0
    menuPlusButton.z = 5
    let menuRunButton = sprites.create(img`
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
        2 2 e e 2 2 e 2 e 2 e 2 2 e 2 2
        2 2 e 2 e 2 e 2 e 2 e e 2 e 2 2
        2 2 e e 2 2 e 2 e 2 e 2 e e 2 2
        2 2 e 2 e 2 e 2 e 2 e 2 2 e 2 2
        2 2 e 2 e 2 2 e 2 2 e 2 2 e 2 2
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
    `, SpriteKind.Player)
    menuRunButton.left = menuPlusButton.right + 1
    menuRunButton.top = 0
    menuRunButton.z = 5
    let menuSpeedButton = sprites.create(img`
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
    `, SpriteKind.Player)
    menuSpeedButton.left = 0
    menuSpeedButton.top = 8
    menuSpeedButton.z = 5
    let menuSpacingButton = sprites.create(img`
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
    `, SpriteKind.Player)
    menuSpacingButton.left = menuSpeedButton.right + 1
    menuSpacingButton.top = 8
    menuSpacingButton.z = 5
    let menuCountButton = sprites.create(img`
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
    `, SpriteKind.Player)
    menuCountButton.left = menuSpacingButton.right + 1
    menuCountButton.top = 8
    menuCountButton.z = 5
    let menuTypeButton = sprites.create(img`
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
    `, SpriteKind.Player)
    menuTypeButton.left = menuCountButton.right + 1
    menuTypeButton.top = 8
    menuTypeButton.z = 5
    let saveButton = sprites.create(img`
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
        2 2 2 e e 2 2 e 2 2 e 2 e 2 e e e 2 2
        2 2 e 2 2 2 e 2 e 2 e 2 e 2 e 2 2 2 2
        2 2 2 e 2 2 e e e 2 e 2 e 2 e e 2 2 2
        2 2 2 2 e 2 e 2 e 2 e 2 e 2 e 2 2 2 2
        2 2 e e 2 2 e 2 e 2 2 e 2 2 e e e 2 2
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
    `, SpriteKind.Player)
    saveButton.left = menuTypeButton.right + 1
    saveButton.top = 8
    saveButton.z = 5
    //make top menu
    let topMenu = new SpriteMenu([menuLeftButton, menuMiddleButton, menuRightButton, menuPlusButton, menuRunButton, menuSpeedButton, menuSpacingButton, menuCountButton, menuTypeButton, saveButton],
        [menuLeftButton.image, menuMiddleButton.image, menuRightButton.image, menuPlusButton.image, menuRunButton.image, menuSpeedButton.image, menuSpacingButton.image, menuCountButton.image, menuTypeButton.image, saveButton.image], [img`
        . 4 4 4 4 4 .
        4 4 4 4 e 4 4
        4 4 4 e 4 4 4
        4 4 e 4 4 4 4
        4 4 4 e 4 4 4
        4 4 4 4 e 4 4
        . 4 4 4 4 4 .
    `, img`
        .444444444444444444444444444444444444444444444444444444444444444444444444444444.
        44444444444444444444444444444444444444444444444444444444444444444444444444444444
        44444444444444444444444444444444444444444444444444444444444444444444444444444444
        44444444444444444444444444444444444444444444444444444444444444444444444444444444
        44444444444444444444444444444444444444444444444444444444444444444444444444444444
        44444444444444444444444444444444444444444444444444444444444444444444444444444444
        .444444444444444444444444444444444444444444444444444444444444444444444444444444.
    `, img`
        . 4 4 4 4 4 .
        4 4 e 4 4 4 4
        4 4 4 e 4 4 4
        4 4 4 4 e 4 4
        4 4 4 e 4 4 4
        4 4 e 4 4 4 4
        . 4 4 4 4 4 .
    `, img`
        . 4 4 4 4 4 .
        4 4 4 e 4 4 4
        4 4 4 e 4 4 4
        4 e e e e e 4
        4 4 4 e 4 4 4
        4 4 4 e 4 4 4
        . 4 4 4 4 4 .
    `, img`
        . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
        4 4 e e 4 4 e 4 e 4 e 4 4 e 4 4
        4 4 e 4 e 4 e 4 e 4 e e 4 e 4 4
        4 4 e e 4 4 e 4 e 4 e 4 e e 4 4
        4 4 e 4 e 4 e 4 e 4 e 4 4 e 4 4
        4 4 e 4 e 4 4 e 4 4 e 4 4 e 4 4
        . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
    `, img`
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
    `, img`
        . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
    `, img`
        . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
    `, img`
        . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
    `, img`
        . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
        4 4 4 e e 4 4 e 4 4 e 4 e 4 e e e 4 4
        4 4 e 4 4 4 e 4 e 4 e 4 e 4 e 4 4 4 4
        4 4 4 e 4 4 e e e 4 e 4 e 4 e e 4 4 4
        4 4 4 4 e 4 e 4 e 4 e 4 e 4 e 4 4 4 4
        4 4 e e 4 4 e 4 e 4 4 e 4 4 e e e 4 4
        . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
    `])
    //controller events for menus
    const click = function () {
        //Draws text to menus
        function refreshMenus() {
            topMenu.drawOnBoth(img`
                    .222222222222222222222222222222222222222222222222222222222222222222222222222222.
                    22222222222222222222222222222222222222222222222222222222222222222222222222222222
                    22222222222222222222222222222222222222222222222222222222222222222222222222222222
                    22222222222222222222222222222222222222222222222222222222222222222222222222222222
                    22222222222222222222222222222222222222222222222222222222222222222222222222222222
                    22222222222222222222222222222222222222222222222222222222222222222222222222222222
                    .222222222222222222222222222222222222222222222222222222222222222222222222222222.
                `,
                img`
                    .444444444444444444444444444444444444444444444444444444444444444444444444444444.
                    44444444444444444444444444444444444444444444444444444444444444444444444444444444
                    44444444444444444444444444444444444444444444444444444444444444444444444444444444
                    44444444444444444444444444444444444444444444444444444444444444444444444444444444
                    44444444444444444444444444444444444444444444444444444444444444444444444444444444
                    44444444444444444444444444444444444444444444444444444444444444444444444444444444
                    .444444444444444444444444444444444444444444444444444444444444444444444444444444.
                `, 1, pathArray[currentSelection].time.toString())
            topMenu.drawOnBoth(img`
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
                `, img`
        . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
                `, 5, "S:" + pathArray[currentSelection].speed.toString())
            topMenu.drawOnBoth(img`
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
                `, img`
        . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
                `, 6, "D:" + pathArray[currentSelection].spacing.toString())
            topMenu.drawOnBoth(img`
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
                `, img`
        . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
                `, 7, "C:" + pathArray[currentSelection].count.toString())
            topMenu.drawOnBoth(img`
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
                `, img`
        . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
                `, 8, "T:" + pathArray[currentSelection].enemyType.toString())
        }
        if (menu === 1 || menu === 4 && selectMenu != null) {
            selectMenu.checkDirections(true)
        }
        topMenu.checkDirections()
        if (controller.B.isPressed()) {
            if (menu === 0) {
                menu = -1
                topMenu.hide()
                controller.moveSprite(cursor)
            } else if (menu === 1 || menu === 4) {
                menu = -1
                selectMenu.destroy()
                controller.moveSprite(cursor)
            } else if (menu === -1) {
                menu = 0
                topMenu.show()
                refreshMenus()
                controller.moveSprite(cursor, 0, 0)
            }
        } else if ((controller.A.isPressed() || browserEvents.MouseLeft.isPressed()) && menu === 0) {

            if (topMenu.selectedIdx == 3) {
                pathArray.push(new Path(game.askForNumber("ENTER TIME"), idCounter++, []))
                pathArray = Path.pathArraySortByTime(pathArray)
            } else if (topMenu.selectedIdx === 0) {
                currentSelection -= 1
                if (currentSelection < 0) {
                    currentSelection = pathArray.length - 1
                }
                refreshMenus()
            } else if (topMenu.selectedIdx === 2) {
                currentSelection += 1
                currentSelection = currentSelection % pathArray.length
                refreshMenus()
                
            } else if (topMenu.selectedIdx === 1) {
                pathArray[currentSelection].time = game.askForNumber("EDIT")
                idCache = pathArray[currentSelection].id
                pathArray = Path.pathArraySortByTime(pathArray)
                for (let i = 0; i < pathArray.length; i++) {
                    if (pathArray[i].id == idCache) {
                        currentSelection = i
                        break
                    }
                }
                refreshMenus()
            } else if (topMenu.selectedIdx === 4) {
                new PathFollower(pathArray[currentSelection])
            } else if (topMenu.selectedIdx === 5) {
                pathArray[currentSelection].speed = game.askForNumber("EDIT")
                refreshMenus()
            } else if (topMenu.selectedIdx === 6) {
                pathArray[currentSelection].spacing = game.askForNumber("EDIT")
                refreshMenus()
            } else if (topMenu.selectedIdx === 7) {
                pathArray[currentSelection].count = game.askForNumber("EDIT")
                refreshMenus()
            } else if (topMenu.selectedIdx === 8) {
                pathArray[currentSelection].enemyType = game.askForNumber("EDIT")
                refreshMenus()
            } else if (topMenu.selectedIdx === 9) {
                let string = ""
                for (let i = 0; i < pathArray.length; i++) {
                    string = string.concat(pathArray[i].print())
                }
                console.log(string)
                refreshMenus()
            }

        } else if ((controller.A.isPressed() || browserEvents.MouseLeft.isPressed()) && menu === -1) {
            cursor.setPosition(Math.round(cursor.x), Math.round(cursor.y))
            pointIdxSelected = pathArray[currentSelection].checkOverlap(cursor, 5)
            if (pointIdxSelected === null) {
                menu = 4
                editSprite = sprites.create(img`
                    . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
                    2 2 e 2 2 e 2 e e e 2 e 2 e 2 e 2 2 2 2
                    2 2 e e 2 e 2 e 2 2 2 e 2 e 2 e 2 2 2 2
                    2 2 e 2 e e 2 e e 2 2 e 2 e 2 e 2 2 2 2
                    2 2 e 2 2 e 2 e 2 2 2 e 2 e 2 e 2 2 2 2
                    2 2 e 2 2 e 2 e e e 2 2 e 2 e 2 2 2 2 2
                    . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
                `, SpriteKind.Player)
                editSprite.left = cursor.x - 1
                editSprite.top = cursor.y - 1
                if (editSprite.right > scene.screenWidth()) {
                    editSprite.right = scene.screenWidth()
                }
                if (editSprite.top > scene.screenHeight() / 2) {
                    editSprite.top = cursor.y - 23
                }
                editSprite.z = 2
                insSprite = sprites.create(img`
                    . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
                    2 2 e e e 2 e 2 2 e 2 e e e 2 2 2 2 2 2
                    2 2 2 e 2 2 e e 2 e 2 e 2 2 2 2 2 2 2 2
                    2 2 2 e 2 2 e 2 e e 2 e e e 2 2 2 2 2 2
                    2 2 2 e 2 2 e 2 2 e 2 2 2 e 2 2 2 2 2 2
                    2 2 e e e 2 e 2 2 e 2 e e e 2 2 2 2 2 2
                    . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
                `, SpriteKind.Player)
                insSprite.left = editSprite.left
                insSprite.top = editSprite.bottom + 1
                insSprite.z = 2
                exitSprite = sprites.create(img`
                    . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
                    2 2 e e e 2 e 2 e 2 e e e 2 e e e 2 2 2
                    2 2 e 2 2 2 e 2 e 2 2 e 2 2 2 e 2 2 2 2
                    2 2 e e 2 2 2 e 2 2 2 e 2 2 2 e 2 2 2 2
                    2 2 e 2 2 2 e 2 e 2 2 e 2 2 2 e 2 2 2 2
                    2 2 e e e 2 e 2 e 2 e e e 2 2 e 2 2 2 2
                    . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
                `, SpriteKind.Player)
                exitSprite.left = insSprite.left
                exitSprite.top = insSprite.bottom + 1
                exitSprite.z = 2
                selectMenu = new SpriteMenu([editSprite, insSprite, exitSprite], [editSprite.image, insSprite.image, exitSprite.image], [img`
                    . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
                    4 4 e 4 4 e 4 e e e 4 e 4 e 4 e 4 4 4 4
                    4 4 e e 4 e 4 e 4 4 4 e 4 e 4 e 4 4 4 4
                    4 4 e 4 e e 4 e e 4 4 e 4 e 4 e 4 4 4 4
                    4 4 e 4 4 e 4 e 4 4 4 e 4 e 4 e 4 4 4 4
                    4 4 e 4 4 e 4 e e e 4 4 e 4 e 4 4 4 4 4
                    . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
                `, img`
                    . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
                    4 4 e e e 4 e 4 4 e 4 e e e 4 4 4 4 4 4
                    4 4 4 e 4 4 e e 4 e 4 e 4 4 4 4 4 4 4 4
                    4 4 4 e 4 4 e 4 e e 4 e e e 4 4 4 4 4 4
                    4 4 4 e 4 4 e 4 4 e 4 4 4 e 4 4 4 4 4 4
                    4 4 e e e 4 e 4 4 e 4 e e e 4 4 4 4 4 4
                    . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
                `, img`
                    . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
                    4 4 e e e 4 e 4 e 4 e e e 4 e e e 4 4 4
                    4 4 e 4 4 4 e 4 e 4 4 e 4 4 4 e 4 4 4 4
                    4 4 e e 4 4 4 e 4 4 4 e 4 4 4 e 4 4 4 4
                    4 4 e 4 4 4 e 4 e 4 4 e 4 4 4 e 4 4 4 4
                    4 4 e e e 4 e 4 e 4 e e e 4 4 e 4 4 4 4
                    . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
                `])
                selectMenu.show()
                controller.moveSprite(cursor, 0, 0)
            } else {
                menu = 1
                cursor.x = pathArray[currentSelection].pointArray[pointIdxSelected].x + 0.5
                cursor.y = pathArray[currentSelection].pointArray[pointIdxSelected].y + 0.5
                editSprite = sprites.create(img`
                    . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
                    2 2 e e e 2 e e 2 2 e e e 2 e e e 2 2 2
                    2 2 e 2 2 2 e 2 e 2 2 e 2 2 2 e 2 2 2 2
                    2 2 e e 2 2 e 2 e 2 2 e 2 2 2 e 2 2 2 2
                    2 2 e 2 2 2 e 2 e 2 2 e 2 2 2 e 2 2 2 2
                    2 2 e e e 2 e e 2 2 e e e 2 2 e 2 2 2 2
                    . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
                `, SpriteKind.Player)
                editSprite.left = cursor.x
                editSprite.top = cursor.y
                if (editSprite.right > scene.screenWidth()) {
                    editSprite.right = scene.screenWidth()
                }
                if (editSprite.top > scene.screenHeight() / 2) {
                    editSprite.top = cursor.y - 30
                }
                editSprite.z = 2
                spinSprite = sprites.create(img`
                    . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
                    2 2 e e e 2 e e e 2 e e e 2 e 2 2 e 2 2
                    2 2 e 2 2 2 e 2 e 2 2 e 2 2 e e 2 e 2 2
                    2 2 e e e 2 e e e 2 2 e 2 2 e 2 e e 2 2
                    2 2 2 2 e 2 e 2 2 2 2 e 2 2 e 2 2 e 2 2
                    2 2 e e e 2 e 2 2 2 e e e 2 e 2 2 e 2 2
                    . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
                `, SpriteKind.Player)
                spinSprite.left = editSprite.left
                spinSprite.top = editSprite.bottom + 1
                spinSprite.z = 2
                delSprite = sprites.create(img`
                    . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
                    2 2 e e 2 2 e e e 2 e 2 2 2 2 2 2 2 2 2
                    2 2 e 2 e 2 e 2 2 2 e 2 2 2 2 2 2 2 2 2
                    2 2 e 2 e 2 e e 2 2 e 2 2 2 2 2 2 2 2 2
                    2 2 e 2 e 2 e 2 2 2 e 2 2 2 2 2 2 2 2 2
                    2 2 e e 2 2 e e e 2 e e e 2 2 2 2 2 2 2
                    . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
                `, SpriteKind.Player)
                delSprite.left = spinSprite.left
                delSprite.top = spinSprite.bottom + 1
                delSprite.z = 2
                exitSprite = sprites.create(img`
                    . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
                    2 2 e e e 2 e 2 e 2 e e e 2 e e e 2 2 2
                    2 2 e 2 2 2 e 2 e 2 2 e 2 2 2 e 2 2 2 2
                    2 2 e e 2 2 2 e 2 2 2 e 2 2 2 e 2 2 2 2
                    2 2 e 2 2 2 e 2 e 2 2 e 2 2 2 e 2 2 2 2
                    2 2 e e e 2 e 2 e 2 e e e 2 2 e 2 2 2 2
                    . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
                `, SpriteKind.Player)
                exitSprite.left = delSprite.left
                exitSprite.top = delSprite.bottom + 1
                exitSprite.z = 2
                selectMenu = new SpriteMenu([editSprite, spinSprite, delSprite, exitSprite], [editSprite.image, spinSprite.image, delSprite.image, exitSprite.image], [img`
                    . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
                    4 4 e e e 4 e e 4 4 e e e 4 e e e 4 4 4
                    4 4 e 4 4 4 e 4 e 4 4 e 4 4 4 e 4 4 4 4
                    4 4 e e 4 4 e 4 e 4 4 e 4 4 4 e 4 4 4 4
                    4 4 e 4 4 4 e 4 e 4 4 e 4 4 4 e 4 4 4 4
                    4 4 e e e 4 e e 4 4 e e e 4 4 e 4 4 4 4
                    . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
                `, img`
                    . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
                    4 4 e e e 4 e e e 4 e e e 4 e 4 4 e 4 4
                    4 4 e 4 4 4 e 4 e 4 4 e 4 4 e e 4 e 4 4
                    4 4 e e e 4 e e e 4 4 e 4 4 e 4 e e 4 4
                    4 4 4 4 e 4 e 4 4 4 4 e 4 4 e 4 4 e 4 4
                    4 4 e e e 4 e 4 4 4 e e e 4 e 4 4 e 4 4
                    . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
                `, img`
                    . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
                    4 4 e e 4 4 e e e 4 e 4 4 4 4 4 4 4 4 4
                    4 4 e 4 e 4 e 4 4 4 e 4 4 4 4 4 4 4 4 4
                    4 4 e 4 e 4 e e 4 4 e 4 4 4 4 4 4 4 4 4
                    4 4 e 4 e 4 e 4 4 4 e 4 4 4 4 4 4 4 4 4
                    4 4 e e 4 4 e e e 4 e e e 4 4 4 4 4 4 4
                    . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
                `, img`
                    . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
                    4 4 e e e 4 e 4 e 4 e e e 4 e e e 4 4 4
                    4 4 e 4 4 4 e 4 e 4 4 e 4 4 4 e 4 4 4 4
                    4 4 e e 4 4 4 e 4 4 4 e 4 4 4 e 4 4 4 4
                    4 4 e 4 4 4 e 4 e 4 4 e 4 4 4 e 4 4 4 4
                    4 4 e e e 4 e 4 e 4 e e e 4 4 e 4 4 4 4
                    . 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 .
                `])
                selectMenu.show()
                controller.moveSprite(cursor, 0, 0)
            }

        } else if ((controller.A.isPressed() || browserEvents.MouseLeft.isPressed()) && menu === 1) {
            if (selectMenu.selectedIdx === 0) {
                menu = 2
                selectMenu.destroy()
                controller.moveSprite(cursor)
            } else if (selectMenu.selectedIdx === 1) {
                menu = 3
                selectMenu.destroy()
            } else if (selectMenu.selectedIdx === 2) {
                menu = -1
                pathArray[currentSelection].pointArray.removeAt(pointIdxSelected)
                selectMenu.destroy()
                controller.moveSprite(cursor)
            } else if (selectMenu.selectedIdx === 3) {
                menu = -1
                selectMenu.destroy()
                controller.moveSprite(cursor)
            }

        } else if ((controller.A.isPressed() || browserEvents.MouseLeft.isPressed()) && menu === 4) {
            if (selectMenu.selectedIdx === 0) {
                menu = 2
                pathArray[currentSelection].pointArray.push(new PathPoint(cursor.x, cursor.y))
                pointIdxSelected = pathArray[currentSelection].pointArray.length - 1
                selectMenu.destroy()
                controller.moveSprite(cursor)
            } else if (selectMenu.selectedIdx === 1) {
                menu = 2
                pointIdxSelected = Math.min(game.askForNumber("Index to insert"), pathArray[currentSelection].pointArray.length)
                pathArray[currentSelection].pointArray.insertAt(pointIdxSelected, new PathPoint(cursor.x, cursor.y))
                selectMenu.destroy()
                controller.moveSprite(cursor)
            } else if (selectMenu.selectedIdx === 2) {
                menu = -1
                selectMenu.destroy()
                controller.moveSprite(cursor)
            }

        } else if ((controller.A.isPressed() || browserEvents.MouseLeft.isPressed()) && (menu === 2 || menu === 3)) {
            menu = -1
            controller.moveSprite(cursor)
            pathArray[currentSelection].fillSegmentLengths()
            //console.log(pathArray[currentSelection].lengthArray.length)
        }
    }
    controller.anyButton.onEvent(ControllerButtonEvent.Pressed, click)
    browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, click)
    scene.createRenderable(1, (image: Image, camera: scene.Camera) => {
        if (browserEvents.MouseLeft.isPressed()) {
            browserEvents.MouseLeft.setPressed(false)
        }
        if (browserEvents.mouseX() > 0 && browserEvents.mouseY() > 0) {
            cursor.x = browserEvents.mouseX() + 0.5
            cursor.y = browserEvents.mouseY() + 0.5
        }
        //console.log(pathArray[0].distBetweenIdx(1))
        //console.log(Path.distBetweenPoints(pathArray[0].pointArray[1], pathArray[0].pointArray[2]))
        if (menu === 3) {
            //Special case for when changing angles
            //May be a bit messier than running twice but I prefer not to calculate paths twice
            pathArray[currentSelection].renderPath(image, true, true, true)
        } else {
            //Normal case
            pathArray[currentSelection].renderPath(image)
        }
        if (cursor.x < 1) {
            cursor.x = 1
        }
        if (cursor.y < 1) {
            cursor.y = 1
        }
        if (cursor.x > scene.screenWidth()) {
            cursor.x = scene.screenWidth()
        }
        if (cursor.y > scene.screenHeight()) {
            cursor.y = scene.screenHeight()
        }
        //for dragging stuff lel
        if (menu === 2) {
            pathArray[currentSelection].pointArray[pointIdxSelected].x = cursor.x - 0.5
            pathArray[currentSelection].pointArray[pointIdxSelected].y = cursor.y - 0.5
        }
        //for spinny stuff
        if (menu === 3) {
            if (controller.right.isPressed()) {
                pathArray[currentSelection].pointArray[pointIdxSelected].curveAngle += Math.PI / 180
                pathArray[currentSelection].pointArray[pointIdxSelected].curveAngle = pathArray[currentSelection].pointArray[pointIdxSelected].curveAngle % (Math.PI * 2)
            }
            if (controller.left.isPressed()) {
                pathArray[currentSelection].pointArray[pointIdxSelected].curveAngle -= Math.PI / 180
                pathArray[currentSelection].pointArray[pointIdxSelected].curveAngle = (pathArray[currentSelection].pointArray[pointIdxSelected].curveAngle + Math.PI * 2) % (Math.PI * 2)
            }
            if (controller.up.isPressed()) {
                pathArray[currentSelection].pointArray[pointIdxSelected].curveDis++
                if (pathArray[currentSelection].pointArray[pointIdxSelected].curveDis > Math.abs(maxDist)) {
                    pathArray[currentSelection].pointArray[pointIdxSelected].curveDis--
                }
            } 
            if (controller.down.isPressed()) {
                pathArray[currentSelection].pointArray[pointIdxSelected].curveDis--
                if (pathArray[currentSelection].pointArray[pointIdxSelected].curveDis < 0 - Math.abs(maxDist)) {
                    pathArray[currentSelection].pointArray[pointIdxSelected].curveDis++
                }
            }
        }
        //Render ids
        for (let i = 0; i < pathArray[currentSelection].pointArray.length; i++) {
            if (pathArray[currentSelection].pointArray[i].y > 60) {
                SpriteMenu.drawOnImage(image, i.toString(), pathArray[currentSelection].pointArray[i].x - 1, pathArray[currentSelection].pointArray[i].y - 9)
            } else {
                SpriteMenu.drawOnImage(image, i.toString(), pathArray[currentSelection].pointArray[i].x - 1, pathArray[currentSelection].pointArray[i].y + 5)
            }
        }
    })
}

class SpriteMenu {
    public selectedIdx = 0
    public spriteArray: Sprite[]
    public highlightedImages: Image[]
    public spriteImages: Image[]
    public active = false
    constructor(spriteArray: Sprite[], spriteImages: Image[], highlightedImages: Image[]) {
        this.spriteArray = spriteArray
        this.highlightedImages = highlightedImages
        this.spriteImages = spriteImages
        this.refresh()
        this.hide()
    }
    public refresh() {
        this.selectedIdx = this.selectedIdx % this.spriteArray.length
        if (this.selectedIdx < 0) {
            this.selectedIdx = this.spriteArray.length - 1
        }
        for (let i = 0; i < this.spriteArray.length; i++) {
            this.spriteArray[i].setImage(this.spriteImages[i])
        }
        if (this.active) {
            this.spriteArray[this.selectedIdx].setImage(this.highlightedImages[this.selectedIdx])
        }
    }
    public checkDirections(alt = false) {
        if (this.active) {
            if (alt) {
                if (controller.up.isPressed()) {
                    this.selectedIdx -= 1
                    this.refresh()
                } else if (controller.down.isPressed()) {
                    this.selectedIdx += 1
                    this.refresh()
                }
            } else {
                if (controller.left.isPressed()) {
                    this.selectedIdx -= 1
                    this.refresh()
                } else if (controller.right.isPressed()) {
                    this.selectedIdx += 1
                    this.refresh()
                }
            }
            let mouseDetect = sprites.create(img`
                    3
            `, SpriteKind.Player)
            mouseDetect.setPosition(browserEvents.mouseX() + 0.5, browserEvents.mouseY() + 0.5)
            for (let i = 0; i < this.spriteArray.length; i++) {
                if (mouseDetect.overlapsWith(this.spriteArray[i])) {
                    this.selectedIdx = i
                }
            }
            mouseDetect.destroy()
            this.refresh()
        }
    }
    public hide() {
        for (let i = 0; i < this.spriteArray.length; i++) {
            this.spriteArray[i].setFlag(SpriteFlag.Invisible, true)
            this.active = false
            this.selectedIdx = 0
            this.refresh()
        }
    }
    public show() {
        for (let i = 0; i < this.spriteArray.length; i++) {
            this.spriteArray[i].setFlag(SpriteFlag.Invisible, false)
            this.active = true
            this.refresh()
        }
    }
    public drawOnBoth(img1: Image, img2: Image, index: number, text: string, offsetX = 2, offsetY = 1) {
        SpriteMenu.drawOnImage(img1, text, offsetX, offsetY)
        SpriteMenu.drawOnImage(img2, text, offsetX, offsetY)
        this.spriteImages[index] = img1
        this.highlightedImages[index] = img2
        this.refresh()
    }
    public destroy() {
        for (let i = 0; i < this.spriteArray.length; i++) {
            this.spriteArray[i].destroy()
        }
        this.selectedIdx = this.spriteArray = this.highlightedImages = this.spriteImages = this.active = null
    }
    public static drawOnImage(drawImage: Image, text: string, offsetX = 1, offsetY = 1, maxWidth = 160, heightSpace = 7) {
        let sideCounter: number
        sideCounter = offsetX
        for (let j = 0; j < text.length; j++) {
            drawImage.drawTransparentImage(this.returnFonts()[this.returnFontNames().indexOf(text.charAt(j).toUpperCase())], sideCounter, offsetY)
            sideCounter += this.returnFonts()[this.returnFontNames().indexOf(text.charAt(j).toUpperCase())].width + 1
            if (sideCounter + this.returnFonts()[this.returnFontNames().indexOf(text.charAt(Math.min(text.length - 1, j + 1)).toUpperCase())].width > maxWidth) {
                sideCounter = offsetX
                offsetY += heightSpace
            }
        }
    }
    public static returnFontNames() {
        return ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", ",", "~", "`", "{", "}", " ", "<", ">", ":"]
    }
    public static returnKaKiGoFontNames() {
        return ["NI", "NU", "NO", "NE", "NA", "ZI", "ZU", "ZO", "ZE", "ZA", "KI", "KU", "KO", "KE", "KA", "TI", "TU", "TO", "TE", "TA", "GI", "GU", "GO", "GE", "GA", ]
    }
    public static returnFonts() {
        return [img`
            . e .
            e . e
            e e e
            e . e
            e . e
        `, img`
        e e .
        e . e
        e e .
        e . e
        e e .
    `, img`
        . e e
        e . .
        e . .
        e . .
        . e e
    `, img`
        e e .
        e . e
        e . e
        e . e
        e e .
    `, img`
        e e e
        e . .
        e e .
        e . .
        e e e
    `, img`
        e e e
        e . .
        e e .
        e . .
        e . .
    `, img`
        e e e
        e . .
        e . e
        e . e
        e e e
    `, img`
        e . e
        e . e
        e e e
        e . e
        e . e
    `, img`
        e e e
        . e .
        . e .
        . e .
        e e e
    `, img`
        . . e
        . . e
        . . e
        e . e
        . e .
    `, img`
        e . e
        e . e
        e e .
        e . e
        e . e
    `, img`
        e . .
        e . .
        e . .
        e . .
        e e e
    `, img`
        e . . . e
        e e . e e
        e . e . e
        e . . . e
        e . . . e
    `, img`
        e . . e
        e e . e
        e . e e
        e . . e
        e . . e
    `, img`
        . e .
        e . e
        e . e
        e . e
        . e .
    `, img`
        e e e
        e . e
        e e e
        e . .
        e . .
    `, img`
        . e .
        e . e
        e . e
        e e e
        . e e
    `, img`
        e e .
        e . e
        e e .
        e . e
        e . e
    `, img`
        . e e
        e . .
        . e .
        . . e
        e e .
    `, img`
        e e e
        . e .
        . e .
        . e .
        . e .
    `, img`
        e . e
        e . e
        e . e
        e . e
        . e .
    `, img`
        e . e
        e . e
        e . e
        . e .
        . e .
    `, img`
        e . . . e
        e . e . e
        e . e . e
        e . e . e
        . e . e .
    `, img`
        e . e
        e . e
        . e .
        e . e
        e . e
    `, img`
        e . e
        e . e
        . e .
        . e .
        . e .
    `, img`
        e e .
        . . e
        . e .
        e . .
        . e e
    `, img`
        . e .
        e . e
        e . e
        e . e
        . e .
    `, img`
        . e .
        e e .
        . e .
        . e .
        e e e
    `, img`
        . e .
        e . e
        . . e
        . e .
        e e e
    `, img`
        e e e
        . . e
        . e e
        . . e
        e e e
    `, img`
        e . e
        e . e
        . e e
        . . e
        . . e
    `, img`
        e e e
        e . .
        e e .
        . . e
        e e .
    `, img`
        e e e
        e . .
        e e e
        e . e
        e e e
    `, img`
        e e e
        . . e
        . . e
        . . e
        . . e
    `, img`
        e e e
        e . e
        e e e
        e . e
        e e e
    `, img`
        e e e
        e . e
        e e e
        . . e
        . . e
    `, img`
        .
        .
        .
        .
        e
    `, img`
        .
        .
        .
        e
        e
    `, img`
        . . a .
        . a . .
        a a a a
        . . a .
        . a . .
    `, img`
        . 5 .
        5 2 5
        5 2 5
        5 2 5
        5 5 5
    `, img`
        . 9 . 9 .
        9 9 9 9 9
        9 9 9 9 9
        . 9 9 9 .
        . . 9 . .
    `, img`
        . d d d .
        d b c b d
        d b b c d
        d b c b d
        . d d d .
    `, img`
        . . .
        . . .
        . . .
        . . .
        . . .
    `, img`
        . . e
        . e .
        e . .
        . e .
        . . e
    `, img`
        e . .
        . e .
        . . e
        . e .
        e . .
    `, img`
        .
        e
        .
        .
        e
    `]
    }
    //https://docs.google.com/spreadsheets/d/11-zCEaOKTSJYAaF32aLZPCeWq6aYrdwU_0B-Ay_yfno/edit?usp=sharing
    public static returnKaKiGo() {
        return [img`
            . e e e .
            e . e . e
            e . e . e
            e . e . e
            e . e . e
        `, img`
            e e . e e e .
            e . e . . . e
            . . e . . . e
            . . e . . . e
            . . e . . . e
        `, img`
            . e e e . . .
            e . . . e . .
            e . . . e . .
            e . . . e . e
            e . . . e e e
        `, img`
            . e e e .
            e . . . e
            e e e e e
            e . . . e
            e . . . e
        `, img`
            e e e e .
            e e . . e
            e . e . e
            e . e . e
            e . . e e
        `, img`
            e e e e e
            . e e . .
            . . e . .
            . e e e .
            . . e . .
        `, img`
            e e e e e e e
            e . . e . . .
            . . . . e . .
            . . . e . e .
            . . . . e . .
        `, img`
            e e e e e . .
            . e . . . . .
            . . e . . . .
            . e . e . . e
            . . e . . e e
        `, img`
            e e e e e
            . e . . .
            e e e e e
            . e . e .
            . . e . .
        `, img`
            e e e e e
            . e e . .
            . . e e .
            . e . e e
            . . e . e
        `, img`
            e . e . .
            e e e e .
            e . e . e
            e e e e .
            e . e . .
        `, img`
            e e e . e . .
            e . e e . e .
            . . e . . . e
            . . e e . e .
            . . e . e . .
        `, img`
            e . e . . . .
            e e . e . . .
            e . . . e . .
            e e . e . . e
            e . e . . e e
        `, img`
            e . e . .
            e e . e .
            e e e e e
            e e . e .
            e . e . .
        `, img`
            e . e . .
            e e . e .
            e . e . e
            e e . e .
            e . e . e
        `, img`
            . e e e .
            e . e . e
            e . e . e
            . e e e .
            e e e e e
        `, img`
            e e . e e e .
            e . e . . . e
            . . e . . . e
            . . . e . e .
            . . e e . e e
        `, img`
            . e e e . . .
            e . . . e . .
            e . . . e . .
            . e . e . . e
            e e . e e e e
        `, img`
            . e e e .
            e . . . e
            e e e e e
            . e . e .
            e e . e e
        `, img`
            e e e e .
            e e . . e
            e . e . e
            . e . e .
            e e . e e
        `, img`
            . . e . .
            e . e e .
            e . e . e
            . e e e .
            . . e . .
        `, img`
            e e . . . . .
            e . e . e e .
            . . e . e . e
            . . . e e e .
            . . . . e . .
        `, img`
            . . . . . . .
            e . e e . . .
            e . e . e . .
            . e e e . . e
            . . e . . e e
        `, img`
            . . . . .
            e . e e .
            e e e e e
            . e e e .
            . . e . .
        `, img`
            e . . . .
            e e e e .
            e . e . e
            . e e e .
            . . e . e
        `]
    }
}