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
const armys = []

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

// RENDER FUNCTIONS
function onChangeZoom(zoom) {
    tiles.forEach(tile => tile.updateScaleDiv(zoom))
    armys.forEach(army => army.updateScaleDiv(zoom))
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
    armys.forEach(army =>
        army.updatePositionDiv({
            camera,
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight
        })
    )

    TWEEN.update(time)
}
onAnimationFrame()

// CREATING AND EXPOSING API
const API = createApi({
    tiles,
    armys,
    ui,
    camera,
    sceneSprites
})
if (typeof window != 'undefined') {
    window.API = API
}

// EXAMPLE USING API
// EXAMPLE USING API
const from = { col: 10, row: 5 }
window.village1 = API.createVillage(from)
window.village1.changeRecruitmentPower(25)
window.village1.addOwnerAsPlayer('ID1', 'Enzo', 1000)
window.village1.addOwnerAsEnemy('ID2', 'Agus', 234)
window.village1.addOwnerAsEnemy('ID3', 'Azaru', 312)
window.village1.removeOwner('ID3')

const to = { col: -50, row: -20 }
window.cottage1 = API.createCottage(to)
window.cottage1.changeRecruitmentPower(5)

window.army1 = API.createArmy({ from, to })
window.army1.changeUnits(200)
let percentage = 1
const int = setInterval(() => {
    percentage += 0.1
    window.army1.changeDistance(percentage)
    if (percentage >= 100) {
        clearInterval(int)
    }
}, 10)
// window.army1.changeDistance(1) //percentage
// window.army1.changeDistance(25) //percentage
// window.army1.changeDistance(50) //percentage
// window.army1.changeDistance(75) //percentage
// window.army1.changeDistance(99) //percentage
// EXAMPLE USING API
// EXAMPLE USING API

// HELPERS
// isoCamera.onChange = updateUi
// sceneSprites.add(new isoCamera.THREE.AxesHelper(10))
// sceneTerrain.add(new isoCamera.THREE.GridHelper(1000, 1000, 0xaaaaaa, 0x999999))
// go({ scene })
