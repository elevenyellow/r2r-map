import * as THREE from 'three'
import * as d3 from './d3'
import ThreeIsoGameCamera from '/mnt/c/Users/enzo/drive/projects/three-iso-game-camera/'

export function createThreeWorld(canvas) {
    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
    })
    const camera = new THREE.PerspectiveCamera(
        10, // fov
        window.innerWidth / window.innerHeight, // aspect
        1, // near
        99999 // far
    )
    const isoCamera = new ThreeIsoGameCamera({
        angleV: 35,
        camera,
        renderer,
        THREE,
        d3
    })
    isoCamera.startRender(scene)

    return {
        renderer,
        scene,
        camera,
        isoCamera
    }
}
