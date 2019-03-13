import * as THREE from 'three'
import { createSmartDiv, createTroopsUnitsUiElement } from '../ui'
import { createTroopsSprite, createArrowLine } from '../three/scenario'
import { worldToScreen } from '../three/utils'
import { GENERAL } from '../config/parameters'
import { TROOPS_UNITS_UI_ELEMENT } from '../config/ui'

export default function createTroopsFactory({
    ui,
    sceneSprites,
    sceneTerrain,
    camera
}) {
    return ({ fromX, fromZ, toX, toZ, spriteConf, arrowConf }) => {
        const div = createSmartDiv({ container: ui })
        const sprite = createTroopsSprite({
            scene: sceneSprites,
            fromX,
            fromZ,
            spriteConf
        })
        const arrows = createArrowLine({
            scene: sceneTerrain,
            arrowConf
        })
        const units = createTroopsUnitsUiElement({
            className: TROOPS_UNITS_UI_ELEMENT
        })
        div.element.appendChild(units.element)

        const troops = {
            div,
            sprite,
            updatePositionDiv: ({ canvasWidth, canvasHeight }) => {
                const position = worldToScreen({
                    x: sprite.position.x + spriteConf.uiOffsetX,
                    y: sprite.position.y,
                    z: sprite.position.z + spriteConf.uiOffsetZ,
                    camera,
                    canvasWidth,
                    canvasHeight
                })
                div.move(position)
            },
            updateScaleDiv: (zoom, initialZoomm) => {
                // const scale = (zoom * 100) / GENERAL.ZOOM_ORIGINAL_K
                // const scaleReduced =
                //     Math.round(
                //         scale + (100 - scale) / GENERAL.ZOOM_RATIO_SCALE_DIV
                //     ) / 100
                // // Changing  ZOOM
                // div.scale(scaleReduced)
                div.scale(zoom / GENERAL.ZOOM_ORIGINAL_K)
            },
            changeUnits: value => {
                units.changeUnits(value)
            },
            changePosition: ({ x, z }) => {
                sprite.position.x = x
                sprite.position.z = z
                arrows.position.x = x
                arrows.position.z = z
            },
            changeArrowDirection: ({ fromX, fromZ, toX, toZ }) => {
                arrows.rotation.y = -Math.atan2(toZ - fromZ, toX - fromX)
            }
        }

        troops.changeArrowDirection({ fromX, fromZ, toX, toZ })
        return troops
    }
}
