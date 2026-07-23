class BoolRef {
    public bool: Boolean
    constructor (value: boolean) {
        this.bool = value
    }
}
class DialogWindow {
    public dialogBoxImage: Image
    public dialogBox: Image
    constructor (boxImg: Image) {
        this.dialogBox = boxImg
        this.dialogBoxImage = boxImg.clone()
    }
    public clearDialogBox() {
        this.dialogBox.copyFrom(this.dialogBoxImage)
    }
    public drawDialog(text: String, interrupt: BoolRef) {
        control.runInBackground(() => {
            interrupt.bool = false
            let xPadding = 2
            let yPadding = 2
            let pause = 40
            let keyWords: number[] = []
            let spaces: number[] = []
            let spaceIdx: number = -1
            let emphasized = false
            let keyWordsLoc = 0
            let spaceLoc = 0
            let currentLetterImg: Image
            let x = xPadding
            let y = yPadding
            this.clearDialogBox()
            for (let i = 0; i < text.length; i++) {
                if (text.charAt(i) === " ") {
                    if (DialogText.emphasizedWords.indexOf(text.slice(spaceIdx + 1, i)) >= 0) {
                        keyWords.push(spaceIdx + 1)
                        keyWords.push(i)
                    }
                    spaceIdx = i
                    spaces.push(i)
                }
            }
            spaces.push(text.length)
            for (let i = 0; i < text.length; i++) {
                currentLetterImg = DialogText.font[DialogText.fontLetters.indexOf(text.charAt(i).toUpperCase())].clone()
                if (!emphasized && i === keyWords[keyWordsLoc]) {
                    emphasized = true
                    keyWordsLoc++
                }
                if (emphasized && i === keyWords[keyWordsLoc]) {
                    emphasized = false
                    keyWordsLoc++
                }
                if (emphasized) {
                    currentLetterImg.replace(14, 8)
                }
                this.dialogBox.drawTransparentImage(currentLetterImg, x, y)
                x += currentLetterImg.width + 1
                if (spaces[spaceLoc] === i) {
                    spaceLoc++
                }
                if (x > this.dialogBox.width - xPadding - DialogText.distToSpace(text, i, spaces[spaceLoc])) {
                    x = xPadding
                    y += 6
                }
                if (!interrupt.bool) {
                    DialogWindow.pause()
                }
            }
        })
    }
    static pause() {
        pause(40)
    }
    public destroy() {
        this.dialogBoxImage = this.dialogBox = null
    }
}
class DialogText {
    // Structure
    // [
    //    [
    //       "Dialog",
    //       "Dialog Line 2"
    //    ],
    //    [
    //       "2nd Dialog Lines"
    //    ]
    // ]
    public static readonly dialog: String[][] = [
        [
            "test lol test test the line wrapping again!",
            "You moved to the next dialog!"
        ]
    ]
    public static readonly emphasizedWords: String[] = [
        "test",
        "the"
    ]
    public static readonly font: Image[] = [
        img`
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
            . . .
            . . .
            . . .
            . . .
            . . .
        `, img`
            .
            e
            .
            .
            e
        `, img`
            . . .
            . . .
            e e e
            . . .
            . . .
        `, img`
            . e .
            . e .
            . e .
            . . .
            . e .
        `]
    public static readonly fontLetters: String[] = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", ",", " ", ":", "-", "!"
    ]
    constructor () {
        
    }
    static getDialog(set: number, value: number) {
        return this.dialog[set][value]
    }
    static distToSpace(text: String, startIdx: number, endIdx: number) {
        let space = 0
        for (let i = startIdx; i < endIdx; i++) {
            space += this.font[this.fontLetters.indexOf(text.charAt(i).toUpperCase())].width + 1
        }
        return space
    }
}
class DialogController {
    public sprite: Sprite
    public dialogWindow: DialogWindow
    public tree: String[]
    constructor (left: number, top: number, right: number, bottom: number, tree: String[]) {
        this.sprite = sprites.create(image.create(right - left, bottom - top), SpriteKind.Player)
        this.sprite.left = left
        this.sprite.top = top
        this.dialogWindow = new DialogWindow(this.sprite.image)
        this.tree = tree
        this.drawDialog()
    }
    protected drawDialog() {
        for (let i = 0; i < this.tree.length; i++) {
            let interrupt = new BoolRef(false)
            this.dialogWindow.drawDialog(this.tree[i], interrupt)
            pauseUntil(() => !controller.A.isPressed())
            pauseUntil(() => controller.A.isPressed())
            pauseUntil(() => !controller.A.isPressed())
            interrupt.bool = true
            pauseUntil(() => !controller.A.isPressed())
            pauseUntil(() => controller.A.isPressed())
            pauseUntil(() => !controller.A.isPressed())
        }
    }
}
let test2 = new DialogController(0, 0, 160, 120, DialogText.dialog[0])