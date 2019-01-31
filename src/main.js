import { createThreeWorld } from './three/'
import { addTerrain, addDecorativeSprite } from './three/scenario'
import sprites from './three/sprites'

const canvas = document.getElementById('canvas')
const three = createThreeWorld(canvas)
const scene = three.scene
const renderer = three.renderer

addTerrain({ scene, renderer, url: 'assets/tile2.png' })
addDecorativeSprite({ scene, x: 0, z: 0, element: sprites.tree1 })
addDecorativeSprite({ scene, x: 0, z: 1, element: sprites.tree2 })
addDecorativeSprite({ scene, x: 1, z: 0, element: sprites.tree3 })
addDecorativeSprite({ scene, x: 1, z: 1, element: sprites.tree4 })

addDecorativeSprite({ scene, x: 2, z: 2, element: sprites.bush1 })
addDecorativeSprite({ scene, x: 1, z: -1, element: sprites.rock1 })
addDecorativeSprite({ scene, x: -1, z: 1, element: sprites.rock2 })
addDecorativeSprite({ scene, x: -1, z: -1, element: sprites.trunk1 })
addDecorativeSprite({ scene, x: -2, z: -2, element: sprites.trunk2 })
addDecorativeSprite({ scene, x: 4, z: 3, element: sprites.tree3 })

// scene.add(new three.isoCamera.THREE.GridHelper(50, 100, 0xaaaaaa, 0x999999))
// scene.add(new three.isoCamera.THREE.AxesHelper(10))
