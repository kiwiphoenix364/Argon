let levelData = "(1.0){0,0,([10,10,2.356194490192345,40,0][40,40,2.356194490192345,40,0][126,56,1,50,0][90,100,0,-40,0][91,31,1,50,0][29,81,1,50,0][10,11,1,50,0]),0,2,2,500,100,0}{30,1,([81,120,1.5759586531581293,50,0][160,56,0.00516232636324343,50,0][81,56,0.00516232636324343,50,150][1,56,6.270894341022895,50,0][82,1,1.5759586531581313,50,0]),1000,3,0.5,2,1000,0}"
//let levelData = "{0,0,([10,10,2.356194490192345,40][40,40,2.356194490192345,40][90,100,0,-40]),[66.6541302488668,98.15508250730261,],0,2,1,5}"
let pathArray: Path[]
let idCounter: number
let idCache: number
let debug = false
game.stats = true
if (debug) {
    EditLevel(levelData)
} else {
    openingMenu()
    // RunLevel(levelData)
}
function EditLevel(levelData: string) {
    game.pushScene()
    pathArray = []
    decompString(levelData)
    idCounter = pathArray.length - 1
    idCache = 0
    console.log("loaded")
    editMode()
}
function RunLevel(levelData: string) {
    game.pushScene()
    pathArray = []
    decompString(levelData)
    idCounter = pathArray.length - 1
    idCache = 0
    console.log("loaded")
    let time = 0
    let idx = 0
    let updater: control.FrameCallback
    updater = game.currentScene().eventContext.registerFrameHandler(18, () => {
        time += 1 / 50
        if (idx < pathArray.length && time >= pathArray[idx].time) {
            new PathFollower(pathArray[idx++])
        }
        if (idx >= pathArray.length) {
            // Delete handler
            game.currentScene().eventContext.unregisterFrameHandler(updater)
        }
    })
}
class Timing {
    private static updater: control.FrameCallback
    public static gameTime = 0
    private static pauseTime = 0
    private static paused = true
    constructor() {

    }
    public static startTimer() {
        if (Timing.paused) {
            control.timer8.start
            Timing.updater = game.currentScene().eventContext.registerFrameHandler(6, () => {
                Timing.gameTime = control.timer8.millis() + Timing.pauseTime
                info.setScore(Timing.gameTime)
                Timing.paused = false
            })
        }
    }
    public static pauseTimer() {
        if (!Timing.paused) {
            Timing.pauseTime = Timing.gameTime
            control.timer8.reset()
            game.currentScene().eventContext.unregisterFrameHandler(Timing.updater)
            Timing.paused = true
        }
    }
    public static resetTimer() {
        Timing.pauseTime = 0
        if (!Timing.paused) {
            control.timer8.reset()
            game.currentScene().eventContext.unregisterFrameHandler(Timing.updater)
            Timing.paused = true
        }
    }
    public static getPausedState() {
        return Timing.paused
    }
}
class OverallGameStats {
    public static currentGameState = "start"
    constructor() {

    }
}
controller.menu.onEvent(ControllerButtonEvent.Pressed, function() {
    game.pushScene()
})
class Cursor {
    private updater: control.FrameCallback
    public sprite = sprites.create(img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `)
    public mode = 0
    public speed = 100
    public gyroSensitivity = 0.5
    public gyroAutoSmooth = 5
    public maxSmoothness = 15
    constructor(image = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `, mode = 0, speed = 10) {
        this.sprite.setImage(image)
        this.mode = mode
        this.speed = speed
        this.sprite.z = 10000
        this.createConstructor()
    }
    private createConstructor() {
        let bufX: number[] = []
        let bufY: number[] = []
        let dynamicSmoothingVal = 1
        this.updater = game.currentScene().eventContext.registerFrameHandler(7, () => {
            if (this.mode === 0) {
                this.sprite.x += controller.dx() * this.speed
                this.sprite.y += controller.dy() * this.speed
            } else if (this.mode === 1) {
                let avgX = 0
                let avgY = 0
                let ctr = 0
                let curX = controller.acceleration(ControllerDimension.X) / 1.28 * this.gyroSensitivity
                let curY = controller.acceleration(ControllerDimension.Y) / 1.71 * this.gyroSensitivity
                dynamicSmoothingVal = this.maxSmoothness - Math.constrain(Math.round((Math.abs(curX - bufX[dynamicSmoothingVal - 1]) + Math.abs(curY - bufY[dynamicSmoothingVal - 1])) / this.gyroAutoSmooth), 0, this.maxSmoothness - 1)
                if (dynamicSmoothingVal > bufX.length) {
                    while (dynamicSmoothingVal != bufX.length) {
                        bufX.unshift(curX)
                        bufY.unshift(curY)
                    }
                } else if (dynamicSmoothingVal < bufX.length) {
                    while (dynamicSmoothingVal != bufX.length) {
                        bufX.shift()
                        bufY.shift()
                    }
                }
                bufX.shift()
                bufY.shift()
                bufX[dynamicSmoothingVal - 1] = curX
                bufY[dynamicSmoothingVal - 1] = curY
                for (let i = 0; i < dynamicSmoothingVal; i++) {
                    avgX += bufX[i] * (i + 1)
                    avgY += bufY[i] * (i + 1)
                    ctr += (i + 1)
                }
                this.sprite.x = Math.round(avgX / ctr) + 80
                this.sprite.y = Math.round(avgY / ctr) + 60
            } else {
                this.sprite.x = browserEvents.mouseX()
                this.sprite.y = browserEvents.mouseY()
            }
            this.sprite.x = Math.constrain(this.sprite.x, 0, 160)
            this.sprite.y = Math.constrain(this.sprite.y, 0, 120)
        })
    }
    public changeCursorImg(image: Image) {
        this.sprite.setImage(image)
    }
}
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!Timing.getPausedState())
    game.pushScene()
})
new Cursor(img`
    . . 3 . .
    . . 3 . .
    3 3 . 3 3
    . . 3 . .
    . . 3 . .
`, 1)
Timing.startTimer()