import * as THREE from 'three'
import { createSmartDiv, createTroopsUnitsUiElement } from '../ui'
import { worldToScreen, textureLoader } from './utils'
import { GENERAL } from '../config/parameters'
import { ELEMENT_TYPE, TROOPS_UNITS_UI_ELEMENT } from '../const'

export default function createTroopsFactory({ ui, sceneSprites, camera }) {
    return ({ id, fromX, fromZ, toX, toZ, spriteConf }) => {
        const div = createSmartDiv({ container: ui })
        const sprite = createTroopsSprite({
            scene: sceneSprites,
            fromX,
            fromZ,
            spriteConf
        })

        const units = createTroopsUnitsUiElement({
            className: TROOPS_UNITS_UI_ELEMENT
        })
        div.element.appendChild(units.element)

        const troops = {
            id,
            type: ELEMENT_TYPE.TROOPS,
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
            changePosition: ({ x, z }) => {
                sprite.position.x = x
                sprite.position.z = z
            },
            changeUnits: value => {
                units.changeUnits(value)
            },
            destroy: () => {
                sceneSprites.remove(sprite)
                div.destroy()
            }
        }

        return troops
    }
}

export function createTroopsSprite({ scene, spriteConf, fromX, fromZ }) {
    const textureLoaded = textureLoader.load(spriteConf.url)
    const material = new THREE.SpriteMaterial({
        map: textureLoaded
    })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(spriteConf.scale.x, spriteConf.scale.y, spriteConf.scale.z)
    sprite.position.x = fromX
    sprite.position.z = fromZ
    scene.add(sprite)
    return sprite
}
