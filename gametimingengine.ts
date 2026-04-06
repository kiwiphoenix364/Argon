let levelData = "(1.0){0,0,([10,10,2.356194490192345,40,0][40,40,2.356194490192345,40,0][126,56,1,50,0][90,100,0,-40,0][91,31,1,50,0][29,81,1,50,0][10,11,1,50,0]),0,2,2,500,100,0}{30,1,([81,120,1.5759586531581293,50,0][160,56,0.00516232636324343,50,0][81,56,0.00516232636324343,50,150][1,56,6.270894341022895,50,0][82,1,1.5759586531581313,50,0]),1000,3,0.5,2,1000,0}"
//let levelData = "{0,0,([10,10,2.356194490192345,40][40,40,2.356194490192345,40][90,100,0,-40]),[66.6541302488668,98.15508250730261,],0,2,1,5}"
let pathArray: Path[]
let idCounter: number
let idCache: number
let debug = false
if (debug) {
    EditLevel(levelData)
} else {
    openingMenu()
    // RunLevel(levelData)
}
function EditLevel(levelData: string) {
    game.pushScene()
    pathArray = []
    decompString(levelData)
    idCounter = pathArray.length - 1
    idCache = 0
    console.log("loaded")
    editMode()
}
function RunLevel(levelData: string) {
    game.pushScene()
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
