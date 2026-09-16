class Player {
    public playerSprite: Sprite
    public playerHitbox: Sprite
    public cursor: Cursor
    public speed: number
    public updater: control.FrameCallback
    public invulnerableTimer: number = 0
    public blinkTimer: number = 0
    constructor(img: Image, hitboxImg: Image, cursor: Cursor, speed: number) {
        this.playerSprite = sprites.create(img)
        this.playerSprite.setFlag(SpriteFlag.Ghost, true)
        this.playerHitbox = sprites.create(hitboxImg)
        this.playerHitbox.setFlag(SpriteFlag.Ghost, false)
        //this.playerHitbox.setFlag(SpriteFlag.GhostThroughTiles, true)
        //this.playerHitbox.setFlag(SpriteFlag.GhostThroughWalls, true)
        //this.playerHitbox.setFlag(SpriteFlag.Invisible, true)
        this.cursor = cursor
        this.speed = speed
        this.playerHitbox.x = 80
        this.playerHitbox.y = 60
        this.playerSprite.x = this.playerHitbox.x
        this.playerSprite.y = this.playerHitbox.y
        this.followCursor()
    }
    private followCursor() {
        this.updater = game.currentScene().eventContext.registerFrameHandler(24, () => {
            // Account for i frames
            if (this.invulnerableTimer < Timing.gameTime) {
                //this.playerHitbox.x = Player.follow(this.playerHitbox.x, this.cursor.sprite.x, this.speed)
                //this.playerHitbox.y = Player.follow(this.playerHitbox.y, this.cursor.sprite.y, this.speed)
                //this.playerSprite.x = this.playerHitbox.x
                //this.playerSprite.y = this.playerHitbox.y
            } else if (Math.trunc((Timing.gameTime - this.blinkTimer) / 500) % 2 === 1) {
                this.playerSprite.setFlag(SpriteFlag.Invisible, true)
            } else {
                this.playerSprite.setFlag(SpriteFlag.Invisible, false)
            }
        })
    }
    private static follow(sValue: number, eValue: number, maxDev: number) {
        return sValue + Math.constrain(eValue - sValue, -maxDev, maxDev)
    }
    public setPos(x: number, y: number) {
        this.playerHitbox.x = x
        this.playerHitbox.y = y
        this.playerSprite.x = x
        this.playerSprite.y = y
    }
}
class PlayerBank {
    currentPlayer: number
    playerCache: number[]
    public static readonly playerImages: Image[] = [
        img`
            . . . . . 5 5 5 5 5 5 . . . . .
            . . . . . 5 4 4 4 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            5 5 5 5 5 4 4 3 3 4 4 5 5 5 5 5
            5 4 4 4 4 4 3 3 3 3 4 4 4 4 4 5
            . 5 5 5 4 4 4 3 3 4 4 4 5 5 5 .
            . . . 5 5 5 4 3 3 4 5 5 5 . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . 5 5 4 3 3 4 5 5 . . . .
            . . . . 5 4 4 3 3 4 4 5 . . . .
            . . . 5 5 4 4 4 4 4 4 5 5 . . .
            . . . 5 5 5 5 5 5 5 5 5 5 . . .
        `,
        img`
            . . . . . 5 5 5 5 5 5 . . . . .
            . . . . . 5 4 4 4 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            5 5 5 5 5 4 4 3 3 4 4 5 5 5 5 5
            5 4 4 4 4 4 3 3 3 3 4 4 4 4 4 5
            . 5 5 5 4 4 4 3 3 4 4 4 5 5 5 .
            . . . 5 5 5 4 3 3 4 5 5 5 . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . 5 5 4 3 3 4 5 5 . . . .
            . . . . 5 4 4 3 3 4 4 5 . . . .
            . . . 5 5 4 4 4 4 4 4 5 5 . . .
            . . . 5 5 5 5 5 5 5 5 5 5 . . .
        `,
        img`
            . . . . . 5 5 5 5 5 5 . . . . .
            . . . . . 5 4 4 4 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            5 5 5 5 5 4 4 3 3 4 4 5 5 5 5 5
            5 4 4 4 4 4 3 3 3 3 4 4 4 4 4 5
            . 5 5 5 4 4 4 3 3 4 4 4 5 5 5 .
            . . . 5 5 5 4 3 3 4 5 5 5 . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . 5 5 4 3 3 4 5 5 . . . .
            . . . . 5 4 4 3 3 4 4 5 . . . .
            . . . 5 5 4 4 4 4 4 4 5 5 . . .
            . . . 5 5 5 5 5 5 5 5 5 5 . . .
        `,
        img`
            . . . . . 5 5 5 5 5 5 . . . . .
            . . . . . 5 4 4 4 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            5 5 5 5 5 4 4 3 3 4 4 5 5 5 5 5
            5 4 4 4 4 4 3 3 3 3 4 4 4 4 4 5
            . 5 5 5 4 4 4 3 3 4 4 4 5 5 5 .
            . . . 5 5 5 4 3 3 4 5 5 5 . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . 5 5 4 3 3 4 5 5 . . . .
            . . . . 5 4 4 3 3 4 4 5 . . . .
            . . . 5 5 4 4 4 4 4 4 5 5 . . .
            . . . 5 5 5 5 5 5 5 5 5 5 . . .
        `,
        img`
            . . . . . 5 5 5 5 5 5 . . . . .
            . . . . . 5 4 4 4 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            5 5 5 5 5 4 4 3 3 4 4 5 5 5 5 5
            5 4 4 4 4 4 3 3 3 3 4 4 4 4 4 5
            . 5 5 5 4 4 4 3 3 4 4 4 5 5 5 .
            . . . 5 5 5 4 3 3 4 5 5 5 . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . . 5 4 3 3 4 5 . . . . .
            . . . . 5 5 4 3 3 4 5 5 . . . .
            . . . . 5 4 4 3 3 4 4 5 . . . .
            . . . 5 5 4 4 4 4 4 4 5 5 . . .
            . . . 5 5 5 5 5 5 5 5 5 5 . . .
        `
    ]
    public static readonly playerHitboxes: Image[] = [
        img`
            . 1 1 1 .
            1 1 1 1 1
            1 1 1 1 1
            1 1 1 1 1
            . 1 1 1 .
        `,
        img`
            . 1 1 1 .
            1 1 1 1 1
            1 1 1 1 1
            1 1 1 1 1
            . 1 1 1 .
        `,
        img`
            . 1 1 1 .
            1 1 1 1 1
            1 1 1 1 1
            1 1 1 1 1
            . 1 1 1 .
        `,
        img`
            . 1 1 1 .
            1 1 1 1 1
            1 1 1 1 1
            1 1 1 1 1
            . 1 1 1 .
        `,
        img`
            . 1 1 1 .
            1 1 1 1 1
            1 1 1 1 1
            1 1 1 1 1
            . 1 1 1 .
        `
    ]
    public static readonly playerColors: number[] = [
        1,
        2,
        3,
        4
    ]
    constructor(playerCache: number[] = []) {
        this.playerCache = playerCache
        this.spawnPlayer(this.playerCache.pop())
        LS.setAllColors([
            PlayerBank.playerColors[this.playerCache[0]],
            PlayerBank.playerColors[this.playerCache[1]],
            PlayerBank.playerColors[this.playerCache[2]],
            PlayerBank.playerColors[this.playerCache[3]],
            PlayerBank.playerColors[this.playerCache[4]]
        ])
    }
    public killPlayer() {
        this.spawnPlayer(this.playerCache.pop())
        LS.removeFromFront()
    }
    public spawnPlayer(playernum: number) {
        OverallGameStats.playerSprites[0].playerSprite.setImage(PlayerBank.playerImages[playernum])
        OverallGameStats.playerSprites[0].playerHitbox.setImage(PlayerBank.playerHitboxes[playernum])
        OverallGameStats.playerSprites[0].setPos(80, 100)
        OverallGameStats.playerSprites[0].invulnerableTimer = Timing.gameTime + 2500
        OverallGameStats.playerSprites[0].blinkTimer = Timing.gameTime
    }
    public destroy() {
        this.currentPlayer = this.playerCache = null
    }
}
//new Player(controller.player1)
/*
let mySprite = sprites.create(img`
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ...................cc........d..................................
    .................dccbcc..cccdcccccc.............................
    ...................cbbbccbbbcbbbbbbcc...........................
    ..................cbbbbcbbbcbbbcbbbbbd..........................
    ..................cbbbbbcbbbbbbbcbcbbc..........................
    .................cbdbcbbbbcbbb222bbbbccccc......................
    .................cbcbcbbbdbb2222222dbbbbbbcc....................
    .................cd.bcbbbdb222222222cbbbbbbd....................
    .................c..bcd22222222999222cbcbbd.....................
    .................d...b299222299222222cbbcccc....................
    .....................421499221f422222c44bc......................
    ....................422f422224f4222224224bc.....................
    ....................42244222224422222234bbbc....................
    ....................42222232222222222234bbbbc...................
    .....................4222232222222222424bbcbd...................
    .....................4222232222222224c4bbc.cd...................
    .....................4222322222222234dbbbc......................
    .....................4222233222222234bdbc.......................
    ......................422222222222234bbbbc......................
    ......................42232222222234dbbbbcd.....................
    .......................4233333222234bcbbc.d.....................
    .......................422222222224dbbbc........................
    .......................422332222234bcbbcc.......................
    ........................42222222343bcbc.d.......................
    ........................42222223433c.cd.........................
    ........................43222223433.............................
    .........................42222343223............................
    .........................43333433223............................
    ..........................4444332223............................
    ..........................3333332223............................
    ...........................322222223............................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
    ................................................................
`, SpriteKind.Player)
*/