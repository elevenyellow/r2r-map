import * as THREE from 'three'
import { ELEMENT_TYPE, LINE_STATUS } from '../const'
import { LINE } from '../config/sprites/others'
import { textureLoader } from './utils'

export default function LineFactory({ scene }) {
    return ({ id, fromX, fromZ }) => {
        const width = 1
        const height = LINE.height
        const geometry = new THREE.PlaneBufferGeometry(width, height)
        const textureInactive = textureLoader.load(LINE.url)
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: textureInactive,
            transparent: true
        })
        const mesh = new THREE.Mesh(geometry, material)
        textureInactive.repeat.set(LINE.repeatX, LINE.repeatY)
        textureInactive.wrapS = textureInactive.wrapT = THREE.RepeatWrapping
        mesh.rotation.x = -Math.PI / 2
        mesh.position.x = width / 2

        const line = new THREE.Group()
        line.add(mesh)

        const fromVector = new THREE.Vector2(fromX, fromZ)
        line.position.x = fromX
        line.position.z += fromZ
        scene.add(line)

        let tweenOffSet = 0
        const tween = setInterval(() => {
            textureInactive.offset.x -= tweenOffSet
        }, 10)

        return {
            id,
            type: ELEMENT_TYPE.LINE,
            changeDirection: ({ toX, toZ, status }) => {
                const toVector = new THREE.Vector2(toX, toZ)
                const distance = fromVector.distanceTo(toVector)
                const scaleFactorX = distance / mesh.geometry.parameters.width
                line.scale.set(scaleFactorX, 1, 1)
                textureInactive.repeat.set(distance / 2, 1)
                line.rotation.y = -Math.atan2(toZ - fromZ, toX - fromX)

                if (status === LINE_STATUS.CORRECT) {
                    tweenOffSet = 0.015
                    material.opacity = 1
                    // material.color = new THREE.Color(1, 1, 1)
                } else {
                    tweenOffSet = 0
                    material.opacity = 0.6
                    // material.color = new THREE.Color(0xff9955)
                }
            },
            destroy: () => {
                clearInterval(tween)
                scene.remove(line)
            }
        }
    }
}
