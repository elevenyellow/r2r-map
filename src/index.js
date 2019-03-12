import { createTerrain } from './three/scenario'
import { createThreeWorld } from './three/'
import createApi from './api'
import OTHERS from './config/sprites/others'
import { GENERAL } from './config/parameters'
import { DOM } from './config/ui'
import TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'

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
    onChangeZoom,
    onChangePan
})

// ADDING TERRAIN
const terrain = createTerrain({
    scene: sceneTerrain,
    renderer,
    url: OTHERS.TERRAIN.url
})

// EVENTS FUNCTIONS
function onChangeZoom({ zoom }) {
    if (API !== undefined) {
        API.updateZoom(zoom)
        onUnselect()
    }
}

function onChangePan({ e }) {
    if (API !== undefined) {
        onUnselect()
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
    sceneTerrain,
    hexagonSize: GENERAL.HEXAGON_SIZE,
    initialZoom: zoom
})
if (typeof window != 'undefined') {
    window.API = API
}

// Capturing when user select a tile or troops
canvas.addEventListener('click', e => {
    const sprite = API.getSpriteSelected({
        mouseX: e.clientX,
        mouseY: e.clientY,
        camera,
        canvasWidth: window.innerWidth,
        canvasHeight: window.innerHeight,
        objects: [terrain]
    })

    sprite ? onSelect(sprite.troopOrTile.id) : onUnselect()
})

function onSelect(id) {
    log.innerHTML = id
}

function onUnselect() {
    log.innerHTML = ''
}

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
// API.addOwnerAsEnemy(village1, 'ID4', 'Roly', 562)
// API.addOwnerAsEnemy(village1, 'ID4', 'Selo', 315)
// API.addOwnerAsEnemy(village1, 'ID4', 'Pei', 200)
API.removeOwner(village1, 'ID3')

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
API.addOwnerAsPlayer(cottagename, 'ID1', 'Enzo', 200)
API.changeRecruitmentPower(cottagename, 95)

API.addDecorativeElements()

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

const log = document.createElement('div')
log.style.position = 'absolute'
log.style.fontSize = '100px'
ui.appendChild(log)
// EXAMPLE USING API
// EXAMPLE USING API
// EXAMPLE USING API
// EXAMPLE USING API
// EXAMPLE USING API
// EXAMPLE USING API

// HELPERS
// isoCamera.onChange = updateUi
sceneSprites.add(new isoCamera.THREE.AxesHelper(10))
// sceneTerrain.add(new isoCamera.THREE.GridHelper(1000, 1000, 0xaaaaaa, 0x999999))
// go({ scene })

// // LINES
// var geometry = new THREE.Geometry()
// var material = new THREE.LineDashedMaterial({
//     color: 0xffffff,
//     linewidth: 10,
//     dashSize: 1.0,
//     gapSize: 0.5
// }) //new THREE.LineBasicMaterial({ color: 0xFFFFFF, linewidth: 10 });

// geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(30, 0, 30))

// var line = new THREE.Line(geometry, material)
// line.computeLineDistances()
// sceneTerrain.add(line)
