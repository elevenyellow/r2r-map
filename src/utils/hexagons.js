// import * as THREE from 'three'

export function getPositionByCordinate({ col, row, size }) {
    const hor_distance = Math.sqrt(3) * size
    const ver_distance = (2 * size * 3) / 4
    return [
        row % 2 === 0
            ? col * hor_distance
            : col * hor_distance - hor_distance / 2,
        row * ver_distance
    ]
}

// function pointyHexagonalCorner(center_x, center_y, size, i) {
//     const angle_deg = 60 * i
//     const angle_rad = (Math.PI / 180) * angle_deg
//     return [
//         center_x + size * Math.cos(angle_rad),
//         center_y + size * Math.sin(angle_rad)
//     ]
// }

// function getHexagonPoints(size) {
//     const points = []
//     for (let i = 0; i < 6; ++i) {
//         points.push(pointyHexagonalCorner(0, 0, size, i))
//     }
//     return points
// }

// function createHexagon(size, color) {
//     const shape = new THREE.Shape()
//     const points = getHexagonPoints(size)
//     points.forEach((point, index) => {
//         index === 0
//             ? shape.moveTo(point[0], point[1])
//             : shape.lineTo(point[0], point[1])
//     })

//     // // LINE MATERIAL
//     // shape.autoClose = true;
//     // var points = shape.getPoints();
//     // var spacedPoints = shape.getSpacedPoints( 50 );
//     // var geometryPoints = new THREE.BufferGeometry().setFromPoints( points );
//     // var geometrySpacedPoints = new THREE.BufferGeometry().setFromPoints( spacedPoints );
//     // // var mesh = new THREE.Points( geometrySpacedPoints, new THREE.PointsMaterial( { color: color, size: 1 } ) );
//     // var mesh = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial( { color: color,
//     // 	linewidth: 20,
//     //  } ) );

//     const geometry = new THREE.ShapeGeometry(shape)
//     const material = new THREE.MeshBasicMaterial({ color: color })
//     // material.transparent = true
//     material.opacity = 0.2
//     const mesh = new THREE.Mesh(geometry, material)

//     mesh.position.y += 0.1
//     mesh.rotation.x = -Math.PI / 2
//     return mesh
// }

// function getPositionByCordinate(col, row, size) {
//     const hor_distance = Math.sqrt(3) * size
//     const ver_distance = (2 * size * 3) / 4
//     return [
//         row % 2 === 0
//             ? col * hor_distance
//             : col * hor_distance - hor_distance / 2,
//         row * ver_distance
//     ]
// }

// function createAndPlaceHexagon(col, row, size, color) {
//     const hexagon = createHexagon(size, color)
//     const position = getPositionByCordinate(col, row, size)
//     hexagon.position.x = position[1]
//     hexagon.position.z = -position[0]
//     return hexagon
// }

// export default function go({ scene, renderer }) {
//     const size = 3
//     scene.add(createAndPlaceHexagon(0, 0, size, 0xff00ff))

//     for (let i = 0; i < 6; ++i) {
//         // scene.add(createAndPlaceHexagon(i, 0, size, 0xff00ff))
//         // scene.add(createAndPlaceHexagon(i, 1, size, 0x2260ff))
//         // scene.add(createAndPlaceHexagon(i, 2, size, 0xa5026f))
//         // scene.add(createAndPlaceHexagon(i, 3, size, 0x026fff))
//         // scene.add(createAndPlaceHexagon(i, 4, size, 0xff00ff))
//         // scene.add(createAndPlaceHexagon(i, 5, size, 0x260f0ff))
//     }
// }
