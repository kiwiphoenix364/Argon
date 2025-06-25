let levelData = "{0,0,([10,10,2.356194490192345,40,0][40,40,2.356194490192345,40,0][90,100,0,-40,0]),0,3,2,5,20}{1,1,([81.3359375,119.5,1.5759586531581293,50,0][159.5,56.31640625,0.00516232636324343,50,0][81.3359375,56.31640625,0.00516232636324343,50,150][0.5,56.20703125,6.270894341022895,50,0][81.78125,0.7890625,1.5759586531581313,50,0]),1000,0,0.5,2,1000}"
//let levelData = "{0,0,([10,10,2.356194490192345,40][40,40,2.356194490192345,40][90,100,0,-40]),[66.6541302488668,98.15508250730261,],0,2,1,5}"
let pathArray: Path[]
let idCounter: number
let idCache: number
EditLevel(levelData)
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
        time += 1 / 30
        if (idx < pathArray.length && time >= pathArray[idx].time) {
            new PathFollower(pathArray[idx++])
        }
        if (idx >= pathArray.length) {
            // Delete handler
            game.currentScene().eventContext.unregisterFrameHandler(updater)
        }
    })
}
