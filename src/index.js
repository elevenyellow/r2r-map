import { createTerrain, createDecorativeSprite } from './three/scenario'
import { createThreeWorld } from './three/'
import createApi from './api'
import OTHERS from './sprites/others'

// GETTING DOM
const ui = document.getElementById('ui')
const canvas = document.getElementById('canvas')

// STATE
const tiles = []

// CREATING THREE WORLD
const {
    renderer,
    camera,
    // isoCamera,
    sceneTerrain,
    sceneSprites,
    zoom
} = createThreeWorld({
    canvas,
    onChangeZoom
})

// ADDING TERRAIN
const terrain = createTerrain({
    scene: sceneTerrain,
    renderer,
    url: OTHERS.TERRAIN.url
})

// CREATING AND EXPOSING API
const API = createApi({
    tiles,
    ui,
    camera,
    sceneSprites,
    zoom
})
window.API = API

// RENDER FUNCTIONS
function onChangeZoom(zoom) {
    tiles.forEach(tile => tile.updateScaleDiv(zoom))
}

function onAnimationFrame() {
    // this.renderer.autoClear = true
    ;[sceneTerrain, sceneSprites].forEach(scene => {
        renderer.render(scene, camera)
        renderer.clearDepth()
        renderer.autoClear = false
    })
    requestAnimationFrame(onAnimationFrame)

    // Updating UI
    tiles.forEach(tile =>
        tile.updatePositionDiv({
            camera,
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight
        })
    )
}
onAnimationFrame()

// HELPERS
// isoCamera.onChange = updateUi
// sceneSprites.add(new isoCamera.THREE.AxesHelper(10))
// scene.add(new three.isoCamera.THREE.GridHelper(50, 100, 0xaaaaaa, 0x999999))
// go({ scene })

// //
// canvas.addEventListener('click', e => {
//     console.log(e, tiles.map(tile => tile.div.element))
// })

// // Adding decorative sprites
// const spriteList = [
//     { id: 'tree1', frecuencyRatio: 8 },
//     { id: 'tree2', frecuencyRatio: 8 },
//     { id: 'tree3', frecuencyRatio: 40 },
//     { id: 'tree4', frecuencyRatio: 8 },
//     { id: 'bush1', frecuencyRatio: 5 },
//     // { id: 'rock1', frecuencyRatio: 2 },
//     { id: 'rock2', frecuencyRatio: 3 },
//     { id: 'trunk1', frecuencyRatio: 10 },
//     { id: 'trunk2', frecuencyRatio: 10 }
// ]
// const sprites = generateRandomDecorativeSprites({
//     quantity: 500,
//     sprites: spriteList,
//     point1: { x: -100, z: -100 },
//     point2: { x: 100, z: 100 },
//     ignoreAreas: [{ x: 0, z: 0, radius: 5 }, { x: 10, z: 5, radius: 3 }]
// })
// sprites.forEach(sprite => {
//     createDecorativeSprite({
//         scene: sceneSprites,
//         x: sprite.x,
//         z: sprite.z,
//         spriteConf: spritesConfig[sprite.id]
//     })
// })

// EXAMPLE USING API

window.village1 = API.createVillage({ col: 0, row: 0 })
window.village1.addOwnerAsPlayer('ID1', 'Enzo', 1000)
window.village1.addOwnerAsEnemy('ID2', 'Agus', 234)
window.village1.addOwnerAsEnemy('ID3', 'Azaru', 312)
window.village1.removeOwner('ID3')

window.cottage1 = API.createCottage({ col: 15, row: 15 })
