import { createThreeWorld } from './three/'
import {
    addTerrain,
    addDecorativeMapElement,
    addInteractiveMapElement
} from './three/scenario'
import spritesConfig from './three/sprites'
import { generateRandomDecorativeSprites } from './server'
import go from './code'

const canvas = document.getElementById('canvas')
const three = createThreeWorld(canvas)
const scene = three.scene
const renderer = three.renderer

addTerrain({ scene, renderer, url: 'assets/tile2.png' })

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
    ignoreAreas: [{ x: 0, z: 0, radius: 5 }, { x: 10, z: 5, radius: 2 }]
})
sprites.forEach(sprite => {
    addDecorativeMapElement({
        scene,
        x: sprite.x,
        z: sprite.z,
        element: spritesConfig[sprite.id]
    })
})

addInteractiveMapElement({
    scene,
    x: 0,
    z: 0,
    element: {
        url: 'assets/village.png',
        scale: { x: 10, y: 10, z: 10 }
    }
})

addInteractiveMapElement({
    scene,
    x: 10,
    z: 5,
    element: {
        url: 'assets/cottage.png',
        scale: { x: 4, y: 4, z: 4 }
    }
})

// scene.add(new three.isoCamera.THREE.GridHelper(50, 100, 0xaaaaaa, 0x999999))
// go({ scene })
