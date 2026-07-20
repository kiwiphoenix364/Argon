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
