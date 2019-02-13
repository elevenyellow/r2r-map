import { createSmartDiv, createPlayerTitle } from './ui'
import { addBuildingSprite } from './three/scenario'
export { createTerrain, createDecorativeSprite } from './three/scenario'
export { createThreeWorld } from './three/'

export const OWNER = {
    NEUTRAL: 0,
    ME: 1,
    ENEMY: 2
}

export function createTile({ col, row, spriteConf, scene }) {
    const coordinate = `${col}.${row}`
    const sprite = addBuildingSprite({
        scene,
        x: col,
        z: row,
        spriteConf
    })
    return {
        sprite,
        coordinate
    }
}

// addBuildingSprite({
//     scene: sceneSprites,
//     x: 10,
//     z: 5,
//     element: {
//         url: 'assets/cottage.png',
//         scale: { x: 4, y: 4, z: 4 }
//     }
// })

// //
// //
// //
// //
// //
// // UI
// const div = createSmartDiv({ container: ui })
// const title = createPlayerTitle({ container: div.element })
// title.changeTitle('')
