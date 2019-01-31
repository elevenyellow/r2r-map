import createThreeWorld from './three/create'
import { addTerrain, addDecorativeSprite } from './three/scenario'
import sprites from './three/sprites'

const canvas = document.getElementById('canvas')
const three = createThreeWorld(canvas)
const scene = three.scene
const renderer = three.renderer

addTerrain({ scene, renderer, texture: 'assets/tile2.png' })
addDecorativeSprite({ scene, x: 1, z: 1, element: sprites.tree1 })

// scene.add(new three.isoCamera.THREE.GridHelper(50, 100, 0xaaaaaa, 0x999999))
// scene.add(new three.isoCamera.THREE.AxesHelper(10))
