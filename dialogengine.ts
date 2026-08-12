class BoolRef {
    public bool: Boolean
    constructor (value: boolean) {
        this.bool = value
    }
}
class DialogWindow {
    public dialogBoxImage: Image
    public dialogBox: Image
    public nameBoxImage: Image
    public nameBox: Image
    public avatarImage: Image
    constructor (boxImg: Image, nameImg: Image, avatarImg: Image) {
        this.nameBox = nameImg
        this.nameBoxImage = nameImg.clone()
        this.dialogBox = boxImg
        this.dialogBoxImage = boxImg.clone()
        this.avatarImage = avatarImg
    }
    public clearDialogBox() {
        this.dialogBox.copyFrom(this.dialogBoxImage)
    }
    public clearNameBox() {
        this.nameBox.copyFrom(this.nameBoxImage)
    }
    public drawDialog(text: String, interrupt: BoolRef) {
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
        let xName = xPadding
        let y = yPadding
        let name: String = ""
        this.clearNameBox()
        this.clearDialogBox()
        if (text.includes(":")) {
            for (let i = 0; i < text.length; i++) {
                if (text.charAt(i) === ":") {
                    name = text.substr(0, i)
                    text = text.substr(i + 1, text.length - i - 1).trim()
                    break
                }
            }
        }
        //Draw avatar
        this.avatarImage.copyFrom(DialogText.avatars[DialogText.avatarNames.indexOf(name)])
        //Print name
        control.runInBackground(() => { 
            for (let i = 0; i < name.length; i++) {
                currentLetterImg = DialogText.font[DialogText.fontLetters.indexOf(name.charAt(i).toUpperCase())].clone()
                this.nameBox.drawTransparentImage(currentLetterImg, xName, 2)
                xName += currentLetterImg.width + 1
                if (!interrupt.bool) {
                    DialogWindow.pause()
                }
            }
        })
        //Print text
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
        control.runInBackground(() => {
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
            interrupt.bool = true
        })
    }
    static pause() {
        pause(40)
    }
    public destroy() {
        this.dialogBoxImage = this.dialogBox = this.nameBox = this.nameBoxImage = null
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
            "usr1: test lol test test the line wrapping again!",
            "usr2: You moved to the next dialog!"
        ]
    ]
    public static readonly emphasizedWords: String[] = [
        "test",
        "the"
    ]
    public static readonly avatars: Image[] = [
        img`
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111133333111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111133333333331111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111333333333333311111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111333333333333311111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111333333333333331111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111113333333333333331111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111113333333333333333111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111113333333333333333111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111133333333333333333311111111111111111111111111111111111111111111111
            1111111111111111111111111111111111133333333333333333311111111111111111111111111111111111111111111111
            1111111111111111111111111111111111133333333333333333311111111111111111111111111111111111111111111111
            1111111111111111111111111111111111133333333333333333311111111111111111111111111111111111111111111111
            1111111111111111111111111111111111133333333333333333311111111111111111111111111111111111111111111111
            1111111111111111111111111111111111133333333333333333311111111111111111111111111111111111111111111111
            1111111111111111111111111111111111133333333333333333311111111111111111111111111111111111111111111111
            1111111111111111111111111111111111133333333333333333311111111111111111111111111111111111111111111111
            1111111111111111111111111111111111113333333333333331111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111113333333333333311111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111333333333333111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111133333333311111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111131333333311111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111131111113311111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111131111113111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111331111113111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111133333311111113111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111333311111111111113331111111111111111111111111111111111111111111111111111
            1111111111111111111111111113311111111111111111133311111111111111111111111111111111111111111111111111
            1111111111111111111111111113111111111111111111111331111111111111111111111111111111111111111111111111
            1111111111111111111111111133111111111111111111111133111111111111111111111111111111111111111111111111
            1111111111111111111111111131111111111111111111111113311111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111311111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111331111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
        `
    ]
    public static readonly avatarNames: String[] = [
        "usr1"
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
    public nameSprite: Sprite
    public avatarSprite: Sprite
    public dialogWindow: DialogWindow
    public tree: String[]
    constructor(tree: String[], left: number, top: number, right: number, bottom: number, leftN: number, topN: number, rightN: number, bottomN: number, leftA: number, topA: number, rightA: number, bottomA: number) {
        this.sprite = sprites.create(image.create(right - left, bottom - top), SpriteKind.Player)
        this.sprite.left = left
        this.sprite.top = top
        this.nameSprite = sprites.create(image.create(rightN - leftN, bottomN - topN), SpriteKind.Player)
        this.nameSprite.left = leftN
        this.nameSprite.top = topN
        this.avatarSprite = sprites.create(image.create(rightA - leftA, bottomA - topA), SpriteKind.Player)
        this.avatarSprite.left = leftA
        this.avatarSprite.top = topA
        this.dialogWindow = new DialogWindow(this.sprite.image, this.nameSprite.image, this.avatarSprite.image)
        this.tree = tree
        this.drawDialog()
    }
    protected drawDialog() {
        for (let i = 0; i < this.tree.length; i++) {
            let interrupt = new BoolRef(false)
            this.dialogWindow.drawDialog(this.tree[i], interrupt)
            pauseUntil(() => !controller.A.isPressed())
            pauseUntil(() => controller.A.isPressed() || interrupt.bool === true)
            pauseUntil(() => !controller.A.isPressed())
            interrupt.bool = true
            pauseUntil(() => !controller.A.isPressed())
            pauseUntil(() => controller.A.isPressed())
            pauseUntil(() => !controller.A.isPressed())
        }
    }
}
//let test2 = new DialogController(DialogText.dialog[0], 0, 60, 160, 120, 100, 50, 160, 60, 0, 0, 100, 60)