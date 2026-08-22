class Level {
    public static readonly levelData = "(1.0){0,0,([10,10,2.356194490192345,40,0][40,40,2.356194490192345,40,0][126,56,1,50,0][90,100,0,-40,0][91,31,1,50,0][29,81,1,50,0][10,11,1,50,0]),0,2,100,500,10000,0}{30,1,([81,120,1.5759586531581293,50,0][160,56,0.00516232636324343,50,0][81,56,0.00516232636324343,50,150][1,56,6.270894341022895,50,0][82,1,1.5759586531581313,50,0]),-1,3,50,2,1000,0}"
    constructor() {

    }
    public static startGame() {
        if (lvlEdit) {
            Level.EditLevel(Level.levelData)
        } else {
            openingMenu()
            Level.RunLevel(Level.levelData)
        }
    }
    public static EditLevel(levelData: string) {
        game.pushScene()
        GameUtils.setupGame()
        pathArray = []
        decompString(levelData)
        idCache = 0
        editMode()
    }
    public static RunLevel(levelData: string) {
        game.pushScene()
        GameUtils.setupGame()
        pathArray = []
        decompString(levelData)
        idCache = 0
        let idx = 0
        let updater: control.FrameCallback
        updater = game.currentScene().eventContext.registerFrameHandler(5, () => {
            if (idx < pathArray.length && Timing.gameTime / 1000 >= pathArray[idx].time) {
                new PathFollower(pathArray[idx++])
            }
            if (idx >= pathArray.length) {
                // Delete handler
                game.currentScene().eventContext.unregisterFrameHandler(updater)
            }
        })
    }
}