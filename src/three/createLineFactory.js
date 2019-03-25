import * as THREE from 'three'
import { ELEMENT_TYPE, LINE_STATUS } from '../const'
import { LINE } from '../config/sprites/others'
import { textureLoader } from './utils'

export default function createLineFactory({ ui, scene, camera }) {
    return ({ id, fromX, fromZ }) => {
        const fromVector = new THREE.Vector2(fromX, fromZ)
        const { line, textureLoaded } = createLineLine()
        line.position.x = fromX
        line.position.z += fromZ
        scene.add(line)

        return {
            id,
            type: ELEMENT_TYPE.LINE,
            changeDirection: ({ toX, toZ, status }) => {
                const toVector = new THREE.Vector2(toX, toZ)
                const distance = fromVector.distanceTo(toVector)
                console.log(distance, line.geometry.parameters.height)
                const scaleFactorY = distance / line.geometry.parameters.height
                line.scale.set(1, scaleFactorY, 1)
                textureLoaded.textureLoaded.repeat.set(distance, 5)

                // line.rotation.y = -Math.atan2(toZ - fromZ, toX - fromX)
                // line.children = []
                // const material1 = line.children[0].material
                // const material2 = material1.clone()
                // material2.color = new THREE.Color(0x22a8d6)
                // const material3 = material1.clone()
                // material3.color = new THREE.Color(0xffffff)
                // material3.opacity = new THREE.Color(0.7)
                // if (line.children.length > 0) {
                //     if (status === LINE_STATUS.INCORRECT) {
                //         // line.children[0].material.color = new THREE.Color(0xffffff)
                //         line.children[0].material.opacity = 0.5
                //     } else {
                //         // line.children[0].material.color = new THREE.Color(0x22a8d6)
                //         line.children[0].material.opacity = 1
                //     }
                // }
                // for (let i = 0; LINE.separation * i < distance; i++) {
                //     const arr = line.clone()
                //     arr.position.x = LINE.separation * i
                //     line.add(arr)
                // }
            },
            destroy: () => {
                // tweens.forEach(tween => tween.stop())
                scene.remove(line)
            }
        }
    }
}

function createLineLine() {
    const width = 0.3
    const height = 10
    const geometry = new THREE.PlaneBufferGeometry(width, height)
    const textureLoaded = textureLoader.load(LINE.url)
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: textureLoaded
    })
    const line = new THREE.Mesh(geometry, material)
    textureLoaded.repeat.set(10, 5)
    textureLoaded.wrapS = textureLoaded.wrapT = THREE.RepeatWrapping

    material.map.minFilter = THREE.LinearFilter //THREE.LinearMipMapNearestFilter
    line.rotation.x = -Math.PI / 2
    line.position.z = height / 2

    setInterval(() => {
        textureLoaded.offset.y += 0.015
    }, 10)
    return { line, textureLoaded }

    // const line = new THREE.Group()
    // const line = new THREE.Group()
    // const tweens = []

    // svgLoader.load(LINE.url, paths => {
    //     line.scale.set(LINE.scale.x, LINE.scale.y, LINE.scale.z)
    //     // line.position.y = 0.1
    //     line.position.x += LINE.offsetX
    //     line.position.z += LINE.offsetZ
    //     line.rotation.x = -Math.PI / 2
    //     // line.position.x += LINE.separation * 2
    //     // line.add(line)

    //     for (let i = 0; i < paths.length; i++) {
    //         const path = paths[i]
    //         const material = new THREE.MeshBasicMaterial({
    //             color: path.color,
    //             // side: THREE.DoubleSide
    //             // depthWrite: false,
    //             transparent: true
    //         })
    //         const shapes = path.toShapes(true)
    //         for (let j = 0; j < shapes.length; j++) {
    //             const shape = shapes[j]
    //             const geometry = new THREE.ShapeBufferGeometry(shape)
    //             const mesh = new THREE.Mesh(geometry, material)
    //             line.add(mesh)
    //         }
    //     }

    //     // const quantity = 10
    //     // for (let i = 0; i < quantity; i++) {
    //     //     const arr = line.clone()
    //     //     const origin = arr.position.x
    //     //     const destiny = origin + LINE.separation * quantity
    //     //     const time = LINE.time
    //     //     const delay = time / quantity
    //     //     arr.children[0].material = line.children[0].material.clone()
    //     //     // arr.position.x = origin
    //     //     arr.position.x = LINE.separation * i
    //     //     line.add(arr)

    //     //     // tweens.push(tween)
    //     // }
    // })

    return { line, line, tweens }
}
