import createThreeWorld from './three/createThreeWorld'
import createTerrain from './three/createTerrain'
import createApi from './api'
import OTHERS from './config/sprites/others'
import { GENERAL } from './config/parameters'
import TWEEN from '@tweenjs/tween.js'
import { ELEMENT_TYPE, LINE_ATTACK_ID, LINE_STATUS } from './const'
import { getMousePositionFromD3Event } from './utils'

export default function init({ canvas, ui }) {
    // STATE
    const state = { preparingAttack: false }

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

    // CREATING AND API
    const API = createApi({
        ui,
        camera,
        sceneSprites,
        sceneTerrain,
        hexagonSize: GENERAL.HEXAGON_SIZE,
        initialZoom: state.zoom
    })
    // EXPOSING API
    // if (typeof window != 'undefined') {
    //     window.API = API
    // }

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
                        status: LINE_STATUS.CORRECT
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

    return API

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
}
