import * as THREE from 'three'

export function position3dToScreen2d({
    object,
    camera,
    canvasWith,
    canvasHeight
}) {
    const vector = new THREE.Vector3()

    // TODO: need to update this when resize window
    const widthHalf = canvasWith / 2
    const heightHalf = canvasHeight / 2

    object.updateMatrixWorld()
    vector.setFromMatrixPosition(object.matrixWorld)
    vector.project(camera)

    vector.x = vector.x * widthHalf + widthHalf
    vector.y = -(vector.y * heightHalf) + heightHalf

    return {
        x: vector.x,
        y: vector.y
    }
}
