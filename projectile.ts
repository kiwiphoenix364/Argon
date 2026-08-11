class Adv_Projectile {
    public sprite: Sprite
    public x: number
    public y: number
    public vX: number
    public vY: number
    public aX: number
    public aY: number
    public life: number
    constructor(spriteImg: Image, destroyOutOfScreen: boolean, life: number, sPosX: number, sPosY: number, angleVelocity: number, vSpeed: number, angleAcceleration: number, aSpeed: number) {
        this.sprite = sprites.create(spriteImg)
        this.x = sPosX
        this.y = sPosY
        this.vX = Math.cos(angleVelocity) * vSpeed
        this.vY = Math.sin(angleVelocity) * vSpeed
        this.aX = Math.cos(angleAcceleration) * aSpeed
        this.aY = Math.sin(angleAcceleration) * aSpeed
        this.sprite.x = this.x
        this.sprite.y = this.y
        this.sprite.vx = this.vX
        this.sprite.vy = this.vY
        this.sprite.ax = this.aX
        this.sprite.ay = this.aY
        this.sprite.setFlag(SpriteFlag.AutoDestroy, destroyOutOfScreen)
        this.sprite.lifespan = life
        this.life = life
        this.destroy()
    }
    destroy() {
        control.runInBackground(() => {
            pause(this.life)
            this.sprite = this.x = this.y = this.vX = this.vY = this.aX = this.aY = this.life = null
        })
    }
}
class Multi_Proj_POS {
    public spriteImg: Image
    public x: number
    public y: number
    public vA: number
    public vS: number
    public aA: number
    public aS: number
    public projs: number
    public ePosX: number
    public ePosY: number
    public volleys: number
    public perVolley: number
    public delay: number
    public destrOutOfScreen: boolean
    public life: number
    constructor(spriteImg: Image, destroyOutOfScreen: boolean, life: number, volleys: number, perVolley: number, delay: number, sPosX: number, sPosY: number, ePosX: number, ePosY: number, angleVelocity: number, vSpeed: number, angleAcceleration: number, aSpeed: number) {
        this.spriteImg = spriteImg
        this.x = sPosX
        this.y = sPosY
        this.vA = angleVelocity
        this.vS = vSpeed
        this.aA = angleAcceleration
        this.aS = aSpeed
        this.ePosX = ePosX
        this.ePosY = ePosY
        this.volleys = volleys
        this.perVolley = perVolley
        this.delay = delay
        this.destrOutOfScreen = destroyOutOfScreen
        this.life = life
        this.spawnProjectiles()
    }
    public spawnProjectiles() {
        for (let i = 0; i < this.volleys; i++) {
            for (let j = 0; j < this.perVolley; j++) {
                let ratio = j / (this.perVolley - 1)
                new Adv_Projectile(this.spriteImg, this.destrOutOfScreen, this.life, Path.interpolateFloat(ratio, this.x, this.ePosX), Path.interpolateFloat(ratio, this.x, this.ePosX), this.vA, this.vS, this.aA, this.aS)
            }

            pause(this.delay)
        } 
        this.destroy()
    }
    destroy() {
        control.runInBackground(() => {
            pause(this.life)
            this.spriteImg = this.x = this.y = this.vA = this.vS = this.aA = this.aS = this.life = this.projs =  this.ePosX = this.ePosY = this.volleys = this.perVolley = this.delay = this.destrOutOfScreen = this.life = null
        })
    }
}
class Multi_Proj_VEL {
    public spriteImg: Image
    public x: number
    public y: number
    public vA: number
    public vS: number
    public aA: number
    public aS: number
    public projs: number
    public eVA: number
    public volleys: number
    public perVolley: number
    public delay: number
    public destrOutOfScreen: boolean
    public life: number
    public angleChange: number
    public angleOverflow: number
    constructor(spriteImg: Image, destroyOutOfScreen: boolean, life: number, volleys: number, perVolley: number, delay: number, sPosX: number, sPosY: number, angleVelocity: number, eAngleVelocity: number, vSpeed: number, angleAcceleration: number, aSpeed: number, angleChange = 0, angleOverflow = 0) {
        this.spriteImg = spriteImg
        this.x = sPosX
        this.y = sPosY
        this.vA = angleVelocity
        this.vS = vSpeed
        this.aA = angleAcceleration
        this.aS = aSpeed
        this.eVA = eAngleVelocity
        this.angleChange = angleChange
        this.angleOverflow = angleOverflow
        this.volleys = volleys
        this.perVolley = perVolley
        this.delay = delay
        this.destrOutOfScreen = destroyOutOfScreen
        this.life = life
        this.spawnProjectiles()
    }
    public spawnProjectiles() {
        control.runInBackground(() => {
            let currentAngle = 0
            let actualAngleChange = (this.angleChange * (this.eVA - this.vA)) / this.perVolley
            let actualAngleOverflow = (this.angleOverflow * (this.eVA - this.vA)) / this.perVolley
            for (let i = 0; i < this.volleys; i++) {
                for (let j = 0; j < this.perVolley; j++) {
                    new Adv_Projectile(this.spriteImg, this.destrOutOfScreen, this.life, this.x, this.y, Path.interpolateFloat(j / (this.perVolley - 1), this.vA, this.eVA) + currentAngle, this.vS, this.aA, this.aS)
                }
                currentAngle = actualAngleOverflow != 0 ? (currentAngle + actualAngleChange) % actualAngleOverflow : 0
                pause(this.delay)
            }
            this.destroy()
        })
    }
    destroy() {
        control.runInBackground(() => {
            pause(this.life)
            this.spriteImg = this.x = this.y = this.vA = this.vS = this.aA = this.aS = this.life = this.projs = this.eVA = this.volleys = this.perVolley = this.delay = this.destrOutOfScreen = this.life = null
        })
    }
}
class Multi_Proj_BOTH {
    public spriteImg: Image
    public x: number
    public y: number
    public vA: number
    public vS: number
    public aA: number
    public aS: number
    public projs: number
    public eVA: number
    public volleys: number
    public perVolley: number
    public delay: number
    public destrOutOfScreen: boolean
    public life: number
    public x2: number
    public y2: number
    public bigProjs: number
    public bigDelay: number
    public bigSpriteImg: Image
    public angleChange: number
    public angleOverflow: number
    constructor(spriteImg: Image, bigSpriteImg: Image, destroyOutOfScreen: boolean, life: number, bigProjs: number, volleys: number, perVolley: number, delay: number, bigDelay: number, sPosX: number, sPosY: number, ePosX: number, ePosY: number, angleVelocity: number, eAngleVelocity: number, vSpeed: number, angleAcceleration: number, aSpeed: number, angleChange = 0, angleOverflow = 0) {
        this.spriteImg = spriteImg
        this.x = sPosX
        this.y = sPosY
        this.x2 = ePosX
        this.y2 = ePosY
        this.vA = angleVelocity
        this.vS = vSpeed
        this.aA = angleAcceleration
        this.aS = aSpeed
        this.eVA = eAngleVelocity
        this.volleys = volleys
        this.perVolley = perVolley
        this.delay = delay
        this.destrOutOfScreen = destroyOutOfScreen
        this.life = life
        this.bigProjs = bigProjs
        this.bigSpriteImg = bigSpriteImg
        this.bigDelay = bigDelay
        this.angleChange = angleChange
        this.angleOverflow = angleOverflow
        this.spawnProjectiles()
    }
    public spawnProjectiles() {
        control.runInBackground(() => {
            for (let i = 0; i < this.bigProjs; i++) {
                let ratio = i / (this.bigProjs - 1)
                new Multi_Proj_VEL(this.spriteImg, this.destrOutOfScreen, this.life, this.volleys, this.perVolley, this.delay, Path.interpolateFloat(ratio, this.x, this.x2), Path.interpolateFloat(ratio, this.y, this.y2), this.vA, this.eVA, this.vS, this.aA, this.aS, this.angleChange, this.angleOverflow)
                new Adv_Projectile(this.bigSpriteImg, true, this.life, Path.interpolateFloat(ratio, this.x, this.x2), Path.interpolateFloat(ratio, this.y, this.y2), 0, 0, 0, 0)
                pause(this.bigDelay)
            }
            this.destroy()
        })
    }
    destroy() {
        control.runInBackground(() => {
            pause(this.life)
            this.spriteImg = this.bigDelay = this.angleChange = this.angleOverflow = this.x = this.y = this.vA = this.vS = this.aA = this.aS = this.life = this.projs = this.eVA = this.volleys = this.perVolley = this.delay = this.destrOutOfScreen = this.life = this.x2 = this.y2 = this.bigProjs = null
        })
    }
}
class DataDrivenProjectiles {
    // Img number, pattern
    public static readonly enemyProjStats: number[][] = [
        [
            0, 0
        ]
    ]
    // destr? (1/0), life, volleys, perVolley, delay, sAngle, eAngle, speed, accelerationAngle, accelerationSpeed, angleOffset, angleOverflow
    public static readonly projPattern: number[][] = [
        [
            1, 5000, 5, 5, 200, 0, 3.14, 100, 0, 0, 0, 0
        ],
        [
            1, 5000, 5, 5, 200, 0, 3.14, 100, 0, 0, 0.5, 1
        ]
    ]
    public static readonly enemyProjImgs: Image[] = [
        img`
            . . 8 8 . .
            . . 8 8 . .
            . . 8 8 . .
            . . 8 8 . .
            . . 8 8 . .
            . . 8 8 . .
        `
    ]
    constructor() {

    }
    static spawnProjAtEnemyPos(enemy: Enemy, proj: number, useAngle: boolean) {
        if (!useAngle)
        new Multi_Proj_VEL(DataDrivenProjectiles.enemyProjImgs[DataDrivenProjectiles.enemyProjStats[proj][0]], DataDrivenProjectiles.projPattern[DataDrivenProjectiles.enemyProjStats[proj][1]][0] === 0 ? false : true, DataDrivenProjectiles.projPattern[DataDrivenProjectiles.enemyProjStats[proj][1]][1], DataDrivenProjectiles.projPattern[DataDrivenProjectiles.enemyProjStats[proj][1]][2], DataDrivenProjectiles.projPattern[DataDrivenProjectiles.enemyProjStats[proj][1]][3], DataDrivenProjectiles.projPattern[DataDrivenProjectiles.enemyProjStats[proj][1]][4], enemy.sprite.x, enemy.sprite.y, DataDrivenProjectiles.projPattern[DataDrivenProjectiles.enemyProjStats[proj][1]][5], DataDrivenProjectiles.projPattern[DataDrivenProjectiles.enemyProjStats[proj][1]][6], DataDrivenProjectiles.projPattern[DataDrivenProjectiles.enemyProjStats[proj][1]][7], DataDrivenProjectiles.projPattern[DataDrivenProjectiles.enemyProjStats[proj][1]][8], DataDrivenProjectiles.projPattern[DataDrivenProjectiles.enemyProjStats[proj][1]][9], DataDrivenProjectiles.projPattern[DataDrivenProjectiles.enemyProjStats[proj][1]][10], DataDrivenProjectiles.projPattern[DataDrivenProjectiles.enemyProjStats[proj][1]][11])
    }
}
let test = new Multi_Proj_BOTH(img`
    . . . . . . . . . . b 5 b . . .
    . . . . . . . . . b 5 b . . . .
    . . . . . . b b b b b b . . . .
    . . . . . b b 5 5 5 5 5 b . . .
    . . . . b b 5 d 1 f 5 5 d f . .
    . . . . b 5 5 1 f f 5 d 4 c . .
    . . . . b 5 5 d f b d d 4 4 . .
    . b b b d 5 5 5 5 5 4 4 4 4 4 b
    b d d d b b d 5 5 4 4 4 4 4 b .
    b b d 5 5 5 b 5 5 5 5 5 5 b . .
    c d c 5 5 5 5 d 5 5 5 5 5 5 b .
    c b d c d 5 5 b 5 5 5 5 5 5 b .
    . c d d c c b d 5 5 5 5 5 d b .
    . . c b d d d d d 5 5 5 b b . .
    . . . c c c c c c c c b b . . .
    . . . . . . . . . . . . . . . .
`, img`
    . . . . . . . e e e e . . . . .
    . . . . . e e 4 5 5 5 e e . . .
    . . . . e 4 5 6 2 2 7 6 6 e . .
    . . . e 5 6 6 7 2 2 6 4 4 4 e .
    . . e 5 2 2 7 6 6 4 5 5 5 5 4 .
    . e 5 6 2 2 8 8 5 5 5 5 5 4 5 4
    . e 5 6 7 7 8 5 4 5 4 5 5 5 5 4
    e 4 5 8 6 6 5 5 5 5 5 5 4 5 5 4
    e 5 c e 8 5 5 5 4 5 5 5 5 5 5 4
    e 5 c c e 5 4 5 5 5 4 5 5 5 e .
    e 5 c c 5 5 5 5 5 5 5 5 4 e . .
    e 5 e c 5 4 5 4 5 5 5 e e . . .
    e 5 e e 5 5 5 5 5 4 e . . . . .
    4 5 4 e 5 5 5 5 e e . . . . . .
    . 4 5 4 5 5 4 e . . . . . . . .
    . . 4 4 e e e . . . . . . . . .
`, true, 5000, 1, 10, 5, 500, 1000, 40, 20, 120, 60, 0, 1.57, 100, 0, 0, 0.75, 1)