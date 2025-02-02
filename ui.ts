let pathTimesArray = [0]
let pathArray: Path[]
editMode()

function editMode() {
    let inPointMenu = false
    let inPathMenu = false
    let currentIdx = 0
    scene.createRenderable(1, (image: Image, camera: scene.Camera) => {
        let test = new Path(0, 0, [new PathPoint(10, 10, 0), new PathPoint(40, 40, 1)])
        test.renderPath(image)
    })
    let cursor = sprites.create(img`
        d . . . d
        . d . d .
        . . . . .
        . d . d .
        d . . . d
    `, SpriteKind.Player)
    controller.moveSprite(cursor)
    controller.B.onEvent(ControllerButtonEvent.Pressed, function() {
        if (!inPointMenu && !inPathMenu) {
            let scrollMenu = buildScrollMenu(pathTimesArray[0])
            controller.moveSprite(cursor, 0, 0)
            inPathMenu = true
            scrollMenu.onButtonPressed(controller.A, function (selection: string, selectedIndex: number) {
                if (selection == "+") {
                    pathTimesArray.push(game.askForNumber("enter seconds"))
                    scrollMenu.close()
                } else if (selection == "<") {
                    currentIdx--
                    currentIdx = Math.max(currentIdx, 0)
                    scrollMenu.close()
                } else if (selection == ">") {
                    currentIdx++
                    currentIdx = Math.min(currentIdx, pathTimesArray.length)
                    scrollMenu.close()
                }

            })
            scrollMenu.onButtonPressed(controller.B, function (selection: string, selectedIndex: number) {
                scrollMenu.close()
                inPathMenu = false
                controller.moveSprite(cursor)
            })
        }
    })
}
function buildScrollMenu(midValue: number) {
    let scrollMenu = miniMenu.createMenuFromArray([miniMenu.createMenuItem("<"), miniMenu.createMenuItem(midValue.toString()), miniMenu.createMenuItem(">"), miniMenu.createMenuItem("+")])
    scrollMenu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Columns, 1)
    scrollMenu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Rows, 4)
    scrollMenu.left = 0
    scrollMenu.top = 0
    scrollMenu.z = 10
    return scrollMenu
}