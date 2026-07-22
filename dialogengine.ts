class DialogWindow {
    public dialogBoxImage: Image
    public dialogBox: Image
    public skip = false
    constructor (boxImg: Image) {
        this.dialogBox = boxImg
        this.dialogBoxImage = boxImg.clone()
    }
    public clearDialogBox() {
        this.dialogBox = this.dialogBoxImage.clone()
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
            "test lol!",
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
    static drawDialog(textWindow: DialogWindow, text: String) {
        let xPadding = 2
        let yPadding = 2
        let pause = 40
        let keyWords: number[] = []
        let spaces: number[] = []
        let spaceIdx: number = 0
        let emphasized = false
        let keyWordsLoc = 0
        let spaceLoc = 0
        let currentLetterImg: Image
        let x = xPadding
        let y = yPadding
        for (let i = 0; i < text.length; i++) {
            if (text.charAt(i) === " ") {
                if (this.emphasizedWords.indexOf(text.slice(spaceIdx + 1, i)) >= 0) {
                    keyWords.push(spaceIdx)
                    keyWords.push(i)
                }
                spaceIdx = i
                spaces.push(i)
            }
        }
        
        for (let i = 0; i < text.length; i++) {
            if (!textWindow.skip) {
                
                currentLetterImg = this.font[this.fontLetters.indexOf(text.charAt(i).toUpperCase())].clone()
                
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
                
                
                textWindow.dialogBox.drawTransparentImage(currentLetterImg, x, y)
                x += currentLetterImg.width + 1

                if (spaces[spaceLoc] === i) {
                    spaceLoc++
                }
                if (x > textWindow.dialogBox.width - xPadding - this.distToSpace(text, i, spaces[spaceLoc])) {
                    x = xPadding
                    y += 6
                }

                this.pause()
            }
        }
    }
    static pause() {
        pause(40)
    }
    static distToSpace(text: String, startIdx: number, endIdx: number) {
        let space = 0
        for (let i = startIdx; i < endIdx; i++) {
            space += this.font[this.fontLetters.indexOf(text.charAt(i).toUpperCase())].width + 1
        }
        return space
    }
}
let mySprite = sprites.create(img`
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
    ................................................................................
`, SpriteKind.Player)
let test = new DialogWindow(mySprite.image)
DialogText.drawDialog(test, DialogText.getDialog(0, 1))