class Adv_Projectile {
    public img: Image
    public x: number
    public y: number
    public vX: number
    public vY: number
    public aX: number
    public aY: number
    public life: number
    public static fast_proj_list: Adv_Projectile[] = []
    public static proj_list: Adv_Projectile[] = []
    public static slow_proj_list: Adv_Projectile[] = []
    constructor(spriteImg: Image, destroyOutOfScreen: boolean, life: number, sPosX: number, sPosY: number, angleVelocity: number, vSpeed: number, angleAcceleration = 0, aSpeed = 0, angleMode = 0) {
        if (angleMode === 0) {
            // Angle 0, just image
            this.img = spriteImg
        } else if (angleMode === 1) {
            // Based on starting velocity
            this.img = image.create(spriteImg.width, spriteImg.height)
            helpers.imageDrawScaledRotated(this.img, 0, 0, spriteImg, 1, 1, angleVelocity)
        } else if (angleMode === 2) {
            // Updates dir constantly - laggy, code in EnemyLayer controls this.
            this.img = spriteImg
        } else if (angleMode === 3) {
            // Faces in direction of acceleration
            this.img = image.create(spriteImg.width, spriteImg.height)
            helpers.imageDrawScaledRotated(this.img, 0, 0, spriteImg, 1, 1, angleAcceleration)
        }
        this.x = sPosX - (spriteImg.width >> 1)
        this.y = sPosY - (spriteImg.height >> 1)
        this.vX = Math.cos(angleVelocity) * vSpeed
        this.vY = Math.sin(angleVelocity) * vSpeed
        this.aX = Math.cos(angleAcceleration) * aSpeed
        this.aY = Math.sin(angleAcceleration) * aSpeed
        this.life = life + Timing.gameTime
        // Adv_Projectile.proj_list used in EnemyLayer to move/render projectiles.
        if (aSpeed === 0) {
            Adv_Projectile.fast_proj_list.push(this)
        } else if (angleMode != 2) {
            Adv_Projectile.proj_list.push(this)
        } else {
            Adv_Projectile.slow_proj_list.push(this)
        }
        
    }
    destroy(removeFrom: Adv_Projectile[]) {
        this.img = this.x = this.y = this.vX = this.vY = this.aX = this.aY = this.life = null
        removeFrom.removeElement(this)
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
                let ratio = this.perVolley - 1 > 0 ? j / (this.perVolley - 1) : 0
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
                let ratio = this.bigProjs - 1 > 0 ? i / (this.bigProjs - 1) : 0
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