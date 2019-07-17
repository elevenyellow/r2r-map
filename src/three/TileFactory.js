import TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
import { TILE, ELEMENT_TYPE } from 'runandrisk-common/const'
// import { CIRCLE } from '../../config/sprites/svg'
import { SmartDiv, PlayerUiElement, RecruitmentPowerUiElement } from '../ui'
import ProgressBar from '../ui/ProgressBar'
import SpriteBorder from './SpriteBorder'
import { worldToScreen } from './utils'
import { GENERAL } from '../config/parameters'
import { RECRUITMENT_POWER_UI_ELEMENT, UI } from '../const'
import { ARROW } from '../config/sprites/others'

export default function TileFactory({
    ui,
    sceneSprites,
    sceneTerrain,
    camera
}) {
    return ({ id, area, x, z, spriteConf, type }) => {
        let tweenBorder
        let color

        const owners = {}
        const div = SmartDiv({
            container: ui,
            height:
                type === TILE.VILLAGE
                    ? UI.VILLAGE_DIV_HEIGHT
                    : UI.COTTAGE_DIV_HEIGHT
        })

        const progressBar = ProgressBar({
            container: div.element,
            size:
                type === TILE.VILLAGE
                    ? UI.VILLAGE_PROGRESSBAR_SIZE
                    : UI.COTTAGE_PROGRESSBAR_SIZE,
            stroke:
                type === TILE.VILLAGE
                    ? UI.VILLAGE_PROGRESSBAR_STROKE
                    : UI.COTTAGE_PROGRESSBAR_STROKE
        })

        const recruitmentPower = RecruitmentPowerUiElement({
            className: RECRUITMENT_POWER_UI_ELEMENT
        })
        div.element.appendChild(recruitmentPower.element)

        const houses = SpriteBorder(spriteConf)
        houses.border.visible = false

        const arrow = SpriteBorder(ARROW)
        arrow.sprite.visible = false

        const circle =
            type === TILE.VILLAGE
                ? new THREE.CircleGeometry(3.3, 64) // village
                : new THREE.CircleGeometry(1.5, 64) // cottage
        const circle_material = new THREE.MeshBasicMaterial()
        circle_material.transparent = true
        circle_material.opacity = 0.7
        circle_material.visible = false
        // circle_material.color = new THREE.Color(0xff0000)
        const circle_mesh = new THREE.Mesh(circle, circle_material)
        circle_mesh.position.x = x
        circle_mesh.position.z = z
        circle_mesh.rotation.y = Math.PI
        circle_mesh.rotation.x = Math.PI / 2
        sceneTerrain.add(circle_mesh)

        const sprite = new THREE.Group()
        sprite.position.x = x
        sprite.position.z = z
        sprite.add(houses.sprite)
        sprite.add(arrow.sprite)
        sceneSprites.add(sprite)

        // const { circle } = createCircleHighlight()
        // circle.position.x = x
        // circle.position.y = -1
        // circle.position.z = z
        // sceneSprites.add(circle)

        // const helper = new THREE.AxesHelper(10)
        // helper.position.x = x
        // helper.position.z = z
        // sceneSprites.add(helper)

        return {
            id,
            x,
            z,
            area,
            type:
                type === TILE.VILLAGE
                    ? ELEMENT_TYPE.VILLAGE
                    : ELEMENT_TYPE.COTTAGE,
            div,
            owners,
            sprite,
            updatePositionDiv: ({ canvasWidth, canvasHeight }) => {
                const position = worldToScreen({
                    x: sprite.position.x /* + spriteConf.uiOffsetX*/,
                    y: sprite.position.y,
                    z: sprite.position.z /* + spriteConf.uiOffsetZ*/,
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
            addPlayer: (id, color) => {
                if (owners[id] === undefined) {
                    const owner = PlayerUiElement(color)
                    div.element.insertBefore(
                        owner.element,
                        recruitmentPower.element
                    )
                    owners[id] = owner
                    return owner
                } else {
                    return owners[id]
                }
            },
            removePlayer: id => {
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
            changeColor: c => {
                color = c
                houses.border.visible = true
                houses.border.material.color = new THREE.Color(c)
                houses.border.material.opacity = GENERAL.OWNER_BORDER_OPACITY
                circle_material.visible = true
                circle_material.color = new THREE.Color(c)
            },
            deleteColor: () => {
                color = undefined
                houses.border.visible = false
                circle_material.visible = false
            },
            startHighlight: () => {
                if (tweenBorder === undefined) {
                    houses.border.visible = true
                    houses.border.material.color = new THREE.Color(1, 1, 1)
                    arrow.body.material.color = new THREE.Color(1, 1, 1)
                    arrow.border.material.color = new THREE.Color(1, 1, 1)
                    arrow.sprite.visible = true
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
                arrow.body.material.color = new THREE.Color(1, 1, 1)
                arrow.border.material.color = new THREE.Color(1, 1, 1)
                if (color === undefined) {
                    houses.border.visible = false
                    houses.border.material.color = new THREE.Color(1, 1, 1)
                } else {
                    houses.border.visible = true
                    houses.border.material.color = new THREE.Color(color)
                    houses.border.material.opacity =
                        GENERAL.OWNER_BORDER_OPACITY
                }
            },
            highLightRed: () => {
                arrow.sprite.visible = true
                houses.border.visible = true
                houses.border.material.color = new THREE.Color(0xff0000)
                arrow.body.material.color = new THREE.Color(0xff0000)
                // arrow.border.material.color = new THREE.Color(0xe13416)
                arrow.sprite.position.y = GENERAL.ARROW_TILE_POSITION_Y_ORIGIN
                houses.border.material.opacity = 1
            },
            showProgress: () => {
                progressBar.show()
            },
            hideProgress: () => {
                progressBar.hide()
            },
            changePercentage: ({ percentage }) => {
                progressBar.changePercentage({ percentage })
            },
            changeColorProgressBar: ({ color }) => {
                progressBar.changeColor({ color })
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
