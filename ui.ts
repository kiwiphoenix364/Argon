let pathTimesArray = [0]
let pathArray: Path[]
editMode()

function editMode() {
    let currentSelection = 0
    scene.createRenderable(1, (image: Image, camera: scene.Camera) => {
        let test = new Path(0, 0, [new PathPoint(10, 10, 0), new PathPoint(40, 40, 1)])
        test.renderPath(image)
    })
    let cursor = sprites.create(img`
        d . . . d
        . d . d .
        . . . . .
        . d . d .
        d . . . d
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
    let topMenu = new SpriteMenu([menuLeftButton, menuMiddleButton, menuRightButton, menuPlusButton], 
    [menuLeftButton.image, menuMiddleButton.image, menuRightButton.image, menuPlusButton.image], [img`
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
    `])
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
                `, 1, pathTimesArray[currentSelection].toString())
    controller.anyButton.onEvent(ControllerButtonEvent.Pressed, function() {
        if (controller.B.isPressed()) {
            if (topMenu.active) {
                topMenu.hide()
            } else {
                topMenu.show()
            }
        }
        if (controller.A.isPressed() && topMenu.active) {
            if (topMenu.selectedIdx == 3) {
                pathTimesArray.push(game.askForNumber("Add Number"))
            } else if (topMenu.selectedIdx == 0) {
                currentSelection -= 1
                if (currentSelection < 0) {
                    currentSelection = pathTimesArray.length - 1
                }
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
                `,
                    1, pathTimesArray[currentSelection].toString())
            } else if (topMenu.selectedIdx == 2) {
                currentSelection += 1
                currentSelection = currentSelection % pathTimesArray.length
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
                `,
                    1, pathTimesArray[currentSelection].toString())
                
            } else if (topMenu.selectedIdx == 1) {
                pathTimesArray[currentSelection] = game.askForNumber("Edit")
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
                `,
                    1, pathTimesArray[currentSelection].toString())
            }
        }
        topMenu.checkDirections()
    })
}
class SpriteMenu {
    public selectedIdx = 0
    public spriteArray: Sprite[]
    public highlightedImages: Image[]
    public spriteImages: Image[]
    public active = true
    constructor(spriteArray: Sprite[], spriteImages: Image[], highlightedImages: Image[]) {
        this.spriteArray = spriteArray
        this.highlightedImages = highlightedImages
        this.spriteImages = spriteImages
        this.refresh()
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
    public checkDirections() {
        if (this.active) {
            if (controller.left.isPressed()) {
                this.selectedIdx -= 1
                this.refresh()
            } else if (controller.right.isPressed()) {
                this.selectedIdx += 1
                this.refresh()
            }
        }
    }
    public hide() {
        for (let i = 0; i < this.spriteArray.length; i++) {
            this.spriteArray[i].setFlag(SpriteFlag.Invisible, true)
            this.active = false
        }
    }
    public show() {
        for (let i = 0; i < this.spriteArray.length; i++) {
            this.spriteArray[i].setFlag(SpriteFlag.Invisible, false)
            this.active = true
        }
    }
    public drawOnBoth(img1: Image, img2: Image, index: number, text: string, offsetX = 2, offsetY = 1) {
        SpriteMenu.drawOnImage(img1, text, offsetX, offsetY)
        SpriteMenu.drawOnImage(img2, text, offsetX, offsetY)
        this.spriteImages[index] = img1
        this.highlightedImages[index] = img2
        this.refresh()
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
        return ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", ",", "~", "`", "{", "}", " ", "<", ">"]
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
    `]
    }
}