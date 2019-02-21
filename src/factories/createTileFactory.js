import { createSmartDiv, createOwnerUiElement } from '../ui'
import { addBuildingSprite } from '../three/scenario'
import { position3dToScreen2d } from '../three/utils'

export default function createTileFactory({
    ui,
    scene,
    camera,
    ratioScaleDivWhenZoom = 1 // 1 to keep the original size
}) {
    return ({ x, z, spriteConf }) => {
        const div = createSmartDiv({ container: ui })
        const owners = {}
        const sprite = addBuildingSprite({
            scene,
            x,
            z,
            spriteConf
        })
        return {
            div,
            owners,
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
                    Math.round(scale + (100 - scale) / ratioScaleDivWhenZoom) /
                    100
                // Changing  ZOOM
                div.scale(scaleReduced)
            },
            addOwner: id => {
                const owner = createOwnerUiElement()
                div.element.appendChild(owner.element)
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
            }
        }
    }
}
