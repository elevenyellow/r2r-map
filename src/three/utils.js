import * as THREE from 'three'
import { randomInt } from '../utils/index'
import TWEEN from '@tweenjs/tween.js'
import SVGLoader from './SVGLoader'

export const textureLoader = new THREE.TextureLoader()
export const svgLoader = new SVGLoader()

// https://stackoverflow.com/questions/27409074/converting-3d-position-to-2d-screen-position-r69
export function worldToScreen({ x, y, z, camera, canvasWidth, canvasHeight }) {
    const vector = new THREE.Vector3(x, y, z)
    const widthHalf = canvasWidth / 2
    const heightHalf = canvasHeight / 2

    vector.project(camera)
    const newX = vector.x * widthHalf + widthHalf
    const newY = -(vector.y * heightHalf) + heightHalf

    return { x: newX, y: newY }
}

// https://stackoverflow.com/questions/34660063/threejs-converting-from-screen-2d-coordinate-to-world-3d-coordinate-on-the-cane
export function screenToWorld({
    x,
    y,
    camera,
    canvasWidth,
    canvasHeight,
    objects
}) {
    const mouse = new THREE.Vector3(
        (x / canvasWidth) * 2 - 1, //x
        -(y / canvasHeight) * 2 + 1, //y
        0.5
    )

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(objects)

    return intersects
}

export function generateRandomDecorativeSprites({
    sprites,
    point1,
    point2,
    quantity,
    ignoreAreas,
    separation = 100
}) {
    const ignorePoints = {}
    ignoreAreas.forEach(area => {
        let x1 = area.x - area.radius
        let x2 = area.x + area.radius
        let z2 = area.z + area.radius
        for (; x1 <= x2; x1++) {
            for (let z1 = area.z - area.radius; z1 <= z2; z1++) {
                ignorePoints[`${x1}.${z1}`] = true
            }
        }
    })

    const spriteIndex = []
    sprites.forEach((sprite, index) => {
        const repeats = Array(sprite.frecuencyRatio).fill(index)
        spriteIndex.push.apply(spriteIndex, repeats)
    })

    const repeated = {}
    const result = []
    const point1x = point1.x * separation
    const point2x = point2.x * separation
    const point1z = point1.z * separation
    const point2z = point2.z * separation
    while (result.length < quantity) {
        const randomX = randomInt(point1x, point2x) / separation
        const randomZ = randomInt(point1z, point2z) / separation
        const key = `${Math.round(randomX)}.${Math.round(randomZ)}`
        if (repeated[key] === undefined && ignorePoints[key] === undefined) {
            const randomIndex = randomInt(0, spriteIndex.length)
            repeated[key] = true
            result.push({
                id: sprites[spriteIndex[randomIndex]].id,
                x: randomX,
                z: randomZ
            })
        }
    }
    return result
}
