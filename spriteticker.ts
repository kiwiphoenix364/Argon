class SpriteLayout {
    public layoutMatrix: Buffer[]
    constructor(w: number, h: number) {
        this.layoutMatrix.fill(Buffer.create(w),0,h)
        for (let x of this.layoutMatrix) {
            x.fill(0,0,w)
        }
    }
}
class Machine {
    constructor(id: number, t: number) {
        
    }
}
let spriteUpdater: control.FrameCallback
spriteUpdater = game.currentScene().eventContext.registerFrameHandler(19, () => {

})


