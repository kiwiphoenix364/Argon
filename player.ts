class Player {
    public playerNum: controller.Controller
    public playerSprite: PlayerSprite
    constructor(playerNum: controller.Controller) {
        this.playerNum = playerNum
        this.playerSprite = new PlayerSprite(controller.player1)
        if (this.playerNum != null) {
            playerNum.moveSprite(this.playerSprite.playerSprite)
        }
    }
}
class DummyPlayer extends Player {
    constructor() {
        super(null)
    }
}
class PlayerSprite {
    public playerSprite: Sprite
    public playerType: controller.Controller
    constructor(playerType: controller.Controller) {
        this.playerType = playerType
        this.playerSprite = sprites.create(img`
            . . . . . . . 9 8 . . . . . . .
            . . . . . . 9 8 8 8 . . . . . .
            . . . . . . 9 8 8 8 . . . . . .
            . . . . . . 9 8 8 8 . . . . . .
            . . . . . . 9 8 8 8 . . . . . .
            . . . . . . 9 8 8 8 . . . . . .
            . . 9 8 8 8 8 8 8 8 8 8 8 8 . .
            . 9 8 8 8 8 8 8 8 8 8 8 8 8 8 .
            9 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
            9 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
            9 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
            9 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
            9 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
            9 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
            . 3 2 2 2 . 3 2 2 2 . 3 2 2 2 .
            . . 3 2 . . . 3 2 . . . 3 2 . .
        `, SpriteKind.Player)
    }
    setPos(x: number, y: number) {
        this.playerSprite.setPosition(x,y)
    }
}
//new Player(controller.player1)