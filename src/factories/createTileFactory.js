import TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'

import {
    createSmartDiv,
    createOwnerUiElement,
    createRecruitmentPowerUiElement
} from '../ui'
import { createBuildingSprite } from '../three/scenario'
import { worldToScreen } from '../three/utils'
import { GENERAL } from '../config/parameters'
import { RECRUITMENT_POWER_UI_ELEMENT } from '../config/ui'
import { ELEMENT_TYPE } from '../const'

export default function createTileFactory({ ui, scene, camera }) {
    return ({ id, area, x, z, spriteConf }) => {
        let tweenHighlight
        const owners = {}
        const div = createSmartDiv({ container: ui })
        const sprite = createBuildingSprite({
            scene,
            x,
            z,
            spriteConf
        })
        const recruitmentPower = createRecruitmentPowerUiElement({
            className: RECRUITMENT_POWER_UI_ELEMENT
        })
        div.element.appendChild(recruitmentPower.element)
        return {
            id,
            x,
            z,
            area,
            type: ELEMENT_TYPE.TILE,
            div,
            owners,
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
            updateScaleDiv: (zoom, initialZoom) => {
                div.scale(zoom / GENERAL.ZOOM_ORIGINAL_K)
            },
            changeRecruitmentPower: power => {
                recruitmentPower.changePower(power)
            },
            addOwner: id => {
                const owner = createOwnerUiElement()
                div.element.insertBefore(
                    owner.element,
                    recruitmentPower.element
                )
                owners[id] = owner
                return owner
            },
            removeOwner: id => {
                const owner = owners[id]
                if (owner !== undefined) {
                    delete owners[id]
                    div.element.removeChild(owner.element)
                }
            },
            changeName: (id, title) => {
                const owner = owners[id]
                owner.changeName(title)
            },
            changeUnits: (id, units) => {
                const owner = owners[id]
                owner.changeUnits(units)
            },
            changeOwner: (id, className) => {
                const owner = owners[id]
                owner.changeOwner(className)
            },
            startHighlight: () => {
                if (tweenHighlight === undefined) {
                    const color = { inc: 1 }
                    tweenHighlight = new TWEEN.Tween(color)
                        .to({ inc: 2 }, 1000) // Move to 10 in 1 second.
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .repeat(Infinity)
                        // .delay(1000)
                        .onUpdate(() => {
                            sprite.material.color = new THREE.Color(
                                color.inc,
                                color.inc,
                                color.inc
                            )
                        })
                        .start() // Start the tween immediately.
                }
            },
            stopHighlight: () => {
                if (tweenHighlight !== undefined) {
                    tweenHighlight.stop()
                    tweenHighlight = undefined
                    sprite.material.color = new THREE.Color(1, 1, 1)
                }
            }
        }
    }
}
