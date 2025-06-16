let levelData = "{0,0,([10,10,2.356194490192345,40][40,40,2.356194490192345,40][90,100,0,-40]),[66.6541302488668,98.15508250730261,],0,2,1,5}"
function decompString(data: string) {
    let numCounter: number
    let dataType = 0
    let idValue: number
    let timeValue: number
    let pathPointVal: PathPoint
    let pointCache: number[]
    let pathCache: PathPoint[]
    pointCache = []
    pathCache = []
    let disCache: number[]
    disCache = []
    let sValue: number
    let dValue: number
    let cValue: number
    let tValue: number
    for (let i = 0; i < data.length; i++) {
        if (dataType <= 1) {
            //Handle skips
            if (data.charAt(i) == "{" || data.charAt(i) == "," || data.charAt(i) == "(" || data.charAt(i) == ")" || data.charAt(i) == "]") {
                i++
                continue
            } else if (data.charAt(i) == "[" && dataType == 2) {
                //Handle path array
                i++
                while (data.charAt(i) != ")") {
                    if (data.charAt(i) == "[" || data.charAt(i) == ",") {
                        i++
                        continue
                    } else if (data.charAt(i) == "]") {
                        //Handle array to point to pathCache
                        pathCache.push(new PathPoint(pointCache[0], pointCache[1]))
                        pathCache[pathCache.length - 1].curveAngle = pointCache[2]
                        pathCache[pathCache.length - 1].curveDis = pointCache[3]
                        pointCache = []
                    } else {
                        getLastIdx()
                        pointCache.push(parseInt(data.substr(i, numCounter)))
                        i += numCounter
                    }
                }
                dataType++
            } else if (data.charAt(i) == "[" && dataType == 3) {
                //Handle dis array
                i++
                while (data.charAt(i) != "]") {
                    if (data.charAt(i) == ",") {
                        i++
                        continue
                    } else {
                        getLastIdx()
                        disCache.push(parseInt(data.substr(i, numCounter)))
                    }
                }
                dataType++
            } else if (data.charAt(i) == "}" && dataType == 8) {
                pathArray.push(new Path(timeValue, idValue, pathCache, tValue, sValue, cValue, dValue))
                pathArray[pathArray.length - 1].lengthArray = disCache
            } else {
                getLastIdx()
                //Handle number data types
                if (dataType == 0) {
                    idValue = parseInt(data.substr(i, numCounter))
                } else if (dataType == 1) {
                    timeValue = parseInt(data.substr(i, numCounter))
                } else if (dataType == 4) {
                    sValue = parseInt(data.substr(i, numCounter))
                } else if (dataType == 5) {
                    dValue = parseInt(data.substr(i, numCounter))
                } else if (dataType == 6) {
                    cValue = parseInt(data.substr(i, numCounter))
                } else if (dataType == 7) {
                    tValue = parseInt(data.substr(i, numCounter))
                }
                dataType++
                i += numCounter
            }
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