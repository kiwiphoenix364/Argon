class Adv_Projectile {
    public sprite: Sprite
    public x: number
    public y: number
    public vX: number
    public vY: number
    public aX: number
    public aY: number
    constructor(spriteImg: Image, destroyOutOfScreen: boolean, life: number, sPosX: number, sPosY: number, angleVelocity: number, vSpeed: number, angleAcceleration: number, aSpeed: number) {
        this.sprite = new Sprite(spriteImg)
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
                new Adv_Projectile(this.spriteImg, this.destrOutOfScreen, this.life, Path.interpolateFloat(j, this.x, this.ePosX), Path.interpolateFloat(j, this.y, this.ePosY), this.vA, this.vS, this.aA, this.aS)
            }
            pause(this.delay)
        }
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
    constructor(spriteImg: Image, destroyOutOfScreen: boolean, life: number, volleys: number, perVolley: number, delay: number, sPosX: number, sPosY: number, angleVelocity: number, eAngleVelocity: number, vSpeed: number, angleAcceleration: number, aSpeed: number) {
        this.spriteImg = spriteImg
        this.x = sPosX
        this.y = sPosY
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
        this.spawnProjectiles()
    }
    public spawnProjectiles() {
        for (let i = 0; i < this.volleys; i++) {
            for (let j = 0; j < this.perVolley; j++) {
                new Adv_Projectile(this.spriteImg, this.destrOutOfScreen, this.life, this.x, this.y, Path.interpolateFloat(j, this.vA, this.eVA), this.vS, this.aA, this.aS)
            }
            pause(this.delay)
        }
    }
}
