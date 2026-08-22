class SimplePoint {
    public x: number
    public y: number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}
class PathPoint {
    public x: Fx8
    public y: Fx8
    public curveAngle = 1
    public curveDis = 50
    public segmentLength: number
    public segmentLengths: number[]
    public segmentLengthPos: number
    public pauseAtPoint = 0
    public mxp: Fx8
    public myp: Fx8
    public mxn: Fx8
    public myn: Fx8
    constructor(x: Fx8, y: Fx8) {
        this.x = x
        this.y = y
    }
    public genMX() {
        let mx = Fx8(Math.cos(this.curveAngle) * this.curveDis)
        let my = Fx8(Math.sin(this.curveAngle) * this.curveDis)
        this.mxp = Fx.add(this.x, mx)
        this.myp = Fx.add(this.y, my)
        this.mxn = Fx.sub(this.x, mx)
        this.myn = Fx.sub(this.y, my)
    }
    public renderPoint(image: Image) {
        image.drawCircle(Fx.toFloat(this.x), Fx.toFloat(this.y), 3, 1)
        image.setPixel(Fx.toFloat(this.x), Fx.toFloat(this.y), 1)
    }
    public findDist(sprite: Sprite) {
        return Math.sqrt((Fx.toFloat(this.x) - sprite.x) ** 2 + (Fx.toFloat(this.y) - sprite.y) ** 2)
    }
    public print() {
        return "[" + Fx.toInt(this.x) + "," + Fx.toInt(this.y) + "," + this.curveAngle + "," + this.curveDis + "," + this.pauseAtPoint + "]"
    }
}
class Path {
    public id: number
    public time: number
    public pointArray: PathPoint[]
    public enemyType: number
    public enemyAnimation: number
    public speed: number
    public count: number
    public spacing: number
    public timeOffset: number
    constructor(time: number, id: number, pointArray: PathPoint[], enemyType = 0, enemyAnimation = 0, speed = 2, count = 1, spacing = 5, timeOffset = 0) {
        this.enemyType = enemyType
        this.enemyAnimation = enemyAnimation
        this.speed = speed
        this.count = count
        this.spacing = spacing
        this.time = time
        this.id = id
        this.pointArray = pointArray
        this.fillSegmentLengths()
        this.timeOffset = timeOffset
    }
    public renderPath(image: Image, points = true, lines = true, angles = false, smoothness = 10) {
        //Does all calculations regardless, but options to not display certain parts
        let prevItem: PathPoint
        let currentPos: Fx8
        let pixelX: Fx8
        let pixelY: Fx8
        let modPrevItemX: Fx8
        let modPrevItemY: Fx8
        let modItemX: Fx8
        let modItemY: Fx8
        let midIntX: Fx8
        let midIntY: Fx8
        let pxp: number
        let pyp: number
        /*
        for (let item of this.pointArray) {
            if (prevItem) {
                image.drawLine(item.x, item.y, prevItem.x, prevItem.y, 2)
            }
            item.renderPoint(image)
            prevItem = item
        }
        */
        for (let item of this.pointArray) {
            if (prevItem) {
                for (let i = 0; i <= smoothness; i++) {
                    currentPos = Fx.div(Fx8(i), Fx8(smoothness))
                    //Angles
                    //Proper bezier curve implementation within makecode
                    modPrevItemX = Fx.sub(prevItem.x, Fx8((Math.cos(prevItem.curveAngle)) * prevItem.curveDis))
                    modPrevItemY = Fx.sub(prevItem.y, Fx8((Math.sin(prevItem.curveAngle)) * prevItem.curveDis))
                    modItemX = Fx.add(item.x, Fx.mul(Fx8(Math.cos(item.curveAngle)), Fx8(item.curveDis)))
                    modItemY = Fx.add(item.y, Fx.mul(Fx8(Math.sin(item.curveAngle)), Fx8(item.curveDis)))
                    midIntX = Path.interpolate(currentPos, modPrevItemX, modItemX)
                    midIntY = Path.interpolate(currentPos, modPrevItemY, modItemY)
                    pixelX = Path.interpolate(
                    currentPos, 
                        Path.interpolate(currentPos, prevItem.x, midIntX),
                        Path.interpolate(currentPos, midIntX, item.x)
                    )
                    pixelY = Path.interpolate(
                        currentPos,
                        Path.interpolate(currentPos, prevItem.y, midIntY),
                        Path.interpolate(currentPos, midIntY, item.y)
                    )
                    //Render lines?
                    if (lines) {
                        if (pxp) {
                            image.drawLine(Fx.toInt(pixelX), Fx.toInt(pixelY), Math.round(pxp), Math.round(pyp), 2)
                        }
                        pxp = Fx.toInt(pixelX)
                        pyp = Fx.toInt(pixelY)
                    }
                    //Render angles?
                    if (angles) {
                        image.drawLine(Fx.toInt(prevItem.x), Fx.toInt(prevItem.y), Fx.toInt(modPrevItemX), Fx.toInt(modPrevItemY), 5)
                        image.drawLine(Fx.toInt(item.x), Fx.toInt(item.y), Fx.toInt(modItemX), Fx.toInt(modItemY), 5)
                    }
                }
            }
            //Render points?
            if (points) {
                item.renderPoint(image)
            }
            prevItem = item
        }
    }
    public findPoint(point: number, dist: Fx8) {
        let item1 = this.pointArray[point]
        let item2 = this.pointArray[Math.min(point + 1, this.pointArray.length - 1)]
        /*
        if (item2 === this.pointArray[this.pointArray.length]) {
            return new SimplePoint(item1.x, item1.y)
        }
        */
        let pixelX: Fx8
        let pixelY: Fx8
        let midIntX: Fx8
        let midIntY: Fx8
        //Angles
        //Proper bezier curve implementation within makecode
        /*
        // Implementation for realtime curves - depricated in favor of perf
        let modItem1X: number
        let modItem1Y: number
        let modItem2X: number
        let modItem2Y: number
        modItem1X = item1.x - Math.cos(item1.curveAngle) * item1.curveDis
        modItem1Y = item1.y - Math.sin(item1.curveAngle) * item1.curveDis
        modItem2X = item2.x + Math.cos(item2.curveAngle) * item2.curveDis
        modItem2Y = item2.y + Math.sin(item2.curveAngle) * item2.curveDis
        midIntX = Path.interpolate(dist, modItem1X, modItem1Y)
        midIntY = Path.interpolate(dist, modItem2X, modItem2Y)
        */
        
        midIntX = Path.interpolate(dist, item1.mxn, item2.mxp)
        midIntY = Path.interpolate(dist, item1.myn, item2.myp)
        
        pixelX = Path.interpolate(
            dist,
            Path.interpolate(dist, item1.x, midIntX),
            Path.interpolate(dist, midIntX, item2.x)
        )
        pixelY = Path.interpolate(
            dist,
            Path.interpolate(dist, item1.y, midIntY),
            Path.interpolate(dist, midIntY, item2.y)
        )
        return(new SimplePoint(Fx.toFloat(pixelX), Fx.toFloat(pixelY)))
    }
    public distBetweenIdx(pointIndex: number, precision = 10) {
        let distArray = []
        let distTotal = 0
        for (let i = 0; i < precision; i++) {
            distArray.push(Path.distBetweenSimplePoints(this.findPoint(pointIndex, Fx8(i / precision)), this.findPoint(pointIndex, Fx8((i + 1) / precision))))
            distTotal += distArray[i]
        }
        distArray.push(distTotal)
        return distArray
    }
    public static distBetweenSimplePoints(p1: SimplePoint, p2: SimplePoint) {
        return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
    }
    public static distBetweenPathPoints(p1: PathPoint, p2: PathPoint) {
        return Math.sqrt((Fx.toInt(p2.x) - Fx.toInt(p1.x)) ** 2 + (Fx.toInt(p2.y) - Fx.toInt(p1.y)) ** 2)
    }
    public static interpolate(mid: Fx8, start: Fx8, end: Fx8) {
        return Fx.add(start, Fx.mul(Fx.sub(end, start), mid))
    }
    public static interpolateFloat(mid: number, start: number, end: number) {
        return start + (end - start) * mid
    }
    public static pathArraySortByTime(pathArray: Path[]) {
        let finalArray = []
        for (let i = 0; i < pathArray.length; i++) {
            if (finalArray.length === 0) {
                finalArray[0] = pathArray[0]
                continue
            }
            for (let j = 0; j < finalArray.length; j++) {
                if (pathArray[i].time < finalArray[j].time || pathArray[i].time === pathArray[j].time && pathArray[i].id < finalArray[j].id) {
                    finalArray.insertAt(j, pathArray[i])
                    break
                }
                if (j === finalArray.length - 1) {
                    finalArray.push(pathArray[i])
                    break
                }
            }
        }
        return finalArray
    }
    public checkOverlap(sprite: Sprite, radius: number) {
        for (let i = 0; i < this.pointArray.length; i++) {
            if (Math.sqrt((sprite.x - Fx.toInt(this.pointArray[i].x)) ** 2 + (sprite.y - Fx.toInt(this.pointArray[i].y)) ** 2) <= radius) {
                return i
            }
        }
        return null
    }
    // Could allow for filling one segment but all instances where needed are in ui which is for debug
    // Furthermore should be one-time actions so frametimes overall won't be worse just a few ms more when updating a path point, scales with path size
    public fillSegmentLengths() {
        for (let i = 0; i < this.pointArray.length - 1; i++) {
            this.pointArray[i].segmentLengths = (this.distBetweenIdx(i))
            this.pointArray[i].segmentLength = this.pointArray[i].segmentLengths.pop()
        }
        this.pointArray[this.pointArray.length - 1].segmentLengths = []
    }
    // Compiles levels in 1.0 format
    public print() {
        let string= ""
        string = string.concat("(1.0)")
        string = string.concat("{")
        string = string.concat(this.time + ",")
        string = string.concat(this.id + ",")
        string = string.concat("(")
        for (let i = 0; i < this.pointArray.length; i++) {
            string = string.concat(this.pointArray[i].print())
        }
        string = string.concat("),")
        string = string.concat(this.enemyType + ",")
        string = string.concat(this.enemyAnimation + ",")
        string = string.concat(this.speed + ",")
        string = string.concat(this.count + ",")
        string = string.concat(this.spacing + ",")
        string = string.concat(this.timeOffset + "")
        string = string.concat("}")
        return string
    }
}
class PathFollower {
    public followObjectArray: PathFollowObject[]
    public path: Path
    public speed: number
    public count: number
    public spacing: number
    public timeCounter = Timing.gameTime
    public enemyType: number
    public enemyAnimation: number
    public pauseCounter: number
    public nextPoint: SimplePoint
    public static pathFollowerList: PathFollower[] = []
    constructor(path: Path) {
        this.enemyType = path.enemyType
        this.enemyAnimation = path.enemyAnimation
        this.speed = path.speed
        this.count = path.count
        this.spacing = path.spacing
        this.followObjectArray = []
        this.path = path
        PathFollower.pathFollowerList.push(this)
    }
    public destroy() {
        PathFollower.pathFollowerList.removeElement(this)
        for (let obj of this.followObjectArray) {
            obj.destroy()
        }
        this.followObjectArray = this.path = this.speed = this.count = this.spacing = this.timeCounter = null
    }

}
class PathFollowObject {
    public enemyProjectileSpawner: SimpleEnemyProjectiles
    public path: Path
    public angle: SimplePoint
    public x: number
    public y: number
    public currentPoint = 0
    public disPixels = 0
    public segmentDisPixels = 0
    public segmentLengthPos = 0
    public enemyType: number
    public enemyAnimation: number
    public enemy: Enemy[]
    public animationFrame = 0
    public extLength = 0
    public waitTime = 0
    public dir = 0
    public static pathFollowObjectArray: PathFollowObject[] = []
    constructor(path: Path) {
        this.angle = new SimplePoint(-Math.cos(path.pointArray[0].curveAngle), -Math.sin(path.pointArray[0].curveAngle))
        this.enemyType = path.enemyType
        this.enemyAnimation = path.enemyAnimation
        this.path = path
        this.enemy = []
        this.createEnemies()
        if (this.enemyType < 0) {
            this.extLength = this.enemy[0].array.calcExtLength()
        }
        this.enemyProjectileSpawner = SimpleEnemyProjectiles.spawnEnemyProjectile(this.enemyType)
        PathFollowObject.pathFollowObjectArray.push(this)
    }
    private createEnemies() {
        //ENEMY AMOUNT PER TYPE IN ORDER
        let enemiesPerAnimation = DataDrivenEnemies.enemiesInAnimation(this.enemyAnimation)
        for (let i = 0; i < enemiesPerAnimation; i++) {
            this.enemy.push(new Enemy(this.enemyType))
        }
    }
    public setPosPoint(point: SimplePoint) {
        this.x = point.x
        this.y = point.y
    }
    public setX(point: SimplePoint) {
        this.x = point.x
    }
    public setY(point: SimplePoint) {
        this.y = point.y
    }
    public destroy() {
        for (let e of this.enemy) {
            e.destroy()
        }
        this.enemyProjectileSpawner.destroy()
        this.enemyProjectileSpawner = this.x = this.y = this.currentPoint = this.disPixels = this.enemy = this.enemyType = this.segmentLengthPos = this.angle = null
        PathFollowObject.pathFollowObjectArray.removeElement(this)
    }
}
class Enemy {
    public enemyType: number
    public sprite: EnemyRender
    public array: EnemyArray
    public hitboxSize: number
    public hitboxType: number
    public img: Image
    constructor(enemyType: number) {
        this.enemyType = enemyType
        //ENEMY SPRITE TYPES
        //TYPES IN THOUSANDS ARE FOR ARRAYS
        if (this.enemyType <= -1) {
            this.array = new EnemyArray(this.enemyType)
        } else if (this.enemyType >= 0) {
            DataDrivenEnemies.setupEnemy[enemyType](this)
            this.sprite = new EnemyRender(this.img)
            this.sprite.hitboxSize = this.hitboxSize
            this.sprite.hitboxType = this.hitboxType
            this.img = this.hitboxType = this.hitboxSize = null
        }
    }
    public setPos(x: number, y: number) {
        if (this.sprite != undefined) {
            this.sprite.x = x
            this.sprite.y = y
        } else {
            this.array.setPos(x, y)
        }
    }
    public destroy() {
        if (this.sprite != undefined) {
            this.sprite.destroy()
        } else {
            this.array.destroy()
        }
        this.enemyType = this.sprite = this.array = this.hitboxType = this.hitboxSize = this.img = null
    }
}
class EnemyArray {
    public xNum = 4
    public yNum = 4
    public xSeparate = 32
    public ySeparate = 32
    public xShift = 16
    public yShift = 0
    public x = 0
    public y = 0
    public relX = 0
    public relY = 0
    public anchorX = 0
    public anchorY = 0
    public img: Image
    public spriteArray: EnemyRender[]
    public path: Path
    public hitboxSize: number
    public hitboxType: number
    constructor(enemyType: number) {
        //ANCHOR IS BASED ON SPAWN POSITION, PREFERABLY SPAWN ON EDGE OF MAP
        this.spriteArray = []
        //FOR ARRAYTYPE FILL ARRAY HOWEVER YOU WANT AND DEFINE PARAMETERS OTHER THAN THE DEFAULT
        //ARRAY MUST HAVE EQUIVALENT TO xNum * yNum IN QUANTITY
        DataDrivenEnemies.setupEnemyArr[Math.abs(enemyType + 1)](this)
        this.setAnchor()
        for (let i = 0; i < this.xNum * this.yNum; i++) {
            this.spriteArray.push(new EnemyRender(this.img))
            this.spriteArray[i].hitboxSize = this.hitboxSize
            this.spriteArray[i].hitboxType = this.hitboxType
        }
        this.img = this.hitboxType = this.hitboxSize = null
        this.updatePos()
    }
    public setPos(x: number, y: number) {
        this.x = x
        this.y = y
        this.updatePos()
    }
    public setRelPos(x: number, y: number) {
        this.relX = x
        this.relY = y
        this.updatePos()
    }
    public setAnchor() {
        this.anchorX = (-((this.xNum - 1) * this.xSeparate + this.xShift)) >> 1
        this.anchorY = (-((this.yNum - 1) * this.ySeparate + this.yShift)) >> 1
    }
    public calcExtLength() {
        return Math.sqrt(((this.xNum - 1) * this.xSeparate + Math.abs(this.xShift)) ** 2 + ((this.yNum - 1) * this.ySeparate + Math.abs(this.yShift)) ** 2) / 2;
    }
    public updatePos() {
        for (let i = 0; i < this.xNum; i++) {
            for (let j = 0; j < this.yNum; j++) {
                this.spriteArray[i + j * this.xNum].x = this.x + this.anchorX + (j % 2) * this.xShift + this.relX + this.xSeparate * i
                this.spriteArray[i + j * this.xNum].y = this.y + this.anchorY + (i % 2) * this.yShift + this.relY + this.ySeparate * j
            }
        }
    }
    public destroy() {
        for (let e of this.spriteArray) {
            e.destroy()
        }
        this.hitboxSize = this.hitboxType = this.xNum = this.yNum = this.xSeparate = this.ySeparate = this.xShift = this.yShift = this.x = this.y = this.relX = this.relY = this.anchorX = this.anchorY = this.spriteArray = null
    }
}
class EnemyRender {
    public img: Image
    public x: number = 0
    public y: number = 0
    public hitboxSize: number
    public hitboxType: number
    public static enemy_render_list: EnemyRender[] = []
    constructor(img: Image) {
        this.img = img
        EnemyRender.enemy_render_list.push(this)
    }
    destroy() {
        this.img = this.x = this.y = this.hitboxSize = this.hitboxType = null
        EnemyRender.enemy_render_list.removeElement(this)
    }
}
class DataDrivenEnemies {
    // ALL ENEMIES AND ANIMATION DATA STORED HERE
    public static currentAnimationSet: number[]
    public static currentAnimation: number[]
    public static currentAngle: number
    
    // Enemy count in each type's animation
    private static readonly animationEnemyNum = [
        1,
        1,
        1,
        2,
    ]
    // Animation movement information
    /*
    [
        // ANIMATION 1
        [
            AnimationSpeedMultiplierX,
            AnimationSpeedMultiplierY,
            AnimationMovementMultiplierX,
            AnimationMovementMultiplierY,
            OffsetX,
            OffsetY,
            UseDirectionInfo? (0/1),
        ]
    ]
    */
    private static readonly animation: number[][] = [
        // ANIMATION MOVEMENT DATA BELOW
        [0, 0, 0, 0, 0, 0, 0], // No animation
        [10, 0, 10, 0, 0, 0, 0], // Left/right wave
        [0, 10, 0, 10, 0, 0, 0], // Up/down wave
        [10, 10, 10, 10, 0, 0, 1], // Wave with facing
        [10, 10, 10, 10, 0, 0, 1], // Wave with facing and projectile
    ]
    // Animation used for each enemy
    /*
    [
        [
            AnimationNumForEnemy1,
            AnimationNumForEnemy2
        ]
    ]
    */
    private static readonly animationUsedPerEnemy: number[][] = [
        // ANIMATION EACH ENEMY USES HERE
        [0],
        [1],
        [3],
        [1, 2]
    ]
    // Enemy Setup
    public static readonly setupEnemy: ((enemy: Enemy) => void)[] = [
        (enemy: Enemy) => {
            enemy.img = img`
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            `,
            enemy.hitboxSize = 5
            enemy.hitboxType = 0
        },
    ]
    // Enemy Array Setup
    public static readonly setupEnemyArr: ((arr: EnemyArray) => void)[] = [
        (arr: EnemyArray) => {
            arr.xNum = 1
            arr.yNum = 2
            arr.xSeparate = 32
            arr.ySeparate = 32
            arr.xShift = 16
            arr.yShift = 0
            arr.x = 0
            arr.y = 0
            arr.relX = 0
            arr.relY = 0
            arr.anchorX = 0
            arr.anchorY = 0
            arr.hitboxSize = 5
            arr.hitboxType = 0
            arr.img = img`
                    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
                `
        }
    ]
    constructor () {

    }
    static enemiesInAnimation(animation: number) {
        return this.animationEnemyNum[animation]
    }
    static runAnimation(enemy: Enemy[], animation: number, frame: number, x: number, y: number, angle: SimplePoint) {
        this.currentAnimation = this.animationUsedPerEnemy[animation]
        for (let i = 0; i < this.animationEnemyNum[animation]; i++) {
            this.currentAnimationSet = this.animation[this.animationUsedPerEnemy[animation][i]]
            if (this.currentAnimationSet[6] === 1) {
                this.currentAngle = Math.atan2(angle.y, angle.x)
                enemy[i].setPos(
                    x + Math.sin(frame * this.currentAnimationSet[0] + this.currentAnimationSet[4]) * Math.cos(this.currentAngle + 1.57) * this.currentAnimationSet[2],
                    y + Math.sin(frame * this.currentAnimationSet[1] + this.currentAnimationSet[5]) * Math.sin(this.currentAngle + 1.57) * this.currentAnimationSet[3]
                )
            } else  {
                enemy[i].setPos(
                    x + Math.cos(frame * this.currentAnimationSet[0] + this.currentAnimationSet[4]) * this.currentAnimationSet[2],
                    y + Math.sin(frame * this.currentAnimationSet[1] + this.currentAnimationSet[5]) * this.currentAnimationSet[3]
                )
            }
        }
    }
}
// Updates with sprite position animations; enemy type index is same as projectile
class SimpleEnemyProjectiles {
    public nextShot: number
    public spawnList: number[]
    public currentIdx: number = 1
    // Add projectiles fired by sprites here
    public static readonly enemyProjectileSpawnList: number[][] = [
        // startDelay, projectileIDX, delay, projectileIDX, delay, etc...
        // Begins enemy idx 0
        // Put -1 in projectileIDX to disable
        [0, 0, 2000]
    ]
    public static readonly enemyArrayProjectileSpawnList: number[][] = [
        // startDelay, projectileIDX, delay, projectileIDX, delay, etc...
        // Begins enemy (array) idx -1 going backwards
        // Put -1 in projectileIDX to disable
        [0, 0, 2000]
    ]
    constructor(spawnList: number[]) {
        this.nextShot = Timing.gameTime + spawnList[0]
        this.spawnList = spawnList
    }
    public static spawnEnemyProjectile(enemyType: number) {
        if (enemyType >= 0) {
            return new SimpleEnemyProjectiles(SimpleEnemyProjectiles.enemyProjectileSpawnList[enemyType])
        } else {
            return new SimpleEnemyProjectiles(SimpleEnemyProjectiles.enemyArrayProjectileSpawnList[Math.abs(enemyType + 1)])
        }
    }
    public attemptSpawn(val: PathFollowObject) {
        if (this.spawnList[this.currentIdx] >= 0 && Timing.gameTime >= this.nextShot) {
            this.nextShot += this.currentIdx + 1 - this.spawnList.length < 0 ? this.spawnList[this.currentIdx + 1] : 0
            for (let k = 0; k < val.enemy.length; k++) {
                if (val.enemyType >= 0) {
                    // REG ENEMY
                    ProjectileList.projectile[this.spawnList[this.currentIdx]](val.enemy[k].sprite.x, val.enemy[k].sprite.y)
                } else {
                    // ARRAY
                    for (let l = 0; l < val.enemy[k].array.spriteArray.length; l++) {
                        ProjectileList.projectile[this.spawnList[this.currentIdx]](val.enemy[k].array.spriteArray[l].x, val.enemy[k].array.spriteArray[l].y)
                    }
                }
            }
            this.currentIdx = (this.currentIdx + 2) % this.spawnList.length != 0 ? (this.currentIdx + 2) % this.spawnList.length : 1
        }
    }
    public destroy() {
        this.nextShot = this.spawnList = null
    }
}
class ProjectileList {
    // Add projectiles here
    public static readonly projectile: ((x: number, y: number) => void)[] = [
        (x: number, y: number) => {
            let test2: ADV_Projectile_Spawner
            let test3: ADV_Projectile_Spawner
            test2 = new ADV_Projectile_Spawner(() => {
                test2.multi_spawner_line_timed(
                () => {
                    test3 = new ADV_Projectile_Spawner(() => {
                        test3.multi_spawner_cones_timed(img`
                            . . . . . .
                            . . . . . .
                            3 3 3 3 3 3
                            3 3 3 3 3 3
                            . . . . . .
                            . . . . . .
                        `, true, 1000, 3, 0, test2.tempX, test2.tempY, 0, Math.PI * 2, 100, 0, 0, 1, 0.2, 1)
                    }, 200, 10)
                }, img`
    . . . . . . . e e e e . . . . .
    . . . . . e e 4 5 5 5 e e . . .
    . . . . e 4 5 6 2 2 7 6 6 e . .
    . . . e 5 6 6 7 2 2 6 4 4 4 e .
    . . e 5 2 2 7 6 6 4 5 5 5 5 4 .
    . e 5 6 2 2 8 8 5 5 5 5 5 4 5 4
    . e 5 6 7 7 8 5 4 5 4 5 5 5 5 4
    e 4 5 8 6 6 5 5 5 5 5 5 4 5 5 4
    e 5 c e 8 5 5 5 4 5 5 5 5 5 5 4
    e 5 c c e 5 4 5 5 5 4 5 5 5 e .
    e 5 c c 5 5 5 5 5 5 5 5 4 e . .
    e 5 e c 5 4 5 4 5 5 5 e e . . .
    e 5 e e 5 5 5 5 5 4 e . . . . .
    4 5 4 e 5 5 5 5 e e . . . . . .
    . 4 5 4 5 5 4 e . . . . . . . .
    . . 4 4 e e e . . . . . . . . .
                `, true, 2100, 5, 0, x, x + 10, y, y + 10)
            }, 1000, 2)
        },
        (x: number, y: number) => {

        }
    ]
    constructor() {
    }
}