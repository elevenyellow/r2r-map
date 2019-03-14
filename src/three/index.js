import * as THREE from 'three'
import * as d3 from './d3'
import ThreeIsoGameCamera from '/mnt/c/Users/enzo/drive/projects/three-iso-game-camera/'

export function createThreeWorld({
    canvas,
    onStart,
    onChangeZoom,
    onChangePan,
    onEnd
}) {
    const state = {}
    const canvasWidth = window.innerWidth
    const canvasHeight = window.innerHeight
    const sceneTerrain = new THREE.Scene()
    const sceneSprites = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
    })
    const camera = new THREE.PerspectiveCamera(
        2, // fov
        canvasWidth / canvasHeight, // aspect
        1, // near
        99999 // far
    )
    const distance = 1000
    const isoCamera = new ThreeIsoGameCamera({
        angleH: 45,
        angleV: 35,
        distance,
        distanceMin: distance,
        distanceMax: distance * 3,
        camera,
        domElement: canvas,
        canvasWidth,
        canvasHeight,
        THREE,
        d3,
        onStart,
        onEnd,
        onChange: e => {
            if (
                typeof onChangeZoom == 'function' &&
                e.transform.k !== state.zoom
            ) {
                state.zoom = e.transform.k
                return onChangeZoom(e, state.zoom)
            } else {
                return onChangePan(e)
            }
        }
    })

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(canvasWidth, canvasHeight)

    //
    //
    //
    // onresize
    window.addEventListener('resize', e => {
        const canvasWidth = window.innerWidth
        const canvasHeight = window.innerHeight
        isoCamera.canvasWidth = canvasWidth
        isoCamera.canvasHeight = canvasHeight
        isoCamera.updateCameraPosition()
        renderer.setSize(canvasWidth, canvasHeight)
        camera.aspect = canvasWidth / canvasHeight
        camera.updateProjectionMatrix()
    })

    return {
        renderer,
        sceneTerrain,
        sceneSprites,
        camera,
        isoCamera,
        state
    }
}
