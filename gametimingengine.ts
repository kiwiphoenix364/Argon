let levelData = "{0,0,([10,10,2.356194490192345,40,0][40,40,2.356194490192345,40,0][125.83203125,55.87109375,1,50,0][90,100,0,-40,0][91.30859375,31.390625,1,50,0][29.35546875,80.6328125,1,50,0][10.29296875,10.73828125,1,50,0]),0,2,2,500,100}{30,1,([81.3359375,119.5,1.5759586531581293,50,0][159.5,56.31640625,0.00516232636324343,50,0][81.3359375,56.31640625,0.00516232636324343,50,150][0.5,56.20703125,6.270894341022895,50,0][81.78125,0.7890625,1.5759586531581313,50,0]),1000,3,0.5,2,1000}"
//let levelData = "{0,0,([10,10,2.356194490192345,40][40,40,2.356194490192345,40][90,100,0,-40]),[66.6541302488668,98.15508250730261,],0,2,1,5}"
let pathArray: Path[]
let idCounter: number
let idCache: number
let debug = 1
if (debug) {
    EditLevel(levelData)
} else {
    RunLevel(levelData)
}
function EditLevel(levelData: string) {
    pathArray = []
    decompString(levelData)
    idCounter = pathArray.length - 1
    idCache = 0
    console.log("loaded")
    editMode()
}
function RunLevel(levelData: string) {
    pathArray = []
    decompString(levelData)
    idCounter = pathArray.length - 1
    idCache = 0
    console.log("loaded")
    let time = 0
    let idx = 0
    let updater: control.FrameCallback
    updater = game.currentScene().eventContext.registerFrameHandler(18, () => {
        time += 1 / 50
        if (idx < pathArray.length && time >= pathArray[idx].time) {
            new PathFollower(pathArray[idx++])
        }
        if (idx >= pathArray.length) {
            // Delete handler
            game.currentScene().eventContext.unregisterFrameHandler(updater)
        }
    })
}
