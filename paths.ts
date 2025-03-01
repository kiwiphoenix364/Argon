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
    constructor(time: number, id: number, pointArray: PathPoint[]) {
        this.time = time
        this.id = id
        this.pointArray = pointArray
    }
    public renderPath(image: Image, points = true, lines = true, angles = false) {
        //Does all calculations regardless, but options to not display certain parts
        let prevItem: PathPoint
        let dist: number
        let currentPos: number
        let pixelX: number
        let pixelY: number
        let modPrevItemX: number
        let modPrevItemY: number
        let modItemX: number
        let modItemY: number
        let midIntX: number
        let midIntY: number
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
                dist = Math.sqrt((item.x - prevItem.x) ** 2 + (item.y - prevItem.y) ** 2)
                for (let i = 0; i <= dist; i++) {
                    currentPos = i / (dist)
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
                        image.setPixel(Math.round(pixelX), Math.round(pixelY), 2)
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
        //Does all calculations regardless, but options to not display certain parts
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
    public findDistBetweenPoints(firstPointIndex: number) {
        
    }
}