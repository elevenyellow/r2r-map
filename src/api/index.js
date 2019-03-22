import * as THREE from 'three'
import { OWNER, ELEMENT_TYPE } from '../const'
import { VILLAGE, COTTAGE, TROOPS } from '../config/sprites/animated'
// import { ARROW } from '../config/sprites/svg'
import { DECORATIVE_ITEMS } from '../config/parameters'
import DECORATIVE from '../config/sprites/decorative'
import { TILE_OWNER_CLASSES } from '../config/ui'
import { screenToWorld } from '../three/utils'
import createTileFactory from '../three/factories/createTileFactory'
import createTroopsFactory from '../three/factories/createTroopsFactory'
import createArrowFactory from '../three/factories/createArrowFactory'
import { createSpriteDecorative } from '../three'
import { generateRandomDecorativeSprites } from '../three/utils'
import createTroops from './createTroops'
import { getTileById, getTroopsById, getArrowById } from './getters'
import { getPositionByCordinate } from '../utils/hexagons'

export default function createApi({
    ui,
    camera,
    sceneSprites,
    sceneTerrain,
    hexagonSize,
    initialZoom
}) {
    // STATE
    const state = { currentZoom: initialZoom }
    const tiles = []
    const troopss = []
    const arrows = []
    const createTileSprite = createTileFactory({
        ui,
        camera,
        scene: sceneSprites
    })
    const createTroopsSprite = createTroopsFactory({
        ui,
        camera,
        sceneSprites,
        sceneTerrain
    })
    const createArrowSprite = createArrowFactory({
        ui,
        camera,
        scene: sceneTerrain
    })

    return {
        getTiles: () => {
            return tiles
        },
        updateZoom: ({ zoom }) => {
            state.currentZoom = zoom
            tiles.forEach(tile => tile.updateScaleDiv(zoom, initialZoom))
            troopss.forEach(troops => troops.updateScaleDiv(zoom, initialZoom))
        },
        updatePan: ({ canvasWidth, canvasHeight }) => {
            tiles.forEach(tile =>
                tile.updatePositionDiv({
                    canvasWidth,
                    canvasHeight
                })
            )
            troopss.forEach(troops =>
                troops.updatePositionDiv({
                    canvasWidth,
                    canvasHeight
                })
            )
        },
        createVillage: ({ id, col, row }) => {
            const [x, z] = getPositionByCordinate({
                col,
                row,
                size: hexagonSize
            })
            const tile = createTileSprite({
                id,
                x,
                z,
                area: VILLAGE.area,
                spriteConf: VILLAGE,
                type: ELEMENT_TYPE.VILLAGE
            })
            tile.updateScaleDiv(state.currentZoom, initialZoom)
            tiles.push(tile)
            return tile
        },
        createCottage: ({ id, col, row }) => {
            const [x, z] = getPositionByCordinate({
                col,
                row,
                size: hexagonSize
            })
            const tile = createTileSprite({
                id,
                x,
                z,
                area: COTTAGE.area,
                spriteConf: COTTAGE,
                type: ELEMENT_TYPE.COTTAGE
            })
            tile.updateScaleDiv(state.currentZoom, initialZoom)
            tiles.push(tile)
            return tile
        },
        createTroops: ({ id, fromTileId, toTileId }) => {
            return createTroops({
                createTroopsSprite,
                troopss,
                tiles,
                id,
                spriteConf: TROOPS,
                fromTileId,
                toTileId,
                currentZoom: state.currentZoom,
                initialZoom
            })
        },
        createArrow: ({ id, idTileFrom }) => {
            const tile = getTileById({ tiles, idTile: idTileFrom })
            const arrow = createArrowSprite({
                id,
                fromX: tile.x,
                fromZ: tile.z
            })
            arrows.push(arrow)
            return arrow
        },
        changeArrowDirection: ({ idArrow, x, z, status }) => {
            const arrow = getArrowById({ arrows, idArrow })
            arrow.changeDirection({ toX: x, toZ: z, status })
        },
        removeArrow: ({ idArrow }) => {
            const arrow = getArrowById({ arrows, idArrow })
            const index = arrows.indexOf(arrow)
            arrows.splice(index, 1)
            arrow.destroy()
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
            const index = troopss.indexOf(troops)
            troopss.splice(index, 1)
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
        getWorldPositionFromMouse: ({
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
            return intersections[0].point
        },
        selectInteractiveSprite: ({ x, z }) => {
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
                createSpriteDecorative({
                    scene: sceneSprites,
                    x: sprite.x,
                    z: sprite.z,
                    spriteConf: DECORATIVE[sprite.id]
                })
            })
        }
    }
}
