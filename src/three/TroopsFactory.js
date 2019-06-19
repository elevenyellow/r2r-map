import * as THREE from 'three'
import { ELEMENT_TYPE } from 'runandrisk-common/const'
import { SmartDiv, TroopsUnitsUiElement } from '../ui'
import { worldToScreen, textureLoader, SpriteManager } from './utils'
import { GENERAL } from '../config/parameters'
import { TROOPS_UNITS_UI_ELEMENT } from '../const'

export default function TroopsFactory({ ui, sceneSprites, camera }) {
    return ({ id, fromX, fromZ, toX, toZ, spriteConf }) => {
        const div = SmartDiv({ container: ui })
        const { sprite, spriteManager } = createTroopsSprite({
            scene: sceneSprites,
            fromX,
            fromZ,
            spriteConf
        })

        const units = TroopsUnitsUiElement({
            className: TROOPS_UNITS_UI_ELEMENT
        })
        div.element.appendChild(units.element)

        const troops = {
            id,
            type: ELEMENT_TYPE.TROOPS,
            div,
            sprite,
            spriteManager,
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
    const spriteManager = SpriteManager()
    const textureLoaded = textureLoader.load(
        'https://i.ibb.co/5LyxShK/spritesheet-1.png'
    ) //spriteConf.urlFront
    const sprite = spriteManager.ActionSprite(textureLoaded, 1, 31, 31, 25)

    sprite.position.x = fromX
    sprite.position.z = fromZ
    sprite.scale.set(spriteConf.scale.x, spriteConf.scale.y, spriteConf.scale.z)
    scene.add(sprite)
    return { sprite, spriteManager }

    // const textureLoaded = textureLoader.load(spriteConf.url)
    // const material = new THREE.SpriteMaterial({
    //     map: textureLoaded
    // })
    // const sprite = new THREE.Sprite(material)
    // sprite.scale.set(spriteConf.scale.x, spriteConf.scale.y, spriteConf.scale.z)
    // sprite.position.x = fromX
    // sprite.position.z = fromZ
    // scene.add(sprite)
    // return sprite
}
