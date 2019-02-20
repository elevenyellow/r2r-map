import BUILDING from './sprites/building'
import DECORATIVE from './sprites/decorative'
import {
    createThreeWorld,
    createTerrain,
    createTileFactory,
    createDecorativeSprite
} from './api'

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
tiles.push(tile1)
tiles.push(tile2)

tile1.updateScaleDiv(zoom)
tile2.updateScaleDiv(zoom)

const player1Id = 'ID1'
tile1.addPlayer(player1Id)
tile1.changeTitle(player1Id, 'Enzo')
// tile1.removePlayer(owner1Id)

tile2.addPlayer('ID2')
tile2.changeTitle('ID2', 'AGUS')

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
