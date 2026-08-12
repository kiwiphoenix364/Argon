class Timing {
    private static updater: control.FrameCallback
    public static gameTime = 0
    private static pauseTime = 0
    private static paused = false
    constructor() {

    }
    public static startTimer() {
        if (Timing.paused) {
            control.timer8.reset()
            control.timer8.start
            Timing.paused = false
            Timing.updater = game.currentScene().eventContext.registerFrameHandler(6, () => {
                Timing.gameTime = control.timer8.millis() + Timing.pauseTime
                info.setScore(Timing.gameTime)
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
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
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
                this.sprite.x += controller.dx() * this.speed / 10
                this.sprite.y += controller.dy() * this.speed / 10
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
                this.sprite.x = browserEvents.mouseX() + 0.5
                this.sprite.y = browserEvents.mouseY() + 0.5
            }
            this.sprite.x = Math.constrain(this.sprite.x, 0, 160)
            this.sprite.y = Math.constrain(this.sprite.y, 0, 120)
        })
    }
    public changeCursorImg(image: Image) {
        this.sprite.setImage(image)
    }
}
pauseMenu()
function pauseMenu() {
    controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
        if (!Timing.getPausedState()) {
            Timing.pauseTimer()
            game.pushScene()
        } else {
            game.popScene()
            Timing.startTimer()
        }
        pauseMenu()
    })
}

new Cursor(img`
    . . 3 . .
    . . 3 . .
    3 3 . 3 3
    . . 3 . .
    . . 3 . .
`, 2)