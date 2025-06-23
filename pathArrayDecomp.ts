function decompString(data: string) {
    let numCounter: number
    let dataType = 0
    let timeValue: number
    let idValue: number
    let pathPointVal: PathPoint
    let pointCache: number[]
    let pathCache: PathPoint[]
    pointCache = []
    pathCache = []
    let disCache: number[]
    disCache = []
    let tValue: number
    let aValue: number
    let sValue: number
    let cValue: number
    let dValue: number
    for (let i = 0; i < data.length; i++) {
        //Handle skips
        if (data.charAt(i) == "{" || data.charAt(i) == "," || data.charAt(i) == "(" || data.charAt(i) == ")") {
            continue
        } else if (data.charAt(i) == "[" && dataType == 2) {
            //Handle path array
            i++
            while (data.charAt(i) != ")") {
                if (data.charAt(i) == "]") {
                    //Handle array to point to pathCache
                    pathCache.push(new PathPoint(pointCache[0], pointCache[1]))
                    pathCache[pathCache.length - 1].curveAngle = pointCache[2]
                    pathCache[pathCache.length - 1].curveDis = pointCache[3]
                    pathCache[pathCache.length - 1].delay = pointCache[4]
                    pointCache = []
                } else if (data.charAt(i) != "[" && data.charAt(i) != ",") {
                    getLastIdx()
                    pointCache.push(parseFloat(data.substr(i, numCounter)))
                    i += numCounter
                    continue
                }
                i++
            }
            dataType++
        } 
        /*else if (data.charAt(i) == "[" && dataType == 3) {
            //Handle dis array
            i++
            while (data.charAt(i) != "]") {
                if (data.charAt(i) != ",") {
                    getLastIdx()
                    disCache.push(parseFloat(data.substr(i, numCounter)))
                    i += numCounter
                    continue
                }
                i++
            }
            dataType++
        } */
        else {
            getLastIdx()
            //Handle number data types
            if (dataType == 0) {
                timeValue = parseFloat(data.substr(i, numCounter))
            } else if (dataType == 1) {
                idValue = parseInt(data.substr(i, numCounter))
            } else if (dataType == 3) {
                tValue = parseInt(data.substr(i, numCounter))
            } else if (dataType == 4) {
                aValue = parseInt(data.substr(i, numCounter))
            } else if (dataType == 5) {
                sValue = parseFloat(data.substr(i, numCounter))
            } else if (dataType == 6) {
                cValue = parseInt(data.substr(i, numCounter))
            } else if (dataType == 7) {
                dValue = parseFloat(data.substr(i, numCounter))
            }
            dataType++
            i += numCounter
        }
        if (data.charAt(i) == "}" && dataType == 8) {
            //Push to path array and move on to next
            pathArray.push(new Path(timeValue, idValue, pathCache, tValue, aValue, sValue, cValue, dValue))
            pathCache = []
            dataType = 0
        }
        function getLastIdx() {
            numCounter = 0
            while (data.charAt(i + numCounter) != "," && data.charAt(i + numCounter) != "]" && data.charAt(i + numCounter) != ")" && data.charAt(i + numCounter) != "}") {
                numCounter++
            }
        }
    }
}
//pathArray = decompString(levelData)