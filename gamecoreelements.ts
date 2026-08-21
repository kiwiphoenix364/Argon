class Timing {
    private static updater: control.FrameCallback
    public static gameTime = 0
    private static pausedTime = 0
    public static delta = control.eventContext().deltaTime
    private static paused: boolean = true
    constructor() {

    }
    public static startTimer() {
        if (Timing.paused === true) {
            Timing.paused = false
            Timing.pausedTime = 0
            control.timer8.reset()
            Timing.updater = game.currentScene().eventContext.registerFrameHandler(6, () => {
                Timing.gameTime = control.timer8.millis()
                Timing.delta = control.eventContext().deltaTime
                info.setScore(Timing.gameTime)
            })
        }
    }
    public static pauseTimer() {
        if (Timing.paused === false) {
            Timing.paused = true
            Timing.pausedTime = control.timer8.millis() + Timing.pausedTime
            game.currentScene().eventContext.unregisterFrameHandler(Timing.updater)
        }
    }
    public static unpauseTimer() {
        if (Timing.paused === true) {
            Timing.paused = false
            control.timer8.reset()
            Timing.updater = game.currentScene().eventContext.registerFrameHandler(6, () => {
                Timing.gameTime = control.timer8.millis() + Timing.pausedTime
                Timing.delta = control.eventContext().deltaTime
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
                // Dynamic smoothing of gyro controls with mitigated input lag
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
class ADV_Projectile_Spawner_Updater {
    public static updater: control.FrameCallback
    constructor() {

    }
    public static startADVProjectileSpawnerUpdater() {
        ADV_Projectile_Spawner_Updater.updater = game.currentScene().eventContext.registerFrameHandler(20, () => {
            for (let i = ADV_Projectile_Spawner.adv_projectile_spawner_updater_list.length - 1; i >= 0; i--) {
                ADV_Projectile_Spawner.adv_projectile_spawner_updater_list[i].attemptSpawn()
            }
        })
    }
}
class PathFollowerUpdater {
    public static updater: control.FrameCallback
    constructor() {

    }
    public static startPathFollowerUpdater() {
        this.updater = game.currentScene().eventContext.registerFrameHandler(19, () => {
            for (let i = PathFollower.pathFollowerList.length - 1; i >= 0; i--) {
                const val = PathFollower.pathFollowerList[i]
                if ((Timing.gameTime - val.path.timeOffset) >= val.timeCounter && val.count > 0) {
                    val.count--
                    val.timeCounter += val.spacing
                    val.followObjectArray.push(new PathFollowObject(val.path))
                    if (val.enemyType < 0) {
                        val.followObjectArray[val.followObjectArray.length - 1].disPixels -= val.followObjectArray[val.followObjectArray.length - 1].extLength
                        val.followObjectArray[val.followObjectArray.length - 1].segmentDisPixels -= val.followObjectArray[val.followObjectArray.length - 1].extLength
                        val.followObjectArray[val.followObjectArray.length - 1].currentPoint = -1
                    } else {
                        val.followObjectArray[val.followObjectArray.length - 1].disPixels = 0
                        val.followObjectArray[val.followObjectArray.length - 1].segmentDisPixels = 0
                    }
                    if (val.path.pointArray[0].pauseAtPoint > 0) {
                        if (val.enemyType >= 0) {
                            val.followObjectArray[val.followObjectArray.length - 1].waitTime = val.path.pointArray[0].pauseAtPoint + Timing.gameTime
                        }
                    }
                }
                for (let i = 0; i < val.followObjectArray.length; i++) {
                    // Trigger if not paused
                    if (val.followObjectArray[i].waitTime <= Timing.gameTime) {
                        // Add to distance
                        val.followObjectArray[i].disPixels += val.speed * Timing.delta
                        val.followObjectArray[i].segmentDisPixels += val.speed * Timing.delta
                        if (val.followObjectArray[i].currentPoint >= 0) {
                            // In or after line
                            if (val.followObjectArray[i].segmentDisPixels > val.path.pointArray[val.followObjectArray[i].currentPoint].segmentLengths[val.followObjectArray[i].segmentLengthPos]) {
                                val.followObjectArray[i].segmentDisPixels -= val.path.pointArray[val.followObjectArray[i].currentPoint].segmentLengths[val.followObjectArray[i].segmentLengthPos]
                                val.followObjectArray[i].segmentLengthPos++
                            }
                            if (val.followObjectArray[i].disPixels > val.path.pointArray[val.followObjectArray[i].currentPoint].segmentLength) {
                                val.followObjectArray[i].segmentLengthPos = 0
                                // If needs to stop, stops, otherwise keeps going
                                if (val.path.pointArray[val.followObjectArray[i].currentPoint + 1].pauseAtPoint === 0) {
                                    val.followObjectArray[i].disPixels -= val.path.pointArray[val.followObjectArray[i].currentPoint].segmentLength
                                } else {
                                    val.followObjectArray[i].disPixels = 0
                                    val.followObjectArray[i].segmentDisPixels = 0
                                    val.followObjectArray[i].waitTime = val.path.pointArray[val.followObjectArray[i].currentPoint + 1].pauseAtPoint + Timing.gameTime
                                }
                                val.followObjectArray[i].currentPoint++
                            }
                        } else if (val.followObjectArray[i].segmentDisPixels >= 0 && val.followObjectArray[i].segmentDisPixels - val.speed * Timing.delta < 0) {
                            // If before line
                            if (val.path.pointArray[val.followObjectArray[i].currentPoint + 1].pauseAtPoint > 0) {
                                val.followObjectArray[i].disPixels = 0
                                val.followObjectArray[i].segmentDisPixels = 0
                                val.followObjectArray[i].waitTime = val.path.pointArray[val.followObjectArray[i].currentPoint + 1].pauseAtPoint + Timing.gameTime
                            }
                            val.followObjectArray[i].currentPoint++
                        }
                    } 
                    // Main movement update code
                    // Inside line case
                    if (val.followObjectArray[i].currentPoint >= 0 && val.followObjectArray[i].currentPoint <= val.path.pointArray.length - 2) {
                        val.nextPoint = val.path.findPoint(
                            val.followObjectArray[i].currentPoint,
                            // Percent of segments through + Percent through current segment / percentage segment is of whole
                            Fx8(val.followObjectArray[i].segmentLengthPos / val.path.pointArray[val.followObjectArray[i].currentPoint].segmentLengths.length + (val.followObjectArray[i].segmentDisPixels / val.path.pointArray[val.followObjectArray[i].currentPoint].segmentLengths[val.followObjectArray[i].segmentLengthPos]) / (val.path.pointArray[val.followObjectArray[i].currentPoint].segmentLengths.length))
                        )
                    } else if (val.followObjectArray[i].currentPoint < 0) {
                        // Before line case
                        val.nextPoint = val.path.findPoint(
                            0,
                            Fx8(val.followObjectArray[i].disPixels / val.path.pointArray[0].segmentLength)
                        )
                    } else if (val.followObjectArray[i].currentPoint > val.path.pointArray.length - 2) {
                        // After line case
                        val.nextPoint = val.path.findPoint(
                            val.path.pointArray.length - 2,
                            Fx8((val.followObjectArray[i].disPixels + val.path.pointArray[val.path.pointArray.length - 2].segmentLength) / val.path.pointArray[val.path.pointArray.length - 2].segmentLength)
                        )
                    }
                    if (val.nextPoint.x - val.followObjectArray[i].x != 0 && val.nextPoint.y - val.followObjectArray[i].y != 0 && val.nextPoint.x - val.followObjectArray[i].x - val.nextPoint.y - val.followObjectArray[i].y != NaN) {
                        val.followObjectArray[i].angle = new SimplePoint(val.nextPoint.x - val.followObjectArray[i].x, val.nextPoint.y - val.followObjectArray[i].y)
                    }
                    val.followObjectArray[i].setPosPoint(
                        val.nextPoint
                    )
                    // Destroy cases
                    if (
                        val.enemyType >= 0 &&
                        val.followObjectArray[i].currentPoint === val.path.pointArray.length - 1 &&
                        val.followObjectArray[i].segmentDisPixels > 0
                    ) {
                        val.followObjectArray[i].destroy()
                        val.followObjectArray.removeAt(i)
                    } else if (
                        val.enemyType < 0 &&
                        val.followObjectArray[i].currentPoint > val.path.pointArray.length - 2 &&
                        val.followObjectArray[i].disPixels > val.followObjectArray[i].extLength
                    ) {
                        val.followObjectArray[i].destroy()
                        val.followObjectArray.removeAt(i)
                    }
                }
                // Destroy array if empty
                if (val.count === 0 && val.followObjectArray.length === 0) {
                    val.destroy()
                }
            }
        })
    }
}
class PathFollowObjectUpdater {
    public static updater: control.FrameCallback
    constructor() {

    }
    public static startPathFollowObjectUpdater() {
        this.updater = game.currentScene().eventContext.registerFrameHandler(20, () => {
            for (let i = PathFollowObject.pathFollowObjectArray.length - 1; i >= 0; i--) {
                const val = PathFollowObject.pathFollowObjectArray[i]
                val.animationFrame++
                DataDrivenEnemies.runAnimation(val.enemy, val.enemyAnimation, val.animationFrame, val.x, val.y, val.angle)
            }
        })
    }
}
class EnemyLayer {
    public static layer: scene.Renderable
    constructor() {
        
    }
    public static startEnemyLayer() {
        EnemyLayer.layer = scene.createRenderable(100, (screenImg: Image, camera: scene.Camera) => {
            if (!Timing.getPausedState()) {
                // Stuff is optimized into separate lists so it doesnt have if statements and can run the fastest possible
                // Lol I'm an idiot it's of not in but smh why doesnt the compiler just treat them the same
                // Simple projectiles
                for (let i = Adv_Projectile.fast_proj_list.length - 1; i >= 0; i--) {
                    const val = Adv_Projectile.fast_proj_list[i]
                    val.x += val.vX * Timing.delta
                    val.y += val.vY * Timing.delta
                    if (val.autoDestroy && (val.x <= -val.img.width || val.x >= screenImg.width || val.y <= -val.img.height || val.y >= screenImg.height) || Timing.gameTime > val.life) {
                        val.destroy(Adv_Projectile.fast_proj_list)
                        continue
                    }
                    screenImg.drawTransparentImage(val.img, val.x, val.y)
                }
                // Projectiles with acceleration
                for (let i = Adv_Projectile.proj_list.length - 1; i >= 0; i--) {
                    const val = Adv_Projectile.proj_list[i]
                    val.x += val.vX * Timing.delta
                    val.y += val.vY * Timing.delta
                    val.vX += val.aX * Timing.delta
                    val.vY += val.aY * Timing.delta
                    if (val.autoDestroy && (val.x <= -val.img.width || val.x >= screenImg.width || val.y <= -val.img.height || val.y >= screenImg.height) || Timing.gameTime > val.life) {
                        val.destroy(Adv_Projectile.proj_list)
                        continue
                    }
                    screenImg.drawTransparentImage(val.img, val.x, val.y)
                }
                // Projectiles with acceleration and turning
                for (let i = Adv_Projectile.slow_proj_list.length - 1; i >= 0; i--) {
                    const val = Adv_Projectile.slow_proj_list[i]
                    val.x += val.vX * Timing.delta
                    val.y += val.vY * Timing.delta
                    val.vX += val.aX * Timing.delta
                    val.vY += val.aY * Timing.delta
                    if (val.autoDestroy && (val.x <= -val.img.width || val.x >= screenImg.width || val.y <= -val.img.height || val.y >= screenImg.height) || Timing.gameTime > val.life) {
                        val.destroy(Adv_Projectile.slow_proj_list)
                        continue
                    }
                    helpers.imageDrawScaledRotated(screenImg, val.x, val.y, val.img, 1, 1, Math.atan2(val.vY, val.vX))
                }
                // Enemy Sprites
                for (let i = EnemyRender.enemy_render_list.length - 1; i >= 0; i--) {
                    const val = EnemyRender.enemy_render_list[i]
                    screenImg.drawTransparentImage(val.img, val.x - (val.img.width >> 1), val.y - (val.img.height >> 1))
                }
                // Attempt Spawn Enemy Projectiles
                for (let i = PathFollower.pathFollowerList.length - 1; i >= 0; i--) {
                    const val = PathFollower.pathFollowerList[i]
                    for (let j = 0; j < val.followObjectArray.length; j++) {
                        for (let k = 0; k < val.followObjectArray[j].enemy.length; k++) {
                            if (val.followObjectArray[j].enemyType >= 0) {
                                val.followObjectArray[j].enemyProjectileSpawner.attemptSpawn(val.followObjectArray[j].enemy[k].sprite.x, val.followObjectArray[j].enemy[k].sprite.y)
                            } else {
                                for (let l = 0; l < val.followObjectArray[j].enemy[k].array.spriteArray.length; l++) {
                                    val.followObjectArray[j].enemyProjectileSpawner.attemptSpawn(val.followObjectArray[j].enemy[k].array.spriteArray[l].x, val.followObjectArray[j].enemy[k].array.spriteArray[l].y)
                                }
                            }
                        }
                    }
                }
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
                scene.setBackgroundImage(screen.clone())
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
        ADV_Projectile_Spawner_Updater.startADVProjectileSpawnerUpdater()
        PathFollowerUpdater.startPathFollowerUpdater()
        PathFollowObjectUpdater.startPathFollowObjectUpdater()
    }
}