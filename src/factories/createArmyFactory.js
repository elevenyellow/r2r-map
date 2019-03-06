import { createSmartDiv, createArmyUnitsUiElement } from '../ui'
import { createArmySprite } from '../three/scenario'
import { position3dToScreen2d } from '../three/utils'
import { GENERAL } from '../config/parameters'
import { ARMY_UNITS_UI_ELEMENT } from '../config/ui'

export default function createArmyFactory({ ui, scene, camera }) {
    return ({ x, z, spriteConf }) => {
        const div = createSmartDiv({ container: ui })
        const sprite = createArmySprite({
            scene,
            x,
            z,
            spriteConf
        })
        const units = createArmyUnitsUiElement({
            className: ARMY_UNITS_UI_ELEMENT
        })
        div.element.appendChild(units.element)
        return {
            div,
            sprite,
            updatePositionDiv: ({ canvasWidth, canvasHeight }) => {
                const proj = position3dToScreen2d({
                    x: sprite.position.x + spriteConf.uiOffsetX,
                    y: sprite.position.y,
                    z: sprite.position.z + spriteConf.uiOffsetZ,
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
                        scale +
                            (100 - scale) / GENERAL.RATIO_SCALE_DIV_WHEN_ZOOM
                    ) / 100
                // Changing  ZOOM
                div.scale(scaleReduced)
            },
            changeUnits: value => {
                units.changeUnits(value)
            },
            changePosition: ({ x, z }) => {
                sprite.position.x = x
                sprite.position.z = z
            }
        }
    }
}
