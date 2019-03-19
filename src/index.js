import { createThreeWorld, createTerrain } from './three/'
import createApi from './api'
import OTHERS from './config/sprites/others'
import { GENERAL } from './config/parameters'
import { DOM } from './config/ui'
import TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
import { ELEMENT_TYPE } from './const'
import { getMousePositionFromD3Event } from './utils'

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
    state
} = createThreeWorld({
    canvas,
    onStart,
    onChangeZoom,
    onChangePan,
    onEnd
})

// DISABLING ZOOM WHEN DOUBLE CLICK
isoCamera.view.on('dblclick.zoom', null)

// ADDING TERRAIN
const terrain = createTerrain({
    scene: sceneTerrain,
    renderer,
    url: OTHERS.TERRAIN.url
})

function getInteractiveElementByMouseEvent({ mouseX, mouseY }) {
    const { x, z } = API.getWorldPositionFromMouse({
        mouseX,
        mouseY,
        camera,
        canvasWidth: window.innerWidth,
        canvasHeight: window.innerHeight,
        objects: [terrain]
    })
    const element = API.selectInteractiveSprite({
        x,
        z
    })
    return { element, x, z }
}

// EVENTS FUNCTIONS
function onStart(e) {
    const event = e.sourceEvent
    if (API !== undefined && event) {
        const { mouseX, mouseY } = getMousePositionFromD3Event(event)
        if (mouseX !== undefined) {
            const { element } = getInteractiveElementByMouseEvent({
                mouseX,
                mouseY
            })
            if (element && element.type === ELEMENT_TYPE.TILE) {
                state.arrowAttack = 'ARROWATTACK'
                API.createArrow({
                    id: state.arrowAttack,
                    idTileFrom: element.troopOrTile.id
                })
            }
        }
    }
}

function onEnd(e) {
    if (state && state.arrowAttack) {
        API.removeArrow({ idArrow: state.arrowAttack })
        delete state.arrowAttack
    }
    // console.log('onEnd')
}

function onChangePan(e) {
    const idArrow = state.arrowAttack
    if (API !== undefined) {
        onUnselect()
        if (idArrow) {
            const { mouseX, mouseY } = getMousePositionFromD3Event(event)
            const { element, x, z } = getInteractiveElementByMouseEvent({
                mouseX,
                mouseY
            })
            if (element && element.type === ELEMENT_TYPE.TILE)
                API.changeArrowDirection({
                    idArrow,
                    x: element.troopOrTile.x,
                    z: element.troopOrTile.z
                })
            else API.changeArrowDirection({ idArrow, x, z })
        }
    }
    return idArrow === undefined
}

function onChangeZoom(e, zoom, oldZoom) {
    // console.log(state, zoom, oldZoom)
    if (
        // zoom !== oldZoom ||
        typeof state == 'undefined' ||
        state.arrowAttack === undefined
    ) {
        if (API !== undefined) {
            API.updateZoom({ zoom })
        }
        return true
    }
    return false
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
    initialZoom: state.zoom
})
if (typeof window != 'undefined') {
    window.API = API
}

// Capturing when user select a tile or troops
canvas.addEventListener('click', e => {
    const { element } = getInteractiveElementByMouseEvent({
        mouseX: e.clientX,
        mouseY: e.clientY
    })
    element ? onSelect(element.troopOrTile.id) : onUnselect()
})

function onSelect(id) {
    log.innerHTML = id // REMOVE THIS
}

function onUnselect() {
    log.innerHTML = '' // REMOVE THIS
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
API.changeRecruitmentPower({ idTile: village1, power: 22 })
API.addOwnerAsPlayer({
    idTile: village1,
    idOwner: 'ID1',
    name: 'Enzo',
    units: 1000
})
API.addOwnerAsEnemy({
    idTile: village1,
    idOwner: 'ID2',
    name: 'Agus',
    units: 234
})
API.addOwnerAsEnemy({
    idTile: village1,
    idOwner: 'ID3',
    name: 'Azaru',
    units: 312
})
// API.addOwnerAsEnemy({idTile:village1, idOwner:'ID4', name:'Roly', units:562})
// API.addOwnerAsEnemy({idTile:village1, idOwner:'ID4', name:'Selo', units:315})
// API.addOwnerAsEnemy({idTile:village1, idOwner:'ID4', name:'Pei', units:200})
API.removeOwner({ idTile: village1, idOwner: 'ID3' })

const cottage1 = 'cottage1'
API.createCottage({ id: cottage1, col: 0, row: 1 })
API.changeRecruitmentPower({ idTile: cottage1, power: 1 })
API.addOwnerAsEnemy({
    idTile: cottage1,
    idOwner: 'ID2',
    name: 'Agus',
    units: 234
})

let cottagename = 'cottage2'
API.createCottage({ id: cottagename, col: 1, row: 0 })
API.changeRecruitmentPower({ idTile: cottagename, power: 7 })
API.addOwnerAsEnemy({
    idTile: cottagename,
    idOwner: 'ID2',
    name: 'Agus',
    units: 234
})
API.changeUnits({ idTile: cottagename, idOwner: 'ID2', units: 48 })
cottagename = 'cottage3'
API.createCottage({ id: cottagename, col: 1, row: 1 })
API.changeRecruitmentPower({ idTile: cottagename, power: 52 })
cottagename = 'cottage4'
API.createCottage({ id: cottagename, col: 0, row: -1 })
API.changeRecruitmentPower({ idTile: cottagename, power: 4 })
cottagename = 'cottage5'
API.createCottage({ id: cottagename, col: -1, row: 0 })
API.changeRecruitmentPower({ idTile: cottagename, power: 3 })
cottagename = 'cottage6'
API.createVillage({ id: cottagename, col: -1, row: -1 })
API.changeRecruitmentPower({ idTile: cottagename, power: 2 })
cottagename = 'cottage61'
API.createVillage({ id: cottagename, col: 1, row: -1 })
API.changeRecruitmentPower({ idTile: cottagename, power: 6 })
cottagename = 'cottage631'
API.createVillage({ id: cottagename, col: -1, row: 1 })
API.addOwnerAsPlayer({
    idTile: cottagename,
    idOwner: 'ID1',
    name: 'Enzo',
    units: 200
})
API.changeRecruitmentPower({ idTile: cottagename, power: 95 })

API.addDecorativeElements()

let troops = 'troops'
API.createTroops({ id: troops, fromTileId: 'cottage4', toTileId: 'cottage5' })
API.changeTroopsUnits({ idTroops: troops, units: 200 })
API.changeTroopsDistance({ idTroops: 'troops', distance: 50 })

troops = 'troops2'
API.createTroops({ id: troops, fromTileId: 'village1', toTileId: 'cottage2' })
API.changeTroopsUnits({ idTroops: troops, units: 99 })
API.changeTroopsDistance({ idTroops: troops, distance: 50 })
let percentage = 0
const int = setInterval(() => {
    percentage += 0.1
    API.changeTroopsDistance({ idTroops: troops, distance: percentage })
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
// const axes = new isoCamera.THREE.AxesHelper(10)
// axes.position.x = 0
// axes.position.z = 0
// sceneSprites.add(axes)
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
