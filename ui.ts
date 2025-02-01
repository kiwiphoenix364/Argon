namespace SpriteKind {
    export const Menu = SpriteKind.create()
}
class Menu {
    protected menuSprite: Sprite
    protected updateLoop: any
    public top: number
    public left: number
    public width: number
    public options: string[]
    public fullMenuImg: Image
    protected updater = true
    public selectedIdx = 0
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
    constructor(left: number, top: number, width: number, options: string[]) {
        this.left = left
        this.top = top
        this.width = width
        this.options = options
        this.menuSprite = sprites.create(image.create(this.width, 7 * this.options.length), SpriteKind.Menu)
        this.menuSprite.left = this.left
        this.menuSprite.top = this.top
        this.menuSprite.z = 100
        this.fullMenuImg = image.create(this.width, this.options.length * 7)
        this.startUpdater()
        this.buildMenu(true)
    }
    protected startUpdater() {
        this.updateLoop = game.currentScene().eventContext.registerFrameHandler(18, () => {
            this.updater = true
        })
        controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
            ++this.selectedIdx
            this.modValueByLength()
            this.buildMenu(false)
        })
        controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
            --this.selectedIdx
            this.modValueByLength()
            this.buildMenu(false)
        })
    }
    protected modValueByLength() {
        if (this.selectedIdx > this.options.length - 1) {
            this.selectedIdx -= this.options.length
        } else if (this.selectedIdx < 0) {
            this.selectedIdx += this.options.length
        }
    }
    protected buildMenu(smooth: boolean) {
        this.fullMenuImg.fill(1)
        this.fullMenuImg.fillRect(0, this.selectedIdx * 7, this.fullMenuImg.width, 7, 3)
        for (let i = 0; i < this.options.length; i++) {
            let sideCounter = 1
            for (let j = 0; j < this.options[i].length; j++) {
                this.fullMenuImg.drawTransparentImage(this.font[this.fontNames.indexOf(this.options[i].charAt(j).toUpperCase())], sideCounter, i * 7 + 1)
                sideCounter += this.font[this.fontNames.indexOf(this.options[i].charAt(j).toUpperCase())].width + 1
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
    onButtonPressed(button: controller.Button, handler: (selection: string, selectedIndex: number) => void) {
        
    }
    public destroy() {
        this.updateLoop.destroy()
        this.menuSprite.destroy()
        this.font = this.fontNames = this.fullMenuImg = this.left = this.options = this.top = this.updater = this.width = null
    }
    
}

    

controller.A.onEvent(ControllerButtonEvent.Pressed, function() {
    
    let test = new Menu(4, 4, 80, ["test", "test", "hi", "~`<>"])

})