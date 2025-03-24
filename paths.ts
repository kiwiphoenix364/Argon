class SimplePoint {
    public x: number
    public y: number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}
class PathPoint {
    public connectedPoint: PathPoint
    public x: number
    public y: number
    public curveAngle = 1
    public curveDis = 50
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
    public renderPoint(image: Image) {
        image.drawCircle(this.x, this.y, 3, 1)
        image.setPixel(this.x, this.y, 1)
    }
    public findDist(sprite: Sprite) {
        return Math.sqrt((this.x - sprite.x) ** 2 + (this.y - sprite.y) ** 2)
    }
}
class Path {
    public id: number
    public time: number
    public pointArray: PathPoint[]
    public lengthArray: number[]
    public enemyType: number
    public enemyPattern: number
    public speed: number
    public count: number
    public spacing: number
    constructor(time: number, id: number, pointArray: PathPoint[], enemyType = 0, enemyPattern = 0, speed = 2, count = 1, spacing = 5) {
        this.enemyType = enemyType
        this.enemyPattern = enemyPattern
        this.speed = speed
        this.count = count
        this.spacing = spacing
        this.time = time
        this.id = id
        this.pointArray = pointArray
        this.fillSegmentLengths()
    }
    public renderPath(image: Image, points = true, lines = true, angles = false, smoothness = 10) {
        //Does all calculations regardless, but options to not display certain parts
        let prevItem: PathPoint
        let currentPos: number
        let pixelX: number
        let pixelY: number
        let modPrevItemX: number
        let modPrevItemY: number
        let modItemX: number
        let modItemY: number
        let midIntX: number
        let midIntY: number
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
                    currentPos = i / (smoothness)
                    //Angles
                    //Proper bezier curve implementation within makecode
                    modPrevItemX = prevItem.x - Math.cos(prevItem.curveAngle) * prevItem.curveDis
                    modPrevItemY = prevItem.y - Math.sin(prevItem.curveAngle) * prevItem.curveDis
                    modItemX = item.x + Math.cos(item.curveAngle) * item.curveDis
                    modItemY = item.y + Math.sin(item.curveAngle) * item.curveDis
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
                            image.drawLine(Math.round(pixelX), Math.round(pixelY), Math.round(pxp), Math.round(pyp), 2)
                        }
                        pxp = Math.round(pixelX)
                        pyp = Math.round(pixelY)
                    }
                    //Render angles?
                    if (angles) {
                        image.drawLine(prevItem.x, prevItem.y, modPrevItemX, modPrevItemY, 5)
                        image.drawLine(item.x, item.y, modItemX, modItemY, 5)
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
    public findPoint(point: number, dist: number) {
        let item1 = this.pointArray[point]
        let item2 = this.pointArray[point + 1]
        let pixelX: number
        let pixelY: number
        let modItem1X: number
        let modItem1Y: number
        let modItem2X: number
        let modItem2Y: number
        let midIntX: number
        let midIntY: number
        //Angles
        //Proper bezier curve implementation within makecode
        modItem1X = item1.x - Math.cos(item1.curveAngle) * item1.curveDis
        modItem1Y = item1.y - Math.sin(item1.curveAngle) * item1.curveDis
        modItem2X = item2.x + Math.cos(item2.curveAngle) * item2.curveDis
        modItem2Y = item2.y + Math.sin(item2.curveAngle) * item2.curveDis
        midIntX = Path.interpolate(dist, modItem1X, modItem2X)
        midIntY = Path.interpolate(dist, modItem1Y, modItem2Y)
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
        return(new SimplePoint(pixelX, pixelY))
    }
    public distBetweenIdx(pointIndex: number, precision = 10) {
        let totalDist = 0
        for (let i = 0; i < precision; i++) {
            totalDist += Path.distBetweenSimplePoints(this.findPoint(pointIndex, i / precision), this.findPoint(pointIndex, (i + 1) / precision))
        }
        return totalDist
    }
    public static distBetweenSimplePoints(p1: SimplePoint, p2: SimplePoint) {
        return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
    }
    public static distBetweenPathPoints(p1: PathPoint, p2: PathPoint) {
        return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
    }
    public static interpolate(mid: number, start: number, end: number) {
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
            if (Math.sqrt((sprite.x - this.pointArray[i].x) ** 2 + (sprite.y - this.pointArray[i].y) ** 2) <= radius) {
                return i
            }
        }
        return null
    }
    public fillSegmentLengths() {
        this.lengthArray = []
        for (let i = 0; i < this.pointArray.length - 1; i++) {
            this.lengthArray.push(this.distBetweenIdx(i))
        }
    }
}
class PathFollower {
    public followObjectArray: PathFollowObject[]
    public path: Path
    public speed: number
    public count: number
    public spacing: number
    public segmentLengths: number[]
    public frameCounter = 0
    public enemyType: number
    public enemyPattern: number
    private updater: control.FrameCallback
    constructor(path: Path) {
        this.enemyType = path.enemyType
        this.enemyPattern = path.enemyPattern
        this.speed = path.speed
        this.count = path.count
        this.spacing = path.spacing
        this.followObjectArray = []
        this.path = path
        this.startPathFollow()
    }
    private startPathFollow() {
        this.updater = game.currentScene().eventContext.registerFrameHandler(18, () => {
            if (this.frameCounter++ % this.spacing === 0 && this.frameCounter / this.spacing <= this.count) {
                this.followObjectArray.push(new PathFollowObject(this.enemyType, this.enemyPattern))
            }
            for (let i = 0; i < this.followObjectArray.length; i++) {
                if (this.followObjectArray[i].currentPoint < this.path.pointArray.length - 1) {
                    this.followObjectArray[i].disPixels += this.speed
                    if (this.followObjectArray[i].disPixels > this.path.lengthArray[this.followObjectArray[i].currentPoint] && this.followObjectArray[i].currentPoint < this.path.pointArray.length - 2) {
                        this.followObjectArray[i].disPixels = this.followObjectArray[i].disPixels - this.path.lengthArray[this.followObjectArray[i].currentPoint]
                        this.followObjectArray[i].currentPoint++
                    }
                    this.followObjectArray[i].setPosPoint(this.path.findPoint(this.followObjectArray[i].currentPoint, this.followObjectArray[i].disPixels / this.path.lengthArray[this.followObjectArray[i].currentPoint]))
                    if (this.followObjectArray[i].disPixels > this.path.lengthArray[this.followObjectArray[i].currentPoint] + this.speed && this.followObjectArray[i].currentPoint === this.path.pointArray.length - 2) {
                        this.followObjectArray[i].destroy()
                        this.followObjectArray.removeAt(i)
                    }
                } else {
                    this.followObjectArray[i].destroy()
                    this.followObjectArray.removeAt(i)
                }
            }
            if (this.followObjectArray.length === 0) {
                this.destroy()
            }
        })
    }
    public destroy() {
        game.currentScene().eventContext.unregisterFrameHandler(this.updater)
        for (let obj of this.followObjectArray) {
            obj.destroy()
        }
        this.followObjectArray = this.path = this.speed = this.count = this.spacing = this.segmentLengths = this.updater = this.frameCounter = null
    }

}
class PathFollowObject {
    private x: number
    private y: number
    public currentPoint = 0
    public disPixels = 0
    public enemyType: number
    public enemyPattern: number
    public enemy: Enemy[]
    private updater: control.FrameCallback
    public animationFrame = 0
    constructor(enemyType = 0, enemyPattern = 0) {
        this.enemyType = enemyType
        this.enemyPattern = enemyPattern
        this.enemy = []
        this.createEnemies()
        this.update()
    }
    private createEnemies() {
        if (this.enemyPattern === 0) {
            this.enemy.push(new Enemy(this.enemyType))
        }
    }
    private update() {
        this.updater = game.currentScene().eventContext.registerFrameHandler(18, () => {
            this.animationFrame++
            this.runAnimation()
        })
    }
    private runAnimation() {
        if (this.enemyPattern === 0) {
            this.enemy[0].sprite.x = this.x
            this.enemy[0].sprite.y = this.y
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
        game.currentScene().eventContext.unregisterFrameHandler(this.updater)
        for (let e of this.enemy) {
            e.destroy()
        }
        this.x = this.y = this.currentPoint = this.disPixels = this.enemy = this.enemyType = this.enemyPattern = null
    }
}
class Enemy {
    public enemyType: number
    public sprite: Sprite
    constructor(enemyType = 0) {
        this.enemyType = enemyType
        if (enemyType === 0) {
            this.sprite = sprites.create(img`
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
            `, SpriteKind.Player)
        } 
    }
    public destroy() {
        this.sprite.destroy()
        this.enemyType = this.sprite = null
    }
}