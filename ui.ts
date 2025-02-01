namespace SpriteKind {
    export const Menu = SpriteKind.create()
}
class Menu {
    public menuSprite: Sprite
    protected updateLoop: any
    public top: number
    public left: number
    public width: number
    public itemHeight: number
    public options: string[]
    public fullMenuImg: Image
    protected updater = true
    public selectedIdx = 0
    public oppositeAlign: boolean
    public active = true
    public font = [img`
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
    `]
    public fontNames = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", ",", "~", "`", "<", ">"]
    constructor(left: number, top: number, width: number, options: string[], itemheight = 7, oppositeAlign = false) {
        this.left = left
        this.top = top
        this.width = width
        this.itemHeight = itemheight
        this.oppositeAlign = oppositeAlign
        this.options = options
        this.menuSprite = sprites.create(image.create(this.width, this.itemHeight * this.options.length), SpriteKind.Menu)
        this.menuSprite.left = this.left
        this.menuSprite.top = this.top
        this.menuSprite.z = 100
        this.fullMenuImg = image.create(this.width, this.options.length * this.itemHeight)
        this.startUpdater()
        this.buildMenu(true)
        this.menuSprite.onDestroyed(() => {
            this.destroy()
        })
    }
    protected startUpdater() {
        this.updateLoop = game.currentScene().eventContext.registerFrameHandler(18, () => {
            this.updater = true
        })
    }
    public changeIdx(toChangeBy: number) {
        this.selectedIdx += toChangeBy
        if (this.selectedIdx > this.options.length - 1) {
            this.selectedIdx -= this.options.length
        } else if (this.selectedIdx < 0) {
            this.selectedIdx += this.options.length
        }
        this.buildMenu(false)
    }
    protected buildMenu(smooth: boolean) {
        this.fullMenuImg.fill(1)
        this.fullMenuImg.fillRect(0, this.selectedIdx * this.itemHeight, this.fullMenuImg.width, this.itemHeight, 3)
        let sideCounter: number
        for (let i = 0; i < this.options.length; i++) {
            sideCounter = 1
            for (let j = 0; j < this.options[i].length; j++) {
                if (this.oppositeAlign) {
                    this.fullMenuImg.drawTransparentImage(this.font[this.fontNames.indexOf(this.options[i].charAt(this.options[i].length - 1 - j).toUpperCase())], this.width - sideCounter - this.font[this.fontNames.indexOf(this.options[i].charAt(this.options[i].length - 1 - j).toUpperCase())].width, i * this.itemHeight + 1)
                    sideCounter += this.font[this.fontNames.indexOf(this.options[i].charAt(this.options[i].length - 1 - j).toUpperCase())].width + 1
                } else {
                    this.fullMenuImg.drawTransparentImage(this.font[this.fontNames.indexOf(this.options[i].charAt(j).toUpperCase())], sideCounter, i * this.itemHeight + 1)
                    sideCounter += this.font[this.fontNames.indexOf(this.options[i].charAt(j).toUpperCase())].width + 1
                }
            }
        }
        if (smooth) {
            let percentagesComplete = [.2, .48, .72, .9]
            let clone: Image
            for (let i = 0; i < percentagesComplete.length; i++) {
                clone = this.fullMenuImg.clone()
                clone.fillRect(this.fullMenuImg.width * percentagesComplete[i], 0, 160, this.fullMenuImg.height, 0)
                this.menuSprite.setImage(clone)
                if (this.updater) {
                    this.updater = false
                } else {
                    i--
                    pause(0)
                }
            }
        }
        this.menuSprite.setImage(this.fullMenuImg)
    }
    public onMenuButton(button: controller.Button, run: (idx: number) => void) {
        if (button.isPressed() && this.active === true) {
            run(this.selectedIdx)
        }
    }
    public destroy() {
        game.currentScene().eventContext.unregisterFrameHandler(this.updateLoop)
        this.oppositeAlign = this.active = this.selectedIdx = this.updateLoop = this.font = this.itemHeight = this.fontNames = this.fullMenuImg = this.left = this.options = this.top = this.updater = this.width = null
        this.menuSprite.destroy()
    }
    
}
editMode()
function editMode() {
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
    let test: Menu
    controller.moveSprite(cursor)
    controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
        test = new Menu(4, 4, 80, ["test", "test", "hi", "><~`", "0123"])
        controller.moveSprite(cursor, 0, 0)
    })    
    controller.anyButton.onEvent(ControllerButtonEvent.Pressed, function () {
        if (test) {
            test.onMenuButton(controller.A, (idx) => {
                console.log(idx)
            })
            test.onMenuButton(controller.down, (idx) => {
                test.changeIdx(1)
            })
            test.onMenuButton(controller.up, (idx) => {
                test.changeIdx(-1)
            })
            test.onMenuButton(controller.B, (idx) => {
                test.destroy()
                controller.moveSprite(cursor)
            })
        }
    })
}