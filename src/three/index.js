import * as THREE from 'three'
import * as d3 from './d3'
import ThreeIsoGameCamera from '/mnt/c/Users/enzo/drive/projects/three-iso-game-camera/'
import { textureLoader } from './utils'

export function createThreeWorld({
    canvas,
    onStart,
    onChangeZoom,
    onChangePan,
    onEnd
}) {
    const state = { preparingAttack: false }
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
                const oldZoom = state.zoom
                state.zoom = e.transform.k
                return onChangeZoom(e, state.zoom, oldZoom)
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

export function createTerrain({ renderer, scene, url }) {
    const geometry = new THREE.PlaneBufferGeometry(100, 100)
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()
    const textureLoaded = textureLoader.load(url)
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: textureLoaded
    })
    const mesh = new THREE.Mesh(geometry, material)

    textureLoaded.anisotropy = maxAnisotropy
    textureLoaded.wrapS = textureLoaded.wrapT = THREE.RepeatWrapping
    textureLoaded.repeat.set(512, 512)
    mesh.position.y -= 0.5
    mesh.rotation.x = -Math.PI / 2
    mesh.scale.set(200, 200, 200)
    scene.add(mesh)
    return mesh
}

// https://gamedev.stackexchange.com/questions/167762/how-to-avoid-the-cutoff-of-a-sprite-when-overlapping-in-a-terrain?noredirect=1#comment298081_167762
export function createBuildingSprite({ scene, spriteConf, x, z }) {
    const textureLoaded = textureLoader.load(spriteConf.url)
    const material = new THREE.SpriteMaterial({
        map: textureLoaded
        // depthTest: false
    })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(spriteConf.scale.x, spriteConf.scale.y, spriteConf.scale.z)
    sprite.position.x = x
    sprite.position.z = z
    scene.add(sprite)

    // const helper = new THREE.AxesHelper(10)
    // helper.position.x = x
    // helper.position.z = z
    // scene.add(helper)

    return sprite
}

export function createDecorativeSprite({ scene, spriteConf, x, z }) {
    const textureLoaded = textureLoader.load(spriteConf.url)
    const material = new THREE.SpriteMaterial({
        map: textureLoaded
    })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(spriteConf.scale.x, spriteConf.scale.y, spriteConf.scale.z)
    sprite.position.y = spriteConf.scale.y / 2
    sprite.position.x = x
    sprite.position.z = z
    scene.add(sprite)
    return sprite
}
