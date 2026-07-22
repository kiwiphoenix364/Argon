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
    public frameCounter = 0
    public enemyType: number
    public enemyAnimation: number
    public pauseCounter: number
    private updater: control.FrameCallback
    public nextPoint: SimplePoint
    constructor(path: Path) {
        this.enemyType = path.enemyType
        this.enemyAnimation = path.enemyAnimation
        this.speed = path.speed
        this.count = path.count
        this.spacing = path.spacing
        this.followObjectArray = []
        this.path = path
        this.startPathFollow()
    }
    private startPathFollow() {
        this.updater = game.currentScene().eventContext.registerFrameHandler(19, () => {
            if ((this.frameCounter++ - this.path.timeOffset) % this.spacing === 0 && this.frameCounter / this.spacing <= this.count) {
                this.followObjectArray.push(new PathFollowObject(this.path))
                if (this.enemyType < 0) {
                    this.followObjectArray[this.followObjectArray.length - 1].disPixels -= this.followObjectArray[this.followObjectArray.length - 1].extLength
                    this.followObjectArray[this.followObjectArray.length - 1].segmentDisPixels -= this.followObjectArray[this.followObjectArray.length - 1].extLength
                }
                if (this.path.pointArray[0].pauseAtPoint > 0) {
                    if (this.enemyType >= 0) {
                        this.followObjectArray[this.followObjectArray.length - 1].waitTime = this.path.pointArray[0].pauseAtPoint
                    } else {
                        this.followObjectArray[this.followObjectArray.length - 1].segmentLengthPos = -1
                    }
                }
            }
            if (this.frameCounter > this.path.timeOffset) {
                for (let i = 0; i < this.followObjectArray.length; i++) {
                    if (this.followObjectArray[i].segmentDisPixels > this.path.pointArray[this.followObjectArray[i].currentPoint].segmentLengths[this.followObjectArray[i].segmentLengthPos]) {
                        this.followObjectArray[i].segmentDisPixels -= this.path.pointArray[this.followObjectArray[i].currentPoint].segmentLengths[this.followObjectArray[i].segmentLengthPos]
                        this.followObjectArray[i].segmentLengthPos++
                    }
                    // Dis pixels is past the length of the point array
                    // Current point is not the last point or later
                    // Add case to make sure it is not an array at the end - this will be handled separately
                    if (
                    this.followObjectArray[i].disPixels > this.path.pointArray[this.followObjectArray[i].currentPoint].segmentLength && 
                    this.followObjectArray[i].currentPoint < this.path.pointArray.length - 1 && 
                    !(this.enemyType < 0 && this.followObjectArray[i].currentPoint === this.path.pointArray.length - 2)
                    ) {
                        if (this.path.pointArray[this.followObjectArray[i].currentPoint].pauseAtPoint > 0) {
                            this.followObjectArray[i].segmentLengthPos = 0
                            this.followObjectArray[i].disPixels -= this.path.pointArray[this.followObjectArray[i].currentPoint].segmentLength
                            this.followObjectArray[i].currentPoint++
                        } else {
                            this.followObjectArray[i].segmentLengthPos = 0
                            this.followObjectArray[i].segmentDisPixels = 0
                            this.followObjectArray[i].disPixels = 0
                            this.followObjectArray[i].currentPoint++
                            this.followObjectArray[i].waitTime = this.path.pointArray[this.followObjectArray[i].currentPoint].pauseAtPoint
                        }
                    } else if (
                        this.path.pointArray[0].pauseAtPoint > 0 &&
                        this.followObjectArray[i].segmentLengthPos === -1 &&
                        this.followObjectArray[i].currentPoint === 0 && 
                        this.followObjectArray[i].disPixels >= 0 &&
                        this.followObjectArray[i].disPixels - this.speed < 0
                    ) {
                        this.followObjectArray[i].disPixels = 0
                        this.followObjectArray[i].waitTime = this.path.pointArray[0].pauseAtPoint
                        this.followObjectArray[i].segmentLengthPos = 0
                    } else if (
                        this.path.pointArray[this.path.pointArray.length - 1].pauseAtPoint > 0 &&
                        this.enemyType < 0 && 
                        this.followObjectArray[i].currentPoint === this.path.pointArray.length - 2 && 
                        this.followObjectArray[i].disPixels >= this.path.pointArray[this.path.pointArray.length - 2].segmentLength &&
                        this.followObjectArray[i].disPixels - this.speed < this.path.pointArray[this.path.pointArray.length - 2].segmentLength &&
                        this.followObjectArray[i].segmentLengthPos != 0
                    ) {
                        this.followObjectArray[i].disPixels = this.path.pointArray[this.path.pointArray.length - 2].segmentLength
                        this.followObjectArray[i].waitTime = this.path.pointArray[this.path.pointArray.length - 1].pauseAtPoint
                        this.followObjectArray[i].segmentLengthPos = 0
                    }
                    // Main movement update code
                    if (this.enemyType >= 0 || this.followObjectArray[i].disPixels >= 0 && this.followObjectArray[i].disPixels < this.path.pointArray[this.followObjectArray[i].currentPoint].segmentLength) {
                        this.nextPoint = this.path.findPoint(
                            this.followObjectArray[i].currentPoint,
                            Fx8(this.followObjectArray[i].segmentLengthPos / this.path.pointArray[this.followObjectArray[i].currentPoint].segmentLengths.length + (this.followObjectArray[i].segmentDisPixels / this.path.pointArray[this.followObjectArray[i].currentPoint].segmentLengths[this.followObjectArray[i].segmentLengthPos]) / (this.path.pointArray[this.followObjectArray[i].currentPoint].segmentLengths.length))
                        )
                        
                    } else {
                        this.nextPoint = this.path.findPoint(
                                this.followObjectArray[i].currentPoint,
                                Fx8(this.followObjectArray[i].disPixels / this.path.pointArray[this.followObjectArray[i].currentPoint].segmentLength)
                            )
                    }
                    if (this.nextPoint.x - this.followObjectArray[i].x != 0 && this.nextPoint.y - this.followObjectArray[i].y != 0 && this.nextPoint.x - this.followObjectArray[i].x - this.nextPoint.y - this.followObjectArray[i].y != NaN) {
                        this.followObjectArray[i].angle = new SimplePoint(this.nextPoint.x - this.followObjectArray[i].x, this.nextPoint.y - this.followObjectArray[i].y)
                        console.log(this.nextPoint.y - this.followObjectArray[i].y)
                    }
                    this.followObjectArray[i].setPosPoint(
                        this.nextPoint
                    )
                    if (--this.followObjectArray[i].waitTime > 0) {
                        continue
                    }
                    // Add to distance
                    this.followObjectArray[i].disPixels += this.speed
                    this.followObjectArray[i].segmentDisPixels += this.speed
                    // Destroy cases for regular
                    if (
                        this.enemyType >= 0 &&
                        this.followObjectArray[i].currentPoint === this.path.pointArray.length - 1 &&
                        this.followObjectArray[i].segmentDisPixels > 0
                    ) {
                        this.followObjectArray[i].destroy()
                        this.followObjectArray.removeAt(i)
                    } else if (
                        this.enemyType < 0 &&
                        this.followObjectArray[i].currentPoint === this.path.pointArray.length - 2 &&
                        this.followObjectArray[i].disPixels > this.path.pointArray[this.followObjectArray[i].currentPoint].segmentLength + this.followObjectArray[this.followObjectArray.length - 1].extLength
                    ) {
                        this.followObjectArray[i].destroy()
                        this.followObjectArray.removeAt(i)
                    }
                }
                // Destroy array if empty
                if (this.followObjectArray.length === 0) {
                    this.destroy()
                }
            }
        })
    }
    public destroy() {
        game.currentScene().eventContext.unregisterFrameHandler(this.updater)
        for (let obj of this.followObjectArray) {
            obj.destroy()
        }
        this.followObjectArray = this.path = this.speed = this.count = this.spacing = this.updater = this.frameCounter = null
    }

}
class PathFollowObject {
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
    private updater: control.FrameCallback
    public animationFrame = 0
    public extLength = 0
    public waitTime = 0
    public dir = 0
    constructor(path: Path) {
        this.enemyType = path.enemyType
        this.enemyAnimation = path.enemyAnimation
        this.path = path
        this.enemy = []
        this.createEnemies()
        if (this.enemyType < 0) {
            this.extLength = this.enemy[0].array.calcExtLength()
        }
        this.update()
    }
    private createEnemies() {
        //ENEMY AMOUNT PER TYPE IN ORDER
        let enemiesPerAnimation = DataDrivenEnemies.enemiesInAnimation(this.enemyAnimation)
        for (let i = 0; i < enemiesPerAnimation; i++) {
            this.enemy.push(new Enemy(this.enemyType))
        }
    }
    private update() {
        this.updater = game.currentScene().eventContext.registerFrameHandler(20, () => {
            this.animationFrame++
            DataDrivenEnemies.runAnimation(this.enemy, this.enemyAnimation, this.animationFrame, this.x, this.y, this.angle)
        })
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
        game.currentScene().eventContext.unregisterFrameHandler(this.updater)
        for (let e of this.enemy) {
            e.destroy()
        }
        this.x = this.y = this.currentPoint = this.disPixels = this.enemy = this.enemyType = this.segmentLengthPos = this.angle = null
    }
}
class Enemy {
    public enemyType: number
    public sprite: Sprite
    public array: EnemyArray
    constructor(enemyType: number) {
        this.enemyType = enemyType
        //ENEMY SPRITE TYPES
        //TYPES IN THOUSANDS ARE FOR ARRAYS
        if (this.enemyType === -1) {
            this.array = new EnemyArray(this.enemyType)
        } else if (this.enemyType >= 0) {
            this.sprite = sprites.create(DataDrivenEnemies.getEnemy(enemyType), SpriteKind.Player)
            this.sprite.setFlag(SpriteFlag.Ghost, true)
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
        this.enemyType = this.sprite = this.array = null
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
    public arrayType = 1
    public anchorX = 0
    public anchorY = 0
    public img: Image
    public spriteArray: Sprite[]
    public path: Path
    constructor(enemyType: number) {
        //ANCHOR IS BASED ON SPAWN POSITION, PREFERABLY SPAWN ON EDGE OF MAP
        this.setAnchor()
        this.arrayType = Math.abs(enemyType)
        this.spriteArray = []
        //FOR ARRAYTYPE FILL ARRAY HOWEVER YOU WANT AND DEFINE PARAMETERS OTHER THAN THE DEFAULT
        //ARRAY MUST HAVE EQUIVALENT TO xNum * yNum IN QUANTITY
        DataDrivenEnemies.setupEnemyArr(this, this.arrayType)
        if (this.arrayType === 1) {
            for (let i = 0; i < this.xNum * this.yNum; i++) {
                this.spriteArray.push(sprites.create(this.img, SpriteKind.Player))
                this.spriteArray[i].setFlag(SpriteFlag.Ghost, true)
            }
        }
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
        this.anchorX = 0 - ((this.xNum - 1) * this.xSeparate + this.xShift) / 2
        this.anchorY = 0 - ((this.yNum - 1) * this.ySeparate + this.yShift) / 2
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
        this.xNum = this.yNum = this.xSeparate = this.ySeparate = this.xShift = this.yShift = this.x = this.y = this.relX = this.relY = this.arrayType = this.anchorX = this.anchorY = this.spriteArray = null
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
            OffsetY
        ]
    ]
    */
    private static readonly animation: number[][] = [
        // ANIMATION MOVEMENT DATA BELOW
        [0, 0, 0, 0, 0, 0],
        [.25, 0, 10, 0, 0, 0],
        [0, .25, 0, 10, 0, 0],
        [.25, .25, 10, 10, 0, 0, 1]
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
    constructor () {

    }
    static enemiesInAnimation(animation: number) {
        return this.animationEnemyNum[animation]
    }
    static runAnimation(enemy: Enemy[], animation: number, frame: number, x: number, y: number, angle: SimplePoint) {
        this.currentAnimation = this.animationUsedPerEnemy[animation]
        for (let i = 0; i < this.animationEnemyNum[animation]; i++) {
            this.currentAnimationSet = this.animation[this.animationUsedPerEnemy[animation][i]]
            if (this.currentAnimationSet[6]) {
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
    static getEnemy(enemyType: number) {
        //ADD ENEMIES HERE
        switch (enemyType) {
            case 0: {
                return img`
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
            default: {
                return img``
            }
        }
    }
    static setupEnemyArr(arr: EnemyArray, arrType: number) {
        //ADD ENEMY ARRAYS HERE
        switch (arrType) {
            case 1: {
                arr.xNum = 4
                arr.yNum = 4
                arr.xSeparate = 32
                arr.ySeparate = 32
                arr.xShift = 16
                arr.yShift = 0
                arr.x = 0
                arr.y = 0
                arr.relX = 0
                arr.relY = 0
                arr.arrayType = 1
                arr.anchorX = 0
                arr.anchorY = 0
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
            default: {

            }
        }
    }
}