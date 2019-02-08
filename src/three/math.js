import * as THREE from 'three'

// https://stackoverflow.com/questions/27409074/converting-3d-position-to-2d-screen-position-r69
export function position3dToScreen2d({
    x,
    y,
    z,
    camera,
    canvasWidth,
    canvasHeight
}) {
    const vector = new THREE.Vector3(x, y, z)
    const widthHalf = canvasWidth / 2
    const heightHalf = canvasHeight / 2

    vector.project(camera)
    vector.x = vector.x * widthHalf + widthHalf
    vector.y = -(vector.y * heightHalf) + heightHalf

    return {
        x: Math.round(vector.x),
        y: Math.round(vector.y)
    }
}
