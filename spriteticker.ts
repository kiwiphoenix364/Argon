// Future project for factory-builder style spacecraft
/*
class SpriteLayout {
    private layoutMatrix: MachineObj[][]
    public id = 0
    public width: number
    public height: number
    constructor(w: number, h: number) {
        this.width = w
        this.height = h
        this.layoutMatrix = []
        for (let i = 0; i < w; i++) {
            this.layoutMatrix.push([])
            for (let j = 0; j < h; j++) {
                this.layoutMatrix[i].push(new EmptyTile())
            }
        }
    }
    add(obj: MachineObj, x: number, y: number) {
        obj.id = this.id++
        this.layoutMatrix[x][y] = obj
    }
    addMult(obj: MachineObj, x: number, y: number, w: number, h: number) {
        obj.id = this.id++
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                this.layoutMatrix[x + i][y + j] = obj
            }
        }
    }
    getOutputLocations(ofObject: MachineObj) {

    }
    // Make function that gets possible locations
    // If finds another another location with same id, run recursion
    // Array is added to when find new locations
}
class MachineObj {
    public objType: string
    public id = -1
    constructor(objType: string) {
        this.objType = objType
    }
}
class EmptyTile extends MachineObj {
    constructor() {
        super("null")
    }
}
class ResourceGenerator extends MachineObj {
    constructor() {
        super("resourcegenerator")
    }
}
class Belt extends MachineObj {
    constructor(objType: number) {
        super("belt")
    }
}
class Factory extends MachineObj {
    constructor(objType: number) {
        super("factory")
    }
}
class Turret extends MachineObj {
    constructor(objType: number) {
        super("turret")
    }
}
let test = new SpriteLayout(5, 5)
let spriteUpdater: control.FrameCallback
spriteUpdater = game.currentScene().eventContext.registerFrameHandler(19, () => {
    test.add(new EmptyTile(), 4, 4)
})

*/
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