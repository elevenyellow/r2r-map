import * as THREE from 'three'
import { ELEMENT_TYPE } from '../../const'
import { ARROW } from '../../config/sprites/indicator'
import { svgLoader } from '../utils'

export default function createArrowFactory({ ui, scene, camera }) {
    return ({ id, fromX, fromZ }) => {
        const { arrows, tweens } = createArrowLine({
            scene,
            arrowConf: ARROW
        })
        arrows.position.x = fromX
        arrows.position.z = fromZ
        scene.add(arrows)

        return {
            id,
            type: ELEMENT_TYPE.ARROW,
            changeDirection: ({ toX, toZ }) => {
                arrows.rotation.y = -Math.atan2(toZ - fromZ, toX - fromX)
                console.log(arrows)
            },
            destroy: () => {
                tweens.forEach(tween => tween.stop())
                scene.remove(arrows)
            }
        }
    }
}

export function createArrowLine({ arrowConf }) {
    const arrows = new THREE.Group()
    const arrow = new THREE.Group()
    const tweens = []

    svgLoader.load(arrowConf.url, paths => {
        arrow.scale.set(arrowConf.scale.x, arrowConf.scale.y, arrowConf.scale.z)
        // arrow.position.y = 0.1
        arrow.position.x += arrowConf.offsetX
        arrow.position.z += arrowConf.offsetZ
        arrow.rotation.x = -Math.PI / 2
        // arrow.position.x += arrowConf.separation * 2
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
        //     const destiny = origin + arrowConf.separation * quantity
        //     const time = arrowConf.time
        //     const delay = time / quantity
        //     arr.children[0].material = arrow.children[0].material.clone()
        //     // arr.position.x = origin
        //     arr.position.x = arrowConf.separation * i
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
