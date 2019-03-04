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
const village1 = 'village1'
API.createVillage({ id: village1, col: 10, row: 5 })
API.changeRecruitmentPower(village1, 22)
API.addOwnerAsPlayer(village1, 'ID1', 'Enzo', 1000)
API.addOwnerAsEnemy(village1, 'ID2', 'Agus', 234)
API.addOwnerAsEnemy(village1, 'ID3', 'Azaru', 312)
API.removeOwner(village1, 'ID3')

const cottage1 = 'cottage1'
API.createCottage({ id: cottage1, col: 50, row: 20 })
API.changeRecruitmentPower(cottage1, 5)

const army1 = 'army1'
API.createArmy({ id: army1, fromTileId: village1, toTileId: cottage1 })
API.changeUnits(army1, 200)
let percentage = 0
const int = setInterval(() => {
    percentage += 0.1
    API.changeDistance(army1, percentage)
    if (percentage >= 100) {
        clearInterval(int)
    }
}, 10)
// EXAMPLE USING API
// EXAMPLE USING API

// HELPERS
// isoCamera.onChange = updateUi
// sceneSprites.add(new isoCamera.THREE.AxesHelper(10))
// sceneTerrain.add(new isoCamera.THREE.GridHelper(1000, 1000, 0xaaaaaa, 0x999999))
// go({ scene })
