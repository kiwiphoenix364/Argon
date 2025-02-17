class PathPoint {
    public connectedPoint: PathPoint
    public x: number
    public y: number
    public id: number
    public curveAngle = 1
    public curveDis = 50
    constructor(x: number, y: number, id: number) {
        this.x = x
        this.y = y
        this.id = id
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
    public pointCounter = 0
    public pointArray: PathPoint[]
    constructor(time: number, id: number, pointArray: PathPoint[]) {
        this.time = time
        this.id = id
        this.pointArray = pointArray
    }
    public renderPath(image: Image) {
        let prevItem: PathPoint
        let dist: number
        let px: number
        let py: number
        let intpx: number
        let intpy: number
        let px2: number
        let py2: number
        let intpx2: number
        let intpy2: number
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
                for (let i = 0; i < dist; i++) {
                    px = Path.disCos(prevItem)
                    py = Path.disSin(prevItem)
                    intpx = ((prevItem.x - px) / dist) * i + prevItem.x
                    intpy = ((prevItem.x - px) / dist) * i + prevItem.y
                    px2 = Path.disCos(item)
                    py2 = Path.disSin(item)
                    intpx2 = ((item.x - px) / dist) * i + item.x
                    intpy2 = ((item.x - px) / dist) * i + item.y
                    image.setPixel(((intpx - intpx2) / dist) * i, ((intpy - intpy2) / dist) * i, 2)
                }
                console.log(Path.disCos(prevItem))
            }
            item.renderPoint(image)
            prevItem = item
        }
    }
    public static disCos(item: PathPoint) {
        let mag = item.curveDis
        let angle = item.curveAngle
        let returnValue = ((mag * Math.cos(angle)))
        if (returnValue === null) {
            return 0
        }
        return returnValue
    }
    public static disSin(item: PathPoint) {
        let mag = item.curveDis
        let angle = item.curveAngle
        let returnValue = ((mag * Math.sin(angle)))
        if (returnValue === null) {
            return 0
        }
        return returnValue
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
}