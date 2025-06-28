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


/*
-----------------------
ID SYSTEM
-----------------------

matrix with each tile having an ID
IDs are unique and correspond to machines

ID OBJECT TYPES
- gens - push items to all sides, the origin of items
- paths - can be pushed to from 3 sides and push to 1
- machines - ingredients can be pushed to from all sides and pushes items to all sides
- turrets - pull items from all sides

COMPONENTS OF IDS
- flowrate (potential) - default flow rate
- flowrate (actual) - the amount of items actually pushed
    - adds flowrate (potential) to this value every game tick, to a max of Math.ceil(1 / flowrate) * flowrate
    - when an item is pushed, subtract 1 (assuming rate >1)
- item count (and type) - also has a max amount per type
- (machines) conversion rate (potential) - how many ticks it takes to convert
- (machines) conversion rate (actual) - how many items are converted this tick
    - adds convertrate (potential) to this value every game tick, to a max of Math.ceil(1 / convrate) * convrate
    - every tick that this is >1 do 1 conversion, assuming items available



*/