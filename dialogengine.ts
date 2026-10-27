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
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111.111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111.111111
            111111111111111111111111111111111111111111111111111111111111111ffffffffffff111111111111111111.111111
            111111111111111111111111111111111111111111111111111111111111fffeeeeeeeeeeeefff111111111111111.111111
            11111111111111111111111111111111111111111111111111111111111feeeddddddddddddeeefff111111111111.111111
            111111111111111111111111111111111111111111111111111111111ffeddddddddddddddddddeeeff1111111111.111111
            1111111111111111111166666666666611111111111111111111111ffeeddddddddddddddddddddddeef111111111.111111
            111111111111111166666666666666666611111111111111111111feeddddddddddddddddddddddddddef11111111.111111
            11111111111111166666666666666666666611111111111111111feddddddddddddddddddddddddddddef11111111.111111
            11111111111166666666686666666666666661111111111111111fedddddddddddddddddddddddddddddef1111111.111111
            1111111116666666666666886666888886666611111111111111fedddddddddddddddd777dddddddddddeff111111.111111
            111111166666666668666666668866666866666811111111111feddddddddddddddd777777777dddddddeff111111.111111
            111116666666666686888888666666666666666666111111111feddddddddddddd777777777777dddddddef111111.111111
            11116666666666666666666666666666666666666688111111feddddddddddddd77777777777777efddddef111111.111111
            11166666666666666666886666666666666666666666811111feddddddddddd77777777777777778efdddef111111.111111
            1116666666666666666866668666666666666666666661111feddddddddddd7777777777777777778efdddef11111.111111
            1166666666666666666666666869966699666666666611111fedddd9999dd77777774477777744478efdddef11111.111111
            1166866666666666666696666866989666966666111161111feddd988899d777774277777742777789fdddef11111.111111
            116686666666666666966996889687896669666681111111fedddd9877899777777555777777555778fdddef11111.111111
            166866666666966666896896889687789668966681111111fedddd97887887777751ee7777751ee778fddef111111.111111
            166666666666896968968889896687772968916668111111fedddd9789877777777eed777777eed778fdef1111111.111111
            16669966999688966889822279687222779789116661111feddddd9879987777777ded777777ded78fdefd1111111.111111
            16698899896887899872134779682134777789111668111feddddd987787777777777777777777778fefdd1111111.111111
            16987889988877788778334778978334177789111116111feddddd988777777777777777777777778ffdde1111111.111111
            19877788987777777778345177781345177789111111111fedddddd998777777777777777777777789ddde1111111.111111
            1987887888777777778155f87778155f18778911111111feddddddddd9877777777777777777777789ddde1111111.111111
            9877888788777777777778887777777887778911111111feddddddddd9877777777777777777777789ddde1111111.111111
            9877898787777777777777777778877777778911111111fedddddddddd987777777777777777777789ddde1111111.111111
            9878999787777777777777777778887777778911111111feddddddddddd98777777777777777777789ddde1111111.111111
            987789988777777777777777777788877777891111111feddddddddddddd987777777777777777789dddde1111111.111111
            987789988777777777777777777777887777891111111fedddddddddddddd98777777777777777789dddde1111111.111111
            198778887777777777777777777778887777891111111feddddddddddddddd9877777777777877789dddde1111111.111111
            199877787777777777777777777788987777891111111feddddddddddddddd998777777778997789ddddde1111111.111111
            111998887777777777777777777789877777891111111feddddddddddddddd989877778987777789ddddde1111111.111111
            11166998777777777777777777777877777891111111fedddddddddddddddd98798777777777789dddddde1111111.111111
            11116669887777777777777777777777777891111111fedddddddddddddddd98779877777777789dddddde1111111.111111
            11116666998777777777777777788987777891111111fedddddddddddddddd9877798777777789ddddddde1111111.111111
            11111166699877777777778998877777777891111111feddddddddddddddd9877777987777789ddddddddd1e11111.111111
            11111116698987777777777777777777778911111111feddddddddddddddd987777779888889ddddddddddde11111.111111
            1111111111989887777777777878877777891111111fedddddddddddddddd98777777799999dddddddddddde11111.111111
            1111111111987998777777777777777778911111111feddddddddddddddd9877777777789dddddddddddddde11111.111111
            1111111111987779887777777777777778911111111feddddddddddddddd9877777777789ddddddddddddde111111.111111
            1111111111198777998877777777777789111111111fedddddddddddddd98777777777789ddddddddddddde111111.111111
            11111111111987777799888877777777891111111111feeddddddddddddc87777777777789dddddddddddde111111.111111
            111111111111987777779999888888889911111111111ffeddddddddddcbcccccc7777778cdddddddddddde111111.111111
            11111111111198777777777999999999891111111111111feddddddddcbbbbbbbbcccccccbcddddddddddde111111.111111
            111111111111987777777777777777777891111111111111fedddddccbbbbbbbbbbbbbbbbbbccddddddddf1111111.111111
            1111111111119877777777777777777778911111111111111fedddcbbbbbbbbbbbbbbbbbbbbbbcdddddddf1111111.111111
            11111111111198777777777777777777789111111111111111feccbbbbbbbbbbbbbbbbbbbbbbbbccccdddf1111111.111111
            1111111111111877777777777777777778111111111111111cccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccf11111111.111111
            1111111111111111777777777777777711111111111111cccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc11111111.111111
            111111111111111111111177777111111111111111111cbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc11111111.111111
            11111111111111111111111111111111111111111111cbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc1111111.111111
            1111111111111111111111111111111111111111111cbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc1111111.111111
            111111111111111111111111111111111111111111cbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc1111111.111111
            1111111111111111111111111111111111111111ccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc1111111.111111
            111111111111111111111111111111111111111cbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc111111.111111
            111111111111111111111111111111111111111cbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc111111.111111
            111111111111111111111111111111111111111cbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc111111.111111
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