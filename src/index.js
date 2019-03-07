import { createTerrain, createDecorativeSprite } from './three/scenario'
import { createThreeWorld } from './three/'
import createApi from './api'
import OTHERS from './config/sprites/others'
import { GENERAL } from './config/parameters'
import { DOM } from './config/ui'
import TWEEN from '@tweenjs/tween.js'

// GETTING DOM
const ui = document.getElementById(DOM.UI)
const canvas = document.getElementById(DOM.CANVAS)

// CREATING THREE WORLD
const {
    renderer,
    camera,
    sceneTerrain,
    sceneSprites,
    isoCamera,
    zoom
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

// EVENTS FUNCTIONS
function onChangeZoom(zoom) {
    if (API !== undefined) {
        API.updateZoom(zoom)
    }
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
    if (API !== undefined) {
        API.updatePan({
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight
        })
    }

    TWEEN.update(time)
}
onAnimationFrame()

// CREATING AND EXPOSING API
const API = createApi({
    ui,
    camera,
    sceneSprites,
    hexagonSize: GENERAL.HEXAGON_SIZE,
    initialZoom: zoom
})
if (typeof window != 'undefined') {
    window.API = API
}

// // Capturing when user select a tile or an troops
// canvas.addEventListener('click', e => {
//     const x = e.clientX
//     const y = e.clientY
//     canvasWidth, canvasHeight
//     const intersections = screenToWorld({
//         x,
//         y,
//         camera,
//         canvasWidth: window.innerWidth,
//         canvasHeight: window.innerHeight,
//         objects: sceneTerrain.children
//     })
//     intersections.forEach(i => console.log(i.point))
// })

// EXAMPLE USING API
// EXAMPLE USING API
// EXAMPLE USING API
// EXAMPLE USING API
// EXAMPLE USING API
// EXAMPLE USING API
// EXAMPLE USING API
// EXAMPLE USING API
const village1 = 'village1'
API.createVillage({ id: village1, col: 0, row: 0 })
API.changeRecruitmentPower(village1, 22)
API.addOwnerAsPlayer(village1, 'ID1', 'Enzo', 1000)
API.addOwnerAsEnemy(village1, 'ID2', 'Agus', 234)
API.addOwnerAsEnemy(village1, 'ID3', 'Azaru', 312)
// API.removeOwner(village1, 'ID3')

const cottage1 = 'cottage1'
API.createCottage({ id: cottage1, col: 0, row: 1 })
API.changeRecruitmentPower(cottage1, 1)
API.addOwnerAsEnemy(cottage1, 'ID2', 'Agus', 234)

let cottagename = 'cottage2'
API.createCottage({ id: cottagename, col: 1, row: 0 })
API.changeRecruitmentPower(cottagename, 7)
API.addOwnerAsEnemy(cottagename, 'ID2', 'Agus', 234)
cottagename = 'cottage3'
API.createCottage({ id: cottagename, col: 1, row: 1 })
API.changeRecruitmentPower(cottagename, 52)
cottagename = 'cottag4'
API.createCottage({ id: cottagename, col: 0, row: -1 })
API.changeRecruitmentPower(cottagename, 4)
cottagename = 'cottag5'
API.createCottage({ id: cottagename, col: -1, row: 0 })
API.changeRecruitmentPower(cottagename, 3)
cottagename = 'cottag6'
API.createVillage({ id: cottagename, col: -1, row: -1 })
API.changeRecruitmentPower(cottagename, 2)
cottagename = 'cottag61'
API.createVillage({ id: cottagename, col: 1, row: -1 })
API.changeRecruitmentPower(cottagename, 6)
cottagename = 'cottag631'
API.createVillage({ id: cottagename, col: -1, row: 1 })
API.changeRecruitmentPower(cottagename, 95)

const troops1 = 'troops1'
API.createTroops({ id: troops1, fromTileId: 'cottage3', toTileId: 'village1' })
API.changeUnits(troops1, 200)
let percentage = 0
const int = setInterval(() => {
    percentage += 0.1
    API.changeDistance(troops1, percentage)
    if (percentage >= 100) {
        clearInterval(int)
    }
}, 10)
// EXAMPLE USING API
// EXAMPLE USING API
// EXAMPLE USING API
// EXAMPLE USING API
// EXAMPLE USING API
// EXAMPLE USING API

// HELPERS
// isoCamera.onChange = updateUi
// sceneSprites.add(new isoCamera.THREE.AxesHelper(10))
// sceneTerrain.add(new isoCamera.THREE.GridHelper(1000, 1000, 0xaaaaaa, 0x999999))
// go({ scene })
