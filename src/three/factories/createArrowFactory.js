import * as THREE from 'three'
import { ELEMENT_TYPE } from '../../const'
import { ARROW } from '../../config/sprites/indicator'
import { svgLoader } from '../utils'

export default function createArrowFactory({ ui, scene, camera }) {
    return ({ id, fromX, fromZ }) => {
        const fromVector = new THREE.Vector2(fromX, fromZ)
        const { arrows, arrow, tweens } = createArrowLine()
        arrows.position.x = fromX
        arrows.position.z = fromZ
        scene.add(arrows)

        return {
            id,
            type: ELEMENT_TYPE.ARROW,
            changeDirection: ({ toX, toZ }) => {
                const toVector = new THREE.Vector2(toX, toZ)
                const distance = fromVector.distanceTo(toVector)
                arrows.rotation.y = -Math.atan2(toZ - fromZ, toX - fromX)
                arrows.children = []
                for (let i = 0; ARROW.separation * i < distance; i++) {
                    const arr = arrow.clone()
                    arr.position.x = ARROW.separation * i
                    arrows.add(arr)
                }
            },
            destroy: () => {
                tweens.forEach(tween => tween.stop())
                scene.remove(arrows)
            }
        }
    }
}

function createArrowLine() {
    const arrows = new THREE.Group()
    const arrow = new THREE.Group()
    const tweens = []

    svgLoader.load(ARROW.url, paths => {
        arrow.scale.set(ARROW.scale.x, ARROW.scale.y, ARROW.scale.z)
        // arrow.position.y = 0.1
        arrow.position.x += ARROW.offsetX
        arrow.position.z += ARROW.offsetZ
        arrow.rotation.x = -Math.PI / 2
        // arrow.position.x += ARROW.separation * 2
        // arrows.add(arrow)

        for (let i = 0; i < paths.length; i++) {
            const path = paths[i]
            const material = new THREE.MeshBasicMaterial({
                color: path.color,
                side: THREE.DoubleSide,
                depthWrite: false,
                transparent: true
            })
            const shapes = path.toShapes(true)
            for (let j = 0; j < shapes.length; j++) {
                const shape = shapes[j]
                const geometry = new THREE.ShapeBufferGeometry(shape)
                const mesh = new THREE.Mesh(geometry, material)
                arrow.add(mesh)
            }
        }

        // const quantity = 10
        // for (let i = 0; i < quantity; i++) {
        //     const arr = arrow.clone()
        //     const origin = arr.position.x
        //     const destiny = origin + ARROW.separation * quantity
        //     const time = ARROW.time
        //     const delay = time / quantity
        //     arr.children[0].material = arrow.children[0].material.clone()
        //     // arr.position.x = origin
        //     arr.position.x = ARROW.separation * i
        //     arrows.add(arr)

        //     // const tween = new TWEEN.Tween({ x: origin, opacity: 1 })
        //     //     .to({ x: destiny, opacity: 0.2 }, time)
        //     //     // .easing(TWEEN.Easing.Quadratic.InOut)
        //     //     .repeat(Infinity)
        //     //     .delay(delay * i)
        //     //     .repeatDelay(0)
        //     //     .onUpdate(o => {
        //     //         arr.position.x = o.x
        //     //         arr.children[0].material.opacity = o.opacity
        //     //     })
        //     //     .start() // Start the tween immediately.

        //     // tweens.push(tween)
        // }
    })

    return { arrows, arrow, tweens }
}
