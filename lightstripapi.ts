class LS {
    private static lights: number[] = [0x000000, 0x000000, 0x000000, 0x000000, 0x000000]
    constructor() {

    }
    public static setBrightness(brightness: number = 15) {
        light.setBrightness(brightness)
    }
    public static addToFront(color: number = 0x000000) {
        LS.lights.unshift(color)
        LS.updateLightStrip()
    }
    public static addToBack(color: number = 0x000000) {
        LS.lights.shift()
        LS.lights[4] = color
        LS.updateLightStrip()
    }
    public static removeFromFront() {
        LS.lights.shift()
        LS.updateLightStrip()
    }
    public static removeFromBack() {
        LS.lights.unshift(0x000000)
        LS.updateLightStrip()
    }
    public static setAllColors(colorList: number[] = [0x000000, 0x000000, 0x000000, 0x000000, 0x000000]) {
        LS.lights = colorList
        LS.updateLightStrip()
    }
    public static setColor(color: number = 0x000000, loc: number) {
        LS.lights[loc] = color
        light.setPixelColor(loc, color)
    }
    private static updateLightStrip() {
        for (let i = 0; i < LS.lights.length; i++) {
            light.setPixelColor(i, LS.lights[i])
        }
    }
}