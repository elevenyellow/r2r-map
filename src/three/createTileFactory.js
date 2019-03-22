import TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
// import { CIRCLE } from '../../config/sprites/svg'
import {
    createSmartDiv,
    createOwnerUiElement,
    createRecruitmentPowerUiElement
} from '../ui'
import createSpriteBorder from './createSpriteBorder'
import { worldToScreen } from './utils'
import { GENERAL } from '../config/parameters'
import { RECRUITMENT_POWER_UI_ELEMENT } from '../const'
import { ARROW } from '../config/sprites/others'

export default function createTileFactory({ ui, scene, camera }) {
    return ({ id, area, x, z, spriteConf, type }) => {
        let tweenBorder
        const owners = {}
        const div = createSmartDiv({ container: ui })
        const recruitmentPower = createRecruitmentPowerUiElement({
            className: RECRUITMENT_POWER_UI_ELEMENT
        })
        div.element.appendChild(recruitmentPower.element)

        const houses = createSpriteBorder(spriteConf)
        houses.border.visible = false

        const arrow = createSpriteBorder(ARROW)
        arrow.sprite.visible = false

        const sprite = new THREE.Group()
        sprite.position.x = x
        sprite.position.z = z
        sprite.add(houses.sprite)
        sprite.add(arrow.sprite)
        scene.add(sprite)

        // const { circle } = createCircleHighlight()
        // circle.position.x = x
        // circle.position.y = -1
        // circle.position.z = z
        // scene.add(circle)

        // const helper = new THREE.AxesHelper(10)
        // helper.position.x = x
        // helper.position.z = z
        // scene.add(helper)

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
                if (tweenBorder === undefined) {
                    arrow.sprite.visible = true
                    houses.border.visible = true
                    tweenBorder = new TWEEN.Tween({
                        opacity: GENERAL.BORDER_TILE_MINIMUN_OPACITY,
                        arrowPositionY: GENERAL.ARROW_TILE_POSITION_Y_ORIGIN
                    })
                        .to(
                            {
                                opacity: 1,
                                arrowPositionY:
                                    GENERAL.ARROW_TILE_POSITION_Y_DESTINY
                            },
                            GENERAL.BORDER_TILE_ANIMATION_TIME
                        )
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .repeat(Infinity)
                        .yoyo(true)
                        // .delay(500)
                        .onUpdate(o => {
                            houses.border.material.opacity = o.opacity
                            arrow.sprite.position.y = o.arrowPositionY
                        })
                        .start()
                }
            },
            stopHighlight: () => {
                if (tweenBorder !== undefined) {
                    tweenBorder.stop()
                    tweenBorder = undefined
                }
                arrow.sprite.visible = false
                houses.border.visible = false
                houses.border.material.color = new THREE.Color(1, 1, 1)
                arrow.body.material.color = new THREE.Color(1, 1, 1)
                arrow.border.material.color = new THREE.Color(1, 1, 1)
            },
            highLightRed: () => {
                arrow.sprite.visible = true
                houses.border.visible = true
                houses.border.material.color = new THREE.Color(0xe13416)
                arrow.body.material.color = new THREE.Color(0xe13416)
                arrow.border.material.color = new THREE.Color(0xe13416)
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
