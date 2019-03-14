import { ELEMENT_TYPE } from '../const'
import { createArrowLine } from '../three/scenario'
import { ARROW } from '../config/sprites/indicator'

export default function createArrowFactory({ ui, scene, camera }) {
    return ({ id, fromX, fromZ }) => {
        const { arrows, tweens } = createArrowLine({
            scene,
            arrowConf: ARROW
        })
        return {
            id,
            type: ELEMENT_TYPE.ARROW,
            changePosition: ({ toX, toZ }) => {
                arrows.position.x = x
                arrows.position.z = z
                arrows.rotation.y = -Math.atan2(toZ - fromZ, toX - fromX)
            },
            destroy: () => {
                tweens.forEach(tween => tween.stop())
                scene.remove(arrows)
            }
        }
    }
}
