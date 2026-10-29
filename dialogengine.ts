class DialogWindow {
    public static interrupt: boolean = false
    public static xpad: number = 2
    public static ypad: number = 2
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
    public drawDialog(text: String) {
        DialogWindow.interrupt = false
        let currentLetterImg: Image
        let xName = DialogWindow.xpad
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
        // Print name
        new TextPrinter(this.nameBox, name, 40, false)
        // Print text
        new TextPrinter(this.dialogBox, text, 40, true)
    }
    public destroy() {
        this.dialogBoxImage = this.dialogBox = this.nameBox = this.nameBoxImage = null
    }
}
class TextPrinter {
    public spaceIdx: number = -1
    public keyWords: number[] = []
    public spaces: number[] = []
    public currentLetterImg: Image
    public keyWordsLoc = 0
    public spaceLoc = 0
    public emphasized = false
    public xPadding = DialogWindow.xpad
    public yPadding = DialogWindow.ypad
    public x = DialogWindow.xpad
    public y = DialogWindow.ypad
    public dialogBox: Image
    public text: String
    public pause: number
    public currentTime = Timing.gameTime
    public chars: number = 0
    public static printTextArr: TextPrinter[] = []
    public static printTextDialogArr: TextPrinter[] = []
    constructor(dialogBox: Image, text: String, pause: number, dialog = false) {
        this.dialogBox = dialogBox
        this.text = text
        this.pause = pause
        if (dialog) {
            this.printTextDialogSetup()
            TextPrinter.printTextDialogArr.push(this)
        } else {
            TextPrinter.printTextArr.push(this)
        }
    }
    public printText() {
        if (Timing.gameTime >= this.currentTime) {
            this.currentTime += this.pause
            this.currentLetterImg = DialogText.font[DialogText.fontLetters.indexOf(this.text.charAt(this.chars).toUpperCase())].clone()
            this.dialogBox.drawTransparentImage(this.currentLetterImg, this.x, 2)
            this.x += this.currentLetterImg.width + 1
            this.chars++
            if (this.chars >= this.text.length) {
                this.destroy()
                return
            }
            if (DialogWindow.interrupt) {
                this.currentTime -= this.pause
            }
            if (Timing.gameTime >= this.currentTime) {
                this.printText()
            }
        }
    }
    public printTextDialogSetup() {
        //Print text
        for (let i = 0; i < this.text.length; i++) {
            if (this.text.charAt(i) === " ") {
                if (DialogText.emphasizedWords.indexOf(this.text.slice(this.spaceIdx + 1, i)) >= 0) {
                    this.keyWords.push(this.spaceIdx + 1)
                    this.keyWords.push(i)
                }
                this.spaceIdx = i
                this.spaces.push(i)
            }
        }
        this.spaces.push(this.text.length)
    }
    public printTextDialog() {
        if (Timing.gameTime >= this.currentTime) {
            this.currentTime += this.pause
            this.currentLetterImg = DialogText.font[DialogText.fontLetters.indexOf(this.text.charAt(this.chars).toUpperCase())].clone()
            if (!this.emphasized && this.chars === this.keyWords[this.keyWordsLoc]) {
                this.emphasized = true
                this.keyWordsLoc++
            }
            if (this.emphasized && this.chars === this.keyWords[this.keyWordsLoc]) {
                this.emphasized = false
                this.keyWordsLoc++
            }
            if (this.emphasized) {
                this.currentLetterImg.replace(14, 8)
            }
            this.dialogBox.drawTransparentImage(this.currentLetterImg, this.x, this.y)
            this.x += this.currentLetterImg.width + 1
            if (this.spaces[this.spaceLoc] === this.chars) {
                this.spaceLoc++
            }
            if (this.x > this.dialogBox.width - this.xPadding - DialogText.distToSpace(this.text, this.chars, this.spaces[this.spaceLoc])) {
                this.x = this.xPadding
                this.y += 6
            }
            this.chars++
            if (this.chars >= this.text.length) {
                this.destroy()
                return
            }
            if (DialogWindow.interrupt) {
                this.currentTime -= this.pause
            }
            if (Timing.gameTime >= this.currentTime) {
                this.printTextDialog()
            }
        }
    }
    public destroy() {
        TextPrinter.printTextArr.removeElement(this)
        TextPrinter.printTextDialogArr.removeElement(this)
        this.spaceIdx = this.keyWords = this.spaces = this.currentLetterImg = this.keyWordsLoc = this.spaceLoc = this.emphasized = this.xPadding = this.yPadding = this.x = this.y = this.dialogBox = this.text = this.pause = this.currentTime = this.chars = null
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
            ....................................................................................................
            ....................................................................................................
            ....................................................................................................
            ....................................................................................................
            ....................................................................................................
            ....................................................................................................
            ....................................................................................................
            .........................................666666666666...............................................
            .....................................666666666666666666.............................................
            ....................................666666666666666666666...........................................
            .................................6666666668666666666666666..........................................
            ..............................66666666666668866668888866666.........................................
            ............................666666666686666666688666668666668.......................................
            ..........................6666666666686888888666666666666666666.....................................
            .........................6666666666666666666666666666666666666688...................................
            ........................666666666666666668866666666666666666666668..................................
            ........................666666666666666686666866666666666666666666..................................
            .......................666666666666666666666668699666996666666666...................................
            .......................66866666666666666696666866989666966666....6..................................
            .......................668666666666666696699688968789666966668......................................
            ......................6686666666696666689689688968778966896668......................................
            ......................666666666668969689688898966877729689.6668.....................................
            ......................6669966999688966889822279687222779789..666....................................
            ......................6698899896887899872134779682134777789...668...................................
            ......................6987889988877788778334778978334177789.....6...................................
            ......................9877788987777777778345177781345177789.........................................
            ......................987887888777777778155f87778155f187789.........................................
            .....................98778887887777777777788877777778877789.........................................
            .....................98778987877777777777777777788777777789.........................................
            .....................98789997877777777777777777788877777789.........................................
            .....................98778998877777777777777777778887777789.........................................
            .....................98778998877777777777777777777788777789.........................................
            ......................9877888777777777777777777777888777789.........................................
            ......................9987778777777777777777777778898777789.........................................
            ........................99888777777777777777777778987777789.........................................
            ........................6699877777777777777777777787777789..........................................
            .........................666988777777777777777777777777789..........................................
            .........................666699877777777777777778898777789..........................................
            ...........................6669987777777777899887777777789..........................................
            ............................66989877777777777777777777789...........................................
            ...............................98988777777777787887777789...........................................
            ...............................9879987777777777777777789............................................
            ...............................9877798877777777777777789............................................
            ................................98777998877777777777789.............................................
            ................................98777779988887777777789.............................................
            .................................9877777799998888888899.............................................
            .................................9877777777799999999989.............................................
            .................................98777777777777777777789............................................
            .................................98777777777777777777789............................................
            .................................98777777777777777777789............................................
            .................................48777777777777777777784............................................
            ................................4344477777777777777774434...........................................
            ...............................433333444444777774444433334..........................................
            ..............................43333333333334444433333333334.........................................
            ..........................44443333333333333333333333333333344.......................................
            .......................4443333333333333333333333333333333333344.....................................
            ....................444333333333333333333333333333333333333333344...................................
            ...................43333333333333333333333333333333333333333333334444...............................
            ..................4333333333333333333333333333333333333333333333333334..............................
            .................433333333333333333333333333333333333333333333333333334.............................
        `,
        img`
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111fffffffffffffff1111111111111111111111
            111111111111111111111111111111111111111111111111111111111111fffeeeeeeeeeeeeeeefff1111111111111111111
            1111111111111111111111111111111111111111111111111111111111ffeeedddddddddddddddeeeff11111111111111111
            11111111111111111111111111111111111111111111111111111111ffeedddddddddddddddddddddeef1111111111111111
            1111111111111111111111111111111111111111111111111111111feedddddddddddddddddddddddddef111111111111111
            111111111111111111111111111111111111111111111111111111feddddddddddddddddddddeddddddef111111111111111
            11111111111111111111111111111111111111111111111111111fedddddddedddddddddddddddedddddef11111111111111
            11111111111111111111111111111111111111111111111111111fedddddeddddddddddddedddddeddddef11111111111111
            1111111111111111111111111111111111111111111111111111feddddddeddddddddddddedddddedddddef1111111111111
            111111111111111111111111111111111111111111111111111feddddddeddddddedddd8eddddddedddddef1111111111111
            111111111111111111111111111111111111111111111111111feddddddeddddededdde8eddedddedddddef1111111111111
            11111111111111111111111111111111111111111111111111feddddddedddde88edde87ede8eddeeddddef1111111111111
            11111111111111111111111111111111111111111111111111feddddddeddde87edde87ede87ede88eddddef111111111111
            1111111111111111111111111111111111111111111111111feddddddedddde87edde87ede87ede87eddddef111111111111
            1111111111111111111111111111111111111111111111111feddd999edddde87ede333ee87ede873eddddef111111111111
            1111111111111111111111111111111111111111111111111fedd9888edddde8edde87ee877ee3337eddddef111111111111
            111111111111111111111111111111111111111111111111feddd9877eddde8edde555e8777887777edddef1111111111111
            111111111111111111111111111111111111111111111111feddd9788edddeedde5122b777775555edddef11111111111111
            111111111111111111111111111111111111111111111111feddd9789eddedddee2222b777751228eddef111111111111111
            11111111111111111111111111111111111111111111111fedddd9877edddeee889b2b98777222beddeff111111111111111
            11111111111111111111111111111111111111111111111feddddd987eddde88777788877779b2bedefddf11111111111111
            11111111111111111111111111111111111111111111111feddddd988eddde77777777777877788eefdddf11111111111111
            11111111111111111111111111111111111111111111111fedddddd99eddde77777777777877777789dddf11111111111111
            1111111111111111111111111111111111111111111111fedddddddddeddde77777777777887777789dddf11111111111111
            1111111111111111111111111111111111111111111111fedddddddddeddde77777777777888777789dddf11111111111111
            1111111111111111111111111111111111111111111111fedddddddddeddde77777777777898777789dddf11111111111111
            1111111111111111111111111111111111111111111111fedddddddddeddde77777777778987777789dddf11111111111111
            111111111111111111111111111111111111111111111feddddddddddeddde7777777777787777789ddddf11111111111111
            111111111111111111111111111111111111111111111feddddddddddeddde8777777777777777789ddddf11111111111111
            111111111111111111111111111111111111111111111feddddedddddeddde9877777777777877789ddddf11111111111111
            111111111111111111111111111111111111111111111feddddedddddedddde98777777778987789dddddf11111111111111
            111111111111111111111111111111111111111111111feddddeddddddeddde89877789987777789dddddf11111111111111
            11111111111111111111111111111111111111111111fedddddeddddddeddde8798777777777789ddedddf11111111111111
            11111111111111111111111111111111111111111111feddddedddddededdde8779877777777789dddeddf11111111111111
            11111111111111111111111111111111111111111111feddddedddddeddeddde77798777777789ddddeddf11111111111111
            11111111111111111111111111111111111111111111feddddeddddddddeddde7777987777789dddddedddff111111111111
            11111111111111111111111111111111111111111111fedddeeddddddddeddde777779888889ddddddeddddf111111111111
            1111111111111111111111111111111111111111111feddddeddddddddddeee777777799999dddddddeddddf111111111111
            1111111111111111111111111111111111111111111feddddedddddddddd9877777777789dddddddddeddddf111111111111
            1111111111111111111111111111111111111111111feddddedddddddddd9877777777789dddddddddedddf1111111111111
            1111111111111111111111111111111111111111111feddddedddddeedd98777777777789ddddeddddedddf1111111111111
            1111111111111111111111111111111111111111111feddddedddddedddc87777777777789dddeddddedddf1111111111111
            1111111111111111111111111111111111111111111feddddedddddeddcbcccccc7777778cdddedddeddddf1111111111111
            111111111111111111111111111111111111111111feddddeedddddedcbbbbbbbbcccccccbcdeddddeddddf1111111111111
            111111111111111111111111111111111111111111feddddeddddddccbbbbbbbbbbbbbbbbbbccddddedddf11111111111111
            111111111111111111111111111111111111111111feddddedddddcbbbbbbbbbbbbbbbbbbbbbbcdddedddf11111111111111
            111111111111111111111111111111111111111111feddddedddccbbbbbbbbbbbbbbbbbbbbbbbbccccdddf11111111111111
            111111111111111111111111111111111111111111feddddecccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccf111111111111111
            111111111111111111111111111111111111111111feddcccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc111111111111111
            111111111111111111111111111111111111111111fedcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc111111111111111
            11111111111111111111111111111111111111111fedcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc11111111111111
            11111111111111111111111111111111111111111fecbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc11111111111111
            1111111111111111111111111111111111111111fecbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc11111111111111
            1111111111111111111111111111111111111111ccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc11111111111111
            111111111111111111111111111111111111111cbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc1111111111111
            111111111111111111111111111111111111111cbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc1111111111111
            111111111111111111111111111111111111111cbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc1111111111111
        `
    ]
    public static readonly avatarNames: String[] = [
        "usr1",
        "usr2"
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
            this.dialogWindow.drawDialog(this.tree[i])
            pauseUntil(() => !controller.A.isPressed())
            pauseUntil(() => controller.A.isPressed() || DialogWindow.interrupt === true)
            pauseUntil(() => !controller.A.isPressed())
            DialogWindow.interrupt = true
            pauseUntil(() => !controller.A.isPressed())
            pauseUntil(() => controller.A.isPressed())
            pauseUntil(() => !controller.A.isPressed())
        }
    }
}