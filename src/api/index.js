import * as THREE from 'three'
import { OWNER } from '../const'
import { VILLAGE, COTTAGE, TROOPS } from '../config/sprites/interactive'
// import { ARROW } from '../config/sprites/indicator'
import { DECORATIVE_ITEMS } from '../config/parameters'
import DECORATIVE from '../config/sprites/decorative'
import { TILE_OWNER_CLASSES } from '../config/ui'
import { screenToWorld } from '../three/utils'
import createTileFactory from '../factories/createTileFactory'
import createTroopsFactory from '../factories/createTroopsFactory'
import createArrowFactory from '../factories/createArrowFactory'
import { createDecorativeSprite } from '../three/scenario'
import { generateRandomDecorativeSprites } from '../three/utils'
import createTileObject from './createTileObject'
import createTroopsObject from './createTroopsObject'
import { getTileById, getTroopsById } from './getters'

export default function createApi({
    ui,
    camera,
    sceneSprites,
    sceneTerrain,
    hexagonSize,
    initialZoom
}) {
    // STATE
    let currentZoom = initialZoom
    const tiles = []
    const troopss = []
    const arrows = []
    const createTile = createTileFactory({
        ui,
        camera,
        scene: sceneSprites
    })
    const createTroops = createTroopsFactory({
        ui,
        camera,
        sceneSprites,
        sceneTerrain
    })
    const createArrow = createArrowFactory({
        ui,
        camera,
        scene: sceneTerrain
    })

    return {
        updateZoom: ({ zoom }) => {
            currentZoom = zoom
            tiles.forEach(tile => tile.updateScaleDiv(zoom, initialZoom))
            troopss.forEach(troops => troops.updateScaleDiv(zoom, initialZoom))
        },
        updatePan: ({ canvasWidth, canvasHeight }) => {
            tiles.forEach(tile =>
                tile.updatePositionDiv({
                    camera,
                    canvasWidth,
                    canvasHeight
                })
            )
            troopss.forEach(troops =>
                troops.updatePositionDiv({
                    camera,
                    canvasWidth,
                    canvasHeight
                })
            )
        },
        createVillage: ({ id, col, row }) => {
            const tile = createTileObject({
                id,
                createTile,
                col,
                row,
                spriteConf: VILLAGE,
                tiles,
                hexagonSize
            })
            tile.updateScaleDiv(currentZoom, initialZoom)
            tiles.push(tile)
            return tile
        },
        createCottage: ({ id, col, row }) => {
            const tile = createTileObject({
                id,
                createTile,
                col,
                row,
                spriteConf: COTTAGE,
                tiles,
                hexagonSize
            })
            tile.updateScaleDiv(currentZoom, initialZoom)
            tiles.push(tile)
            return tile
        },
        createTroops: ({ id, fromTileId, toTileId }) => {
            const troops = createTroopsObject({
                createTroops,
                troopss,
                tiles,
                id,
                spriteConf: TROOPS,
                fromTileId,
                toTileId
            })
            troops.updateScaleDiv(currentZoom, initialZoom)
            troopss.push(troops)
            return troops
        },
        createArrow: ({ id, idTileFrom }) => {
            const tile = getTileById({ tiles, idTile: idTileFrom })
            const arrow = createArrow({
                id,
                fromX: tile.x,
                fromZ: tile.z
            })
            arrows.push(arrow)
            return arrow
        },
        changeRecruitmentPower: ({ idTile, power }) => {
            const tile = getTileById({ tiles, idTile })
            tile.changeRecruitmentPower(power)
        },
        addOwnerAsPlayer: ({ idTile, idOwner, name = '', units = 0 }) => {
            const tile = getTileById({ tiles, idTile })
            tile.addOwner(idOwner)
            tile.changeOwner(idOwner, TILE_OWNER_CLASSES[OWNER.PLAYER])
            tile.changeName(idOwner, name)
            tile.changeUnits(idOwner, units)
        },
        addOwnerAsEnemy: ({ idTile, idOwner, name = '', units = 0 }) => {
            const tile = getTileById({ tiles, idTile })
            tile.addOwner(idOwner)
            tile.changeOwner(idOwner, TILE_OWNER_CLASSES[OWNER.ENEMY])
            tile.changeName(idOwner, name)
            tile.changeUnits(idOwner, units)
        },
        removeOwner: ({ idTile, idOwner }) => {
            const tile = getTileById({ tiles, idTile })
            tile.removeOwner(idOwner)
        },
        changeUnits: ({ idTile, idOwner, units }) => {
            const tile = getTileById({ tiles, idTile })
            tile.changeUnits(idOwner, units)
        },
        startHighlight: ({ idTile }) => {
            const tile = getTileById({ tiles, idTile })
            tile.startHighlight()
        },
        stopHighlight: ({ idTile }) => {
            const tile = getTileById({ tiles, idTile })
            tile.stopHighlight()
        },
        removeTroops: ({ idTroops }) => {
            const troops = getTroopsById({ troopss, idTroops })
            troops.destroy()
        },
        changeTroopsUnits: ({ idTroops, units }) => {
            const troops = getTroopsById({ troopss, idTroops })
            troops.changeUnits(units)
        },
        changeTroopsDistance: ({ idTroops, distance }) => {
            const troops = getTroopsById({ troopss, idTroops })
            const x = (distance * troops.diffX) / 100
            const z = (distance * troops.diffZ) / 100
            const newX = x + troops.fromX
            const newZ = z + troops.fromZ
            troops.changePosition({
                x: newX,
                z: newZ
            })
        },
        selectSprite: ({
            mouseX,
            mouseY,
            camera,
            canvasWidth,
            canvasHeight,
            objects
        }) => {
            const intersections = screenToWorld({
                x: mouseX,
                y: mouseY,
                camera,
                canvasWidth,
                canvasHeight,
                objects
            })
            const { x, z } = intersections[0].point
            const vectorClick = new THREE.Vector2(x, z)
            const mapper = troopOrTile => {
                const vector = new THREE.Vector2(
                    troopOrTile.sprite.position.x,
                    troopOrTile.sprite.position.z
                )
                return {
                    type: troopOrTile.type,
                    distance: vectorClick.distanceTo(vector),
                    troopOrTile
                }
            }
            const filterer = item => item.distance < item.troopOrTile.area
            const sorter = (a, b) => a.distance - b.distance

            // Finding troops
            const troopsFound = troopss.map(mapper).filter(filterer)
            // Finding tiles
            const tilesFound = tiles.map(mapper).filter(filterer)
            return troopsFound.concat(tilesFound).sort(sorter)[0]
        },
        addDecorativeElements: () => {
            const ignoreAreas = tiles.map(tile => ({
                x: Math.round(tile.x),
                z: Math.round(tile.z),
                radius: tile.area
            }))
            const options = Object.assign({}, { ignoreAreas }, DECORATIVE_ITEMS)
            const sprites = generateRandomDecorativeSprites(options)
            sprites.forEach(sprite => {
                createDecorativeSprite({
                    scene: sceneSprites,
                    x: sprite.x,
                    z: sprite.z,
                    spriteConf: DECORATIVE[sprite.id]
                })
            })
        }
    }
}
