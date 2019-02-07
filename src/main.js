import { createThreeWorld } from './three/'
import {
    addTerrain,
    addDecorativeSprite,
    addBuildingSprite,
    addUiSprite,
    addTextSprite
} from './three/scenario'
import { position3dToScreen2d } from './three/math'
import spritesConfig from './three/sprites'
import { generateRandomDecorativeSprites } from './server'
import go from './code'

const canvas = document.getElementById('canvas')
const {
    renderer,
    camera,
    isoCamera,
    sceneTerrain,
    sceneSprites
} = createThreeWorld(canvas)

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

addBuildingSprite({
    scene: sceneSprites,
    x: 0,
    z: 0,
    element: {
        url: 'assets/village.png',
        scale: { x: 10, y: 10, z: 10 }
    }
})

const mysprite = addBuildingSprite({
    scene: sceneSprites,
    x: 10,
    z: 15,
    element: {
        url: 'assets/cottage.png',
        scale: { x: 4, y: 4, z: 4 }
    }
})

addUiSprite({
    scene: sceneSprites,
    x: 6,
    z: 6,
    element: {
        url: 'assets/title-background.png',
        scale: { x: 6, y: 6, z: 6 }
    }
})

addTextSprite({
    scene: sceneSprites,
    x: 6,
    z: 6,
    text: 'ENZO',
    textHeight: 0.8
})

// scene.add(new three.isoCamera.THREE.GridHelper(50, 100, 0xaaaaaa, 0x999999))
// go({ scene })

function updateUi() {
    const proj = position3dToScreen2d({
        x: mysprite.position.x,
        y: mysprite.position.y,
        z: mysprite.position.z,
        camera,
        canvasWidth: window.innerWidth,
        canvasHeight: window.innerHeight
    })
    const divElem = document.getElementById('overlay')
    divElem.style.left = proj.x + 'px'
    divElem.style.top = proj.y + 'px'

    // console.log(
    //     position3dToScreen2d({
    //         x: 100,
    //         y: 0,
    //         z: 100,
    //         camera,
    //         canvasWidth: window.innerWidth,
    //         canvasHeight: window.innerHeight
    //     })
    // )
}

// isoCamera.onChange = updateUi

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
