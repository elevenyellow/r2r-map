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

export function createTileFactory({
    ui,
    scene,
    camera,
    ratioZoomDiv = 1 // 1 to keep the original size
}) {
    return ({ col, row, spriteConf }) => {
        const div = createSmartDiv({ container: ui })
        const players = {}
        const coordinate = `${col}.${row}`
        const sprite = addBuildingSprite({
            scene,
            x: col,
            z: row,
            spriteConf
        })
        return {
            div,
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
            updateScaleDiv: zoom => {
                const scale = (zoom * 100) / 20
                const scaleReduced =
                    Math.round(scale + (100 - scale) / ratioZoomDiv) / 100
                // Changing  ZOOM
                div.scale(scaleReduced)
            },
            addPlayer: id => {
                const player = createPlayerTitle()
                div.element.appendChild(player.element)
                players[id] = player
                return player
            },
            removePlayer: id => {
                const player = players[id]
                div.element.removeChild(player.element)
            },
            changeTitle: (id, title) => {
                const player = players[id]
                player.changeTitle(title)
            }
        }
    }
}
