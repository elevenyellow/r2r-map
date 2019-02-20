import BUILDING from './sprites/building'
import DECORATIVE from './sprites/decorative'
import { createTerrain, createDecorativeSprite } from './three/scenario'
import { createThreeWorld } from './three/'
import { OWNER } from './const'
import createTileFactory from './factories/createTileFactory'
// import createApi from './api'

// INITIAL SETUP
const tiles = []
const ui = document.getElementById('ui')
const canvas = document.getElementById('canvas')

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
    url: 'assets/tile2.png'
})

// WE MUST EXPOSE THIS FOR EXTERNAL API, THIS IS JUST AN EXAMPLE
// WE MUST EXPOSE THIS FOR EXTERNAL API, THIS IS JUST AN EXAMPLE
// WE MUST EXPOSE THIS FOR EXTERNAL API, THIS IS JUST AN EXAMPLE
// WE MUST EXPOSE THIS FOR EXTERNAL API, THIS IS JUST AN EXAMPLE
// WE MUST EXPOSE THIS FOR EXTERNAL API, THIS IS JUST AN EXAMPLE
// WE MUST EXPOSE THIS FOR EXTERNAL API, THIS IS JUST AN EXAMPLE
// WE MUST EXPOSE THIS FOR EXTERNAL API, THIS IS JUST AN EXAMPLE
const tileOwnerStates = {
    [OWNER.NEUTRAL]: 'tileOwner neutral',
    [OWNER.PLAYER]: 'tileOwner player',
    [OWNER.ENEMY]: 'tileOwner enemy'
}
const createTile = createTileFactory({
    ui,
    camera,
    scene: sceneSprites,
    ratioZoomDiv: 4
})
const tile1 = createTile({
    col: 0,
    row: 0,
    spriteConf: BUILDING.VILLAGE
})
const tile2 = createTile({
    col: 15,
    row: 30,
    spriteConf: BUILDING.COTTAGE
})
const tile3 = createTile({
    col: 40,
    row: 30,
    spriteConf: BUILDING.COTTAGE
})
tiles.push(tile1)
tiles.push(tile2)
tiles.push(tile3)

tile1.updateScaleDiv(zoom)
tile2.updateScaleDiv(zoom)
tile3.updateScaleDiv(zoom)

const owner1Id = 'ID1'
tile1.addOwner(owner1Id)
tile1.changeOwner(owner1Id, tileOwnerStates[OWNER.PLAYER])
tile1.changeName(owner1Id, 'Enzo')
tile1.changeUnits(owner1Id, 234)
// tile1.removeOwner(owner1Id)

tile2.addOwner('ID2')
tile2.changeOwner('ID2', tileOwnerStates[OWNER.NEUTRAL])
// tile2.changeName('ID2', 'AGUS')
// tile2.changeUnits('ID2', 10)

const owner3Id = 'ID3'
tile3.addOwner(owner3Id)
tile3.changeOwner(owner3Id, tileOwnerStates[OWNER.ENEMY])
tile3.changeName(owner3Id, 'Agus')
tile3.changeUnits(owner3Id, 1000)

// WE MUST EXPOSE THIS FOR EXTERNAL API, THIS IS JUST AN EXAMPLE
// WE MUST EXPOSE THIS FOR EXTERNAL API, THIS IS JUST AN EXAMPLE
// WE MUST EXPOSE THIS FOR EXTERNAL API, THIS IS JUST AN EXAMPLE
// WE MUST EXPOSE THIS FOR EXTERNAL API, THIS IS JUST AN EXAMPLE
// WE MUST EXPOSE THIS FOR EXTERNAL API, THIS IS JUST AN EXAMPLE
// WE MUST EXPOSE THIS FOR EXTERNAL API, THIS IS JUST AN EXAMPLE
// WE MUST EXPOSE THIS FOR EXTERNAL API, THIS IS JUST AN EXAMPLE

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
