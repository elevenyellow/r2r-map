import createThreeWorld from './three/createThreeWorld'
import createTerrain from './three/createTerrain'
import createApi from './api'
import OTHERS from './config/sprites/others'
import { GENERAL } from './config/parameters'
import TWEEN from '@tweenjs/tween.js'
import { ELEMENT_TYPE, LINE_ATTACK_ID, LINE_STATUS, DOM } from './const'
import { getMousePositionFromD3Event } from './utils'

// STATE
const state = { preparingAttack: false }

// GETTING DOM
const ui = document.getElementById(DOM.UI)
const canvas = document.getElementById(DOM.CANVAS)

// CREATING THREE WORLD
const {
    renderer,
    camera,
    sceneTerrain,
    sceneSprites,
    isoCamera
} = createThreeWorld({
    canvas,
    onStart,
    onChange,
    onEnd
})

// DISABLING ZOOM WHEN DOUBLE CLICK
isoCamera.view.on('dblclick.zoom', null)

// ADDING TERRAIN
const terrain = createTerrain({
    renderer,
    url: OTHERS.TERRAIN.url
})
sceneTerrain.add(terrain)

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
            if (element !== undefined) {
                const idFrom = element.troopOrTile.id
                if (shallWeStartAttack({ idFrom })) {
                    state.tilesHighLighting = getTilesToAttack({ idFrom })
                    state.preparingAttack = true
                    state.idAttackFrom = element.troopOrTile.id
                    API.createLine({
                        id: LINE_ATTACK_ID,
                        idTileFrom: element.troopOrTile.id
                    })
                    highlightTiles(state.tilesHighLighting)
                }
            }
        }
    }
}

function onChange(e) {
    if (typeof onChangeZoom == 'function' && e.transform.k !== state.zoom) {
        const oldZoom = state.zoom
        state.zoom = e.transform.k
        return onChangeZoom(e, state.zoom, oldZoom)
    } else {
        return onChangePan(e)
    }
}

function onChangePan(e) {
    if (API !== undefined) {
        onUnselect()
        if (state.preparingAttack) {
            const { mouseX, mouseY } = getMousePositionFromD3Event(event)
            const { element, x, z } = getInteractiveElementByMouseEvent({
                mouseX,
                mouseY
            })
            const idFrom = state.idAttackFrom
            if (
                element !== undefined &&
                shallWeAttack({
                    idFrom,
                    idTo: element.troopOrTile.id
                })
            ) {
                const idTile = element.troopOrTile.id
                state.idAttackTo = idTile
                unhighlightTiles(state.tilesHighLighting)
                API.highLightRed({ idTile })
                API.changeLineDirection({
                    idLine: LINE_ATTACK_ID,
                    x: element.troopOrTile.x,
                    z: element.troopOrTile.z,
                    status: LINE_STATUS.NORMAL
                })
            } else {
                state.idAttackTo = undefined
                highlightTiles(state.tilesHighLighting)
                API.changeLineDirection({
                    idLine: LINE_ATTACK_ID,
                    x,
                    z,
                    status: LINE_STATUS.INCORRECT
                })
            }
        }
    }
    return state.preparingAttack === false
}

function onChangeZoom(e, zoom, oldZoom) {
    // console.log(state, zoom, oldZoom)
    if (
        zoom !== oldZoom ||
        typeof state == 'undefined' ||
        state.preparingAttack === false
    ) {
        if (API !== undefined) {
            API.updateZoom({ zoom })
        }
        return true
    }
    return false
}

function onEnd(e) {
    if (state && state.preparingAttack) {
        API.removeLine({ idLine: LINE_ATTACK_ID })
        const idFrom = state.idAttackFrom
        const idTo = state.idAttackTo
        unhighlightTiles(state.tilesHighLighting)
        state.tilesHighLighting = []
        state.idAttackFrom = undefined
        state.idAttackTo = undefined
        state.preparingAttack = false
        if (idFrom !== undefined && idTo !== undefined) {
            onAttack({ idFrom, idTo })
        }
    }
    // console.log('onEnd')
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

// EXTERNAL API CALLS (DOP)
function shallWeStartAttack({ idFrom }) {
    const found = API.getTiles().find(tile => tile.id === idFrom)
    return found !== undefined && found.type === ELEMENT_TYPE.VILLAGE
}
function shallWeAttack({ idFrom, idTo }) {
    const found = API.getTiles().find(tile => tile.id === idTo)
    return found !== undefined && found.type === ELEMENT_TYPE.COTTAGE
}
function getTilesToAttack({ idFrom }) {
    return API.getTiles()
        .filter(tile => tile.type === ELEMENT_TYPE.COTTAGE)
        .map(tile => tile.id)
}
function onAttack({ idFrom, idTo }) {
    console.log({ idFrom, idTo })
}
function onSelect(id) {
    log.innerHTML = id // REMOVE THIS
}
function onUnselect() {
    log.innerHTML = '' // REMOVE THIS
}

// UTILS
function highlightTiles(tiles) {
    tiles.forEach(idTile => API.startHighlight({ idTile }))
}

function unhighlightTiles(tiles) {
    tiles.forEach(idTile => API.stopHighlight({ idTile }))
}

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
// API.removeOwner({ idTile: village1, idOwner: 'ID3' })

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

API.addDecorativeElements()

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
