import {
    createThreeWorld,
    createTerrain,
    createTile,
    createDecorativeSprite
} from './api'
import BUILDING from './sprites/buildings'

//
//
//
//
//
//
//
//
//
// INITIAL SETUP
const tiles = {}
const ui = document.getElementById('ui')
const canvas = document.getElementById('canvas')

// Creating three world
const {
    renderer,
    camera,
    // isoCamera,
    sceneTerrain,
    sceneSprites
} = createThreeWorld({
    canvas
    // onChangeZoom
})

// Adding terrain
const terrain = createTerrain({
    scene: sceneTerrain,
    renderer,
    url: 'assets/tile2.png'
})

const tile = createTile({
    col: 0,
    row: 0,
    spriteConf: BUILDING.VILLAGE,
    ui,
    scene: sceneSprites
})

tiles[tile.coordinate] = tile

// function onChangeZoom(zoom) {
//     const newScale = (zoom * 100) / 20
//     div.scale(Math.round(newScale + (100 - newScale) / 2) / 100)
// }

// function updateUi() {
//     const proj = position3dToScreen2d({
//         x: tile.sprite.position.x + 5,
//         y: tile.sprite.position.y,
//         z: tile.sprite.position.z + 5,
//         camera,
//         canvasWidth: window.innerWidth,
//         canvasHeight: window.innerHeight
//     })
//     div.move(proj)
// }

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

//
//
//
//
//
//
//
//
// GENERAL
function animate() {
    // this.renderer.autoClear = true
    ;[sceneTerrain, sceneSprites].forEach(scene => {
        renderer.render(scene, camera)
        renderer.clearDepth()
        renderer.autoClear = false
    })
    requestAnimationFrame(animate)
    // updateUi()
}
animate()

// HELPERS
// isoCamera.onChange = updateUi
// sceneSprites.add(new isoCamera.THREE.AxesHelper(10))
// scene.add(new three.isoCamera.THREE.GridHelper(50, 100, 0xaaaaaa, 0x999999))
// go({ scene })
