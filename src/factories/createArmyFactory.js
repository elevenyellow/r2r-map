import { createSmartDiv } from '../ui'
import { createArmySprite } from '../three/scenario'
import { position3dToScreen2d } from '../three/utils'
import { VISUAL } from '../config/parameters'
import { RECRUITMENT_POWER_UI_ELEMENT } from '../config/ui'

export default function createArmyFactory({ ui, scene, camera }) {
    return ({ x, z, spriteConf }) => {
        const div = createSmartDiv({ container: ui })
        const sprite = createArmySprite({
            scene,
            x,
            z,
            spriteConf
        })
        return {
            div,
            sprite,
            updatePositionDiv: ({ canvasWidth, canvasHeight }) => {
                const proj = position3dToScreen2d({
                    x: sprite.position.x + spriteConf.offsetX,
                    y: sprite.position.y,
                    z: sprite.position.z + spriteConf.offsetZ,
                    camera,
                    canvasWidth,
                    canvasHeight
                })
                div.move(proj)
            },
            updateScaleDiv: zoom => {
                const scale = (zoom * 100) / 20
                const scaleReduced =
                    Math.round(
                        scale + (100 - scale) / VISUAL.RATIO_SCALE_DIV_WHEN_ZOOM
                    ) / 100
                // Changing  ZOOM
                div.scale(scaleReduced)
            }
        }
    }
}
