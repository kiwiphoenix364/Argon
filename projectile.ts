class Adv_Projectile {
    public sprite: Sprite
    public x: number
    public y: number
    public vX: number
    public vY: number
    public aX: number
    public aY: number
    constructor(sprite: Sprite, sPosX: number, sPosY: number, angleVelocity: number, vSpeed: number, angleAcceleration: number, aSpeed: number) {
        this.sprite = sprite
        this.x = sPosX
        this.y = sPosY
        this.vX = Math.cos(angleVelocity) * vSpeed
        this.vY = Math.sin(angleVelocity) * vSpeed
        this.aX = Math.cos(angleAcceleration) * aSpeed
        this.aY = Math.sin(angleAcceleration) * aSpeed
        sprite.x = this.x
        sprite.y = this.y
        sprite.vx = this.vX
        sprite.vy = this.vY
        sprite.ax = this.aX
        sprite.ay = this.aY
    }
}
class Multi_Projectile {
    constructor(sprite: Sprite, sX: number, sY: number, eX: number, eY: number, aVS: number, aVE: number, aS: number) {
        
    }
}