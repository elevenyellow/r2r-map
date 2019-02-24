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
    sceneSprites
    // isoCamera,
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

window.village1 = API.createVillage({ col: 0, row: 0 })
window.village1.changeRecruitmentPower(25)
window.village1.addOwnerAsPlayer('ID1', 'Enzo', 1000)
window.village1.addOwnerAsEnemy('ID2', 'Agus', 234)
window.village1.addOwnerAsEnemy('ID3', 'Azaru', 312)
window.village1.removeOwner('ID3')

window.cottage1 = API.createCottage({ col: 15, row: 15 })
window.cottage1.changeRecruitmentPower(5)
