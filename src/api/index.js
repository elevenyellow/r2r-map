// imports
import { createSmartDiv, createPlayerTitle } from './ui'
import { addBuildingSprite } from './three/scenario'
import { position3dToScreen2d } from './three/utils'
// exports
export { createTerrain, createDecorativeSprite } from './three/scenario'
export { createThreeWorld } from './three/'

export const OWNER = {
    NEUTRAL: 0,
    ME: 1,
    ENEMY: 2
}

export function createTileFactory({ ui, scene, camera }) {
    return ({ col, row, spriteConf }) => {
        const coordinate = `${col}.${row}`
        const sprite = addBuildingSprite({
            scene,
            x: col,
            z: row,
            spriteConf
        })

        const div = createSmartDiv({ container: ui })
        const title = createPlayerTitle({ container: div.element })
        title.changeTitle('')

        return {
            sprite,
            coordinate,
            updatePositionDiv: ({ canvasWidth, canvasHeight }) => {
                const proj = position3dToScreen2d({
                    x: sprite.position.x + spriteConf.offsetX,
                    y: sprite.position.y,
                    z: sprite.position.z + spriteConf.offsetZ,
                    camera,
                    canvasWidth,
                    canvasHeight
                })
                div.move(proj)
            },
            updateScaleDiv: scale => {
                div.scale(scale)
            }
        }
    }
}
