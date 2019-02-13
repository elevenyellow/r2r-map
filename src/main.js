import { createThreeWorld } from './three/'
import {
    addTerrain,
    addDecorativeSprite,
    addBuildingSprite
} from './three/scenario'
import spritesConfig from './three/sprites'
import { position3dToScreen2d } from './three/math'
import { createSmartDiv, createPlayerTitle } from './ui'
import { generateRandomDecorativeSprites } from './server'

//
//
//
//
//
// UI
const ui = document.getElementById('ui')
const div = createSmartDiv({ container: ui })
const title = createPlayerTitle({ container: div.element })
title.changeTitle('enzo')

function onChangeZoom(zoom) {
    const newScale = (zoom * 100) / 20
    div.scale(Math.round(newScale + (100 - newScale) / 2) / 100)
}

function updateUi() {
    const proj = position3dToScreen2d({
        x: mysprite.position.x + 5,
        y: mysprite.position.y,
        z: mysprite.position.z + 5,
        camera,
        canvasWidth: window.innerWidth,
        canvasHeight: window.innerHeight
    })
    div.move(proj)
}

//
//
//
//
//
// 3D
const canvas = document.getElementById('canvas')
const {
    renderer,
    camera,
    isoCamera,
    sceneTerrain,
    sceneSprites
} = createThreeWorld({
    canvas,
    onChangeZoom
})

addTerrain({ scene: sceneTerrain, renderer, url: 'assets/tile2.png' })

const spriteList = [
    { id: 'tree1', frecuencyRatio: 8 },
    { id: 'tree2', frecuencyRatio: 8 },
    { id: 'tree3', frecuencyRatio: 40 },
    { id: 'tree4', frecuencyRatio: 8 },
    { id: 'bush1', frecuencyRatio: 5 },
    // { id: 'rock1', frecuencyRatio: 2 },
    { id: 'rock2', frecuencyRatio: 3 },
    { id: 'trunk1', frecuencyRatio: 10 },
    { id: 'trunk2', frecuencyRatio: 10 }
]
const sprites = generateRandomDecorativeSprites({
    quantity: 500,
    sprites: spriteList,
    point1: { x: -100, z: -100 },
    point2: { x: 100, z: 100 },
    ignoreAreas: [{ x: 0, z: 0, radius: 5 }, { x: 10, z: 5, radius: 3 }]
})

sprites.forEach(sprite => {
    addDecorativeSprite({
        scene: sceneSprites,
        x: sprite.x,
        z: sprite.z,
        element: spritesConfig[sprite.id]
    })
})

const mysprite = addBuildingSprite({
    scene: sceneSprites,
    x: 0,
    z: 0,
    element: {
        url: 'assets/village.png',
        scale: { x: 10, y: 10, z: 10 }
    }
})

addBuildingSprite({
    scene: sceneSprites,
    x: 10,
    z: 5,
    element: {
        url: 'assets/cottage.png',
        scale: { x: 4, y: 4, z: 4 }
    }
})

// isoCamera.onChange = updateUi
sceneSprites.add(new isoCamera.THREE.AxesHelper(10))
// scene.add(new three.isoCamera.THREE.GridHelper(50, 100, 0xaaaaaa, 0x999999))
// go({ scene })

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
    updateUi()
    requestAnimationFrame(animate)
}
animate()
