import TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
import { CIRCLE } from '../../config/sprites/indicator'

import {
    createSmartDiv,
    createOwnerUiElement,
    createRecruitmentPowerUiElement
} from '../../ui'
import { createBuildingSprite } from '../'
import { worldToScreen } from '../utils'
import { GENERAL } from '../../config/parameters'
import { RECRUITMENT_POWER_UI_ELEMENT } from '../../config/ui'
import { svgLoader } from '../utils'

export default function createTileFactory({ ui, scene, camera }) {
    return ({ id, area, x, z, spriteConf, type }) => {
        let tweenHighlight
        const owners = {}
        const div = createSmartDiv({ container: ui })
        const { sprite, body, border } = createBuildingSprite({
            scene,
            x,
            z,
            spriteConf
        })
        border.visible = false

        const recruitmentPower = createRecruitmentPowerUiElement({
            className: RECRUITMENT_POWER_UI_ELEMENT
        })
        div.element.appendChild(recruitmentPower.element)

        // const { circle } = createCircleHighlight()
        // circle.position.x = x
        // circle.position.y = -1
        // circle.position.z = z
        // scene.add(circle)

        return {
            id,
            x,
            z,
            area,
            type,
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

// function createCircleHighlight() {
//     const circle = new THREE.Group()

//     svgLoader.load(CIRCLE.url, paths => {
//         circle.scale.set(CIRCLE.scale.x, CIRCLE.scale.y, CIRCLE.scale.z)
//         // circle.position.y = 0.1
//         circle.position.x += CIRCLE.offsetX
//         circle.position.z += CIRCLE.offsetZ
//         circle.rotation.x = -Math.PI / 2
//         // circle.position.x += CIRCLE.separation * 2
//         // circles.add(circle)

//         for (let i = 0; i < paths.length; i++) {
//             const path = paths[i]
//             const material = new THREE.MeshBasicMaterial({
//                 color: path.color,
//                 // side: THREE.DoubleSide
//                 // depthWrite: false,
//                 transparent: true
//             })
//             const shapes = path.toShapes(true)
//             material.opacity = 0.5

//             for (let j = 0; j < shapes.length; j++) {
//                 const shape = shapes[j]
//                 const geometry = new THREE.ShapeBufferGeometry(shape)
//                 const mesh = new THREE.Mesh(geometry, material)
//                 circle.add(mesh)
//             }
//         }
//     })

//     return { circle }
// }
