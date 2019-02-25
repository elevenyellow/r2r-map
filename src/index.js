import { createTerrain, createDecorativeSprite } from './three/scenario'
import { createThreeWorld } from './three/'
import createApi from './api'
import OTHERS from './config/sprites/others'
import { DOM } from './config/ui'
import TWEEN from '@tweenjs/tween.js'

// GETTING DOM
const ui = document.getElementById(DOM.UI)
const canvas = document.getElementById(DOM.CANVAS)

// STATE
const tiles = []

// CREATING THREE WORLD
const {
    renderer,
    camera,
    sceneTerrain,
    sceneSprites,
    isoCamera
    // zoom
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
    sceneSprites
})
window.API = API

// RENDER FUNCTIONS
function onChangeZoom(zoom) {
    tiles.forEach(tile => tile.updateScaleDiv(zoom))
}

function onAnimationFrame(time) {
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

    TWEEN.update(time)
}
onAnimationFrame()

// EXAMPLE USING API
// EXAMPLE USING API
window.village1 = API.createVillage({ col: 0, row: 0 })
window.village1.changeRecruitmentPower(25)
window.village1.addOwnerAsPlayer('ID1', 'Enzo', 1000)
window.village1.addOwnerAsEnemy('ID2', 'Agus', 234)
window.village1.addOwnerAsEnemy('ID3', 'Azaru', 312)
window.village1.removeOwner('ID3')

window.cottage1 = API.createCottage({ col: 20, row: 0 })
window.cottage1.changeRecruitmentPower(5)

window.army1 = API.createArmy({
    from: { col: 0, row: 0 },
    to: { col: 20, row: 20 },
    units: 20,
    distance: 50 //percentage
})
// EXAMPLE USING API
// EXAMPLE USING API

// HELPERS
// isoCamera.onChange = updateUi
sceneSprites.add(new isoCamera.THREE.AxesHelper(10))
// scene.add(new three.isoCamera.THREE.GridHelper(50, 100, 0xaaaaaa, 0x999999))
// go({ scene })
