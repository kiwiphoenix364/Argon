class LS {
    private static lights: number[] = [0, 0, 0, 0, 0]
    public static lightStripMode: number = 0
    public static readonly palette: number[] = [
        0x000000,
        0xF4F8FA,
        0xAAA8FF,
        0x5D5DF8,
        0x1D43D7,
        0x9D3ACB,
        0xE571D0,
        0xFF94A9,
        0xF23831,
        0xC42121,
        0xF78E2B,
        0xF3BB86,
        0xF0E17F,
        0x1A9330,
        0x1E325A,
        0x202020
    ]
    constructor() {

    }
    public static setBrightness(brightness: number = 15) {
        light.setBrightness(brightness)
    }
    public static addToFront(color: number = 0) {
        LS.lights.unshift(color)
        LS.updateLightStrip()
    }
    public static addToBack(color: number = 0) {
        LS.lights.shift()
        LS.lights[4] = color
        LS.updateLightStrip()
    }
    public static removeFromFront() {
        LS.lights.shift()
        LS.updateLightStrip()
    }
    public static removeFromBack() {
        LS.lights.unshift(0)
        LS.updateLightStrip()
    }
    public static setAllColors(colorList: number[] = [0, 0, 0, 0, 0]) {
        LS.lights = colorList
        LS.updateLightStrip()
    }
    public static setColor(color: number = 0, loc: number) {
        LS.lights[loc] = color
        light.setPixelColor(loc, color)
    }
    private static updateLightStrip() {
        if (LS.lightStripMode < 2) {
            for (let i = 0; i < LS.lights.length; i++) {
                light.setPixelColor(i, LS.getHexPalette(i))
            }
        }
    }
    public static drawLightStrip(img: Image) {
        if (LS.lightStripMode != 1) {
            for (let i = 0; i < 5; i++) {
                img.fillRect(i * OverallGameStats.screenWidth * .2, OverallGameStats.screenHeight, OverallGameStats.screenWidth * .2, 8, LS.lights[i])
            }
        }
    }
    public static getHexPalette(num: number) {
        let r = ((LS.palette[LS.lights[num]] & 0xFF0000) >> 3) & 0xFF0000
        let g = ((LS.palette[LS.lights[num]] & 0x00FF00) >> 3) & 0x00FF00
        let b = ((LS.palette[LS.lights[num]] & 0x0000FF) >> 3) & 0x0000FF
        return r + g + b
    }
}
enum LS_COLORS {
    White = 1,
    Blue_Light = 2,
    Blue_Mid = 3,
    Blue_Dark = 4,
    Purple = 5,
    Pink = 6,
    Red_Light = 7,
    Red_Mid = 8,
    Red_Dark = 9,
    Orange_Mid = 10,
    Orange_Light = 11,
    Yellow = 12,
    Green = 13,
    Blue_Navy = 14,
    Black = 15
}
enum LS_COLORS_HEX {
    White = 0xF4F8FA,
    Blue_Light = 0xAAA8FF,
    Blue_Mid = 0x5D5DF8,
    Blue_Dark = 0x1D43D7,
    Purple = 0x9D3ACB,
    Pink = 0xE571D0,
    Red_Light = 0xFF94A9,
    Red_Mid = 0xF23831,
    Red_Dark = 0xC42121,
    Orange_Mid = 0xF78E2B,
    Orange_Light = 0xF3BB86,
    Yellow = 0xF0E17F,
    Green = 0x1A9330,
    Blue_Navy = 0x1E325A,
    Black = 0x202020
}
enum LSMODE {
    Both = 0,
    Physical = 1,
    Virtual = 2
}