class Timing {
    private static updater: control.FrameCallback
    public static gameTime = 0
    private static paused: boolean = true
    constructor() {

    }
    public static startTimer() {
        if (Timing.paused === true) {
            control.timer8.reset()
            Timing.paused = false
            Timing.updater = game.currentScene().eventContext.registerFrameHandler(6, () => {
                Timing.gameTime = control.timer8.millis()
                info.setScore(Timing.gameTime)
            })
        }
    }
    public static pauseTimer() {
        if (Timing.paused === false) {
            game.currentScene().eventContext.unregisterFrameHandler(Timing.updater)
            Timing.paused = true
        }
    }
    public static unpauseTimer() {
        if (Timing.paused === true) {
            control.timer8.start = Timing.gameTime
            Timing.paused = false
            Timing.updater = game.currentScene().eventContext.registerFrameHandler(6, () => {
                Timing.gameTime = control.timer8.millis()
                info.setScore(Timing.gameTime)
            })
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
    public gyroSensitivity = 0.4
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
            } else if (this.mode === 2) {
                this.sprite.x = browserEvents.mouseX() + 0.5
                this.sprite.y = browserEvents.mouseY() + 0.5
            } else {
                this.sprite.x = controller.acceleration(ControllerDimension.X) / 1.28 * this.gyroSensitivity + 80
                this.sprite.y = controller.acceleration(ControllerDimension.Y) / 1.71 * this.gyroSensitivity + 60
            }
            this.sprite.x = Math.constrain(this.sprite.x, 0, 160)
            this.sprite.y = Math.constrain(this.sprite.y, 0, 120)
        })
    }
    public changeCursorImg(image: Image) {
        this.sprite.setImage(image)
    }
}
class EnemyLayer {
    public static layer: scene.Renderable
    constructor() {
        
    }
    public static startEnemyLayer() {
        EnemyLayer.layer = scene.createRenderable(100, (screenImg: Image, camera: scene.Camera) => {
            let deltaValue = control.eventContext().deltaTime
            // Stuff is optimized into separate lists so it doesnt have if statements and can run the fastest possible
            // Lol I'm an idiot it's of not in but smh why doesnt the compiler just treat them the same
            // Simple projectiles
            for (let i = Adv_Projectile.fast_proj_list.length - 1; i >= 0; i--) {
                const val = Adv_Projectile.fast_proj_list[i]
                val.x += val.vX * deltaValue
                val.y += val.vY * deltaValue
                if (val.autoDestroy && (val.x <= -val.img.width || val.x >= screenImg.width || val.y <= -val.img.height || val.y >= screenImg.height) || Timing.gameTime > val.life) {
                    val.destroy(Adv_Projectile.fast_proj_list)
                    continue
                }
                screenImg.drawTransparentImage(val.img, val.x, val.y)
            }
            // Projectiles with acceleration
            for (let i = Adv_Projectile.proj_list.length - 1; i >= 0; i--) {
                const val = Adv_Projectile.proj_list[i]
                val.x += val.vX * deltaValue
                val.y += val.vY * deltaValue
                val.vX += val.aX * deltaValue
                val.vY += val.aY * deltaValue
                if (val.autoDestroy && (val.x <= -val.img.width || val.x >= screenImg.width || val.y <= -val.img.height || val.y >= screenImg.height) || Timing.gameTime > val.life) {
                    val.destroy(Adv_Projectile.proj_list)
                    continue
                }
                screenImg.drawTransparentImage(val.img, val.x, val.y)
            }
            // Projectiles with acceleration and turning
            for (let i = Adv_Projectile.slow_proj_list.length - 1; i >= 0; i--) {
                const val = Adv_Projectile.slow_proj_list[i]
                val.x += val.vX * deltaValue
                val.y += val.vY * deltaValue
                val.vX += val.aX * deltaValue
                val.vY += val.aY * deltaValue
                if (val.autoDestroy && (val.x <= -val.img.width || val.x >= screenImg.width || val.y <= -val.img.height || val.y >= screenImg.height) || Timing.gameTime > val.life) {
                    val.destroy(Adv_Projectile.slow_proj_list)
                    continue
                }
                helpers.imageDrawScaledRotated(screenImg, val.x, val.y, val.img, 1, 1, Math.atan2(val.vY, val.vX))
            }
        })
    }
}
class PauseMenuCore{
    constructor() {

    }
    public static pauseMenu() {
        controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
            if (!Timing.getPausedState()) {
                Timing.pauseTimer()
                game.pushScene()
            } else {
                game.popScene()
                Timing.unpauseTimer()
            }
            PauseMenuCore.pauseMenu()
        })
    }
}
class GameUtils{
    constructor() {

    }
    public static setupGame() {
        PauseMenuCore.pauseMenu()
        Timing.startTimer()
        EnemyLayer.startEnemyLayer()
    }
}