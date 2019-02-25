import TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'

import {
    createSmartDiv,
    createOwnerUiElement,
    createRecruitmentPowerUiElement
} from '../ui'
import { createBuildingSprite } from '../three/scenario'
import { position3dToScreen2d } from '../three/utils'
import { VISUAL } from '../config/parameters'
import { RECRUITMENT_POWER_UI_ELEMENT } from '../config/ui'

export default function createTileFactory({ ui, scene, camera }) {
    return ({ x, z, spriteConf }) => {
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
            div,
            owners,
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
                        scale + (100 - scale) / VISUAL.RATIO_SCALE_DIV_WHEN_ZOOM
                    ) / 100
                // Changing  ZOOM
                div.scale(scaleReduced)
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
