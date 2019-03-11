import * as THREE from 'three'
import { OWNER } from './const'
import { VILLAGE, COTTAGE, TROOPS } from './config/sprites/interactive'
import { DECORATIVE_ITEMS } from './config/parameters'
import DECORATIVE from './config/sprites/decorative'
import { TILE_OWNER_CLASSES } from './config/ui'
import { screenToWorld } from './three/utils'
import createTileFactory from './factories/createTileFactory'
import createTroopsFactory from './factories/createTroopsFactory'
import { getPositionByCordinate } from './utils/hexagons'
import { createDecorativeSprite } from './three/scenario'
import { generateRandomDecorativeSprites } from './three/utils'

export default function createApi({
    ui,
    camera,
    sceneSprites,
    hexagonSize,
    initialZoom
}) {
    // STATE
    let zoom = initialZoom
    const tiles = []
    const troopss = []
    const createTile = createTileFactory({
        ui,
        camera,
        scene: sceneSprites
    })
    const createTroops = createTroopsFactory({
        ui,
        camera,
        scene: sceneSprites
    })

    return {
        updateZoom: newZoom => {
            zoom = newZoom
            tiles.forEach(tile => tile.updateScaleDiv(zoom))
            troopss.forEach(troops => troops.updateScaleDiv(zoom))
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
            tile.updateScaleDiv(zoom)
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
            tile.updateScaleDiv(zoom)
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
            troops.updateScaleDiv(zoom)
            return troops
        },
        changeRecruitmentPower: (idTile, power) => {
            const tile = getTileById({ tiles, idTile })
            tile.changeRecruitmentPower(power)
        },
        addOwnerAsPlayer: (idTile, idOwner, name = '', units = 0) => {
            const tile = getTileById({ tiles, idTile })
            tile.addOwner(idOwner)
            tile.changeOwner(idOwner, TILE_OWNER_CLASSES[OWNER.PLAYER])
            tile.changeName(idOwner, name)
            tile.changeUnits(idOwner, units)
        },
        addOwnerAsEnemy: (idTile, idOwner, name = '', units = 0) => {
            const tile = getTileById({ tiles, idTile })
            tile.addOwner(idOwner)
            tile.changeOwner(idOwner, TILE_OWNER_CLASSES[OWNER.ENEMY])
            tile.changeName(idOwner, name)
            tile.changeUnits(idOwner, units)
        },
        removeOwner: (idTile, idOwner) => {
            const tile = getTileById({ tiles, idTile })
            tile.removeOwner(idOwner)
        },
        changeUnits: (idTile, idOwner, units) => {
            const tile = getTileById({ tiles, idTile })
            tile.changeUnits(idOwner, units)
        },
        startHighlight: idTile => {
            const tile = getTileById({ tiles, idTile })
            tile.startHighlight()
        },
        stopHighlight: idTile => {
            const tile = getTileById({ tiles, idTile })
            tile.stopHighlight()
        },
        changeUnits: (idTroops, units) => {
            const troops = getTroopsById({ troopss, idTroops })
            troops.changeUnits(units)
        },
        changeDistance: (idTroops, distance) => {
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
        getSpriteSelected: ({
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
                x: tile.x,
                z: tile.z,
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

// Private

function getTileById({ tiles, idTile }) {
    return tiles.find(tile => tile.id === idTile)
}

function getTroopsById({ troopss, idTroops }) {
    return troopss.find(troops => troops.id === idTroops)
}

function createTileObject({
    id,
    createTile,
    col,
    row,
    spriteConf,
    tiles,
    hexagonSize
}) {
    const [x, z] = getPositionByCordinate({ col, row, size: hexagonSize })
    const tile = createTile({ x, z, spriteConf })
    tile.id = id
    tile.x = x
    tile.z = z
    tile.area = spriteConf.area
    tiles.push(tile)
    return tile
}

function createTroopsObject({
    createTroops,
    troopss,
    tiles,
    id,
    spriteConf,
    fromTileId,
    toTileId
}) {
    const from = getTileById({ tiles, idTile: fromTileId })
    const to = getTileById({ tiles, idTile: toTileId })
    const fromX = from.x
    const fromZ = from.z
    const toX = to.x
    const toZ = to.z
    const troops = createTroops({
        x: fromX,
        z: fromZ,
        spriteConf: TROOPS
    })

    const fromVector = new THREE.Vector2(fromX, fromZ)
    const toVector = new THREE.Vector2(toX, toZ)
    const fromVectorReduced = fromVector
        .clone()
        .sub(toVector)
        .normalize()
        .multiplyScalar(-from.area)
        .add(fromVector)
    const toVectorReduced = toVector
        .clone()
        .sub(fromVector)
        .normalize()
        .multiplyScalar(-to.area)
        .add(toVector)
    const diffX = toVectorReduced.x - fromVectorReduced.x
    const diffZ = toVectorReduced.y - fromVectorReduced.y

    // const helper = new THREE.AxesHelper(10)
    // helper.position.x = fromVectorReduced.x
    // helper.position.z = fromVectorReduced.y
    // sceneSprites.add(helper)

    // const helper2 = new THREE.AxesHelper(10)
    // helper2.position.x = toVectorReduced.x
    // helper2.position.z = toVectorReduced.y
    // sceneSprites.add(helper2)
    troops.id = id
    troops.diffX = diffX
    troops.diffZ = diffZ
    troops.fromX = fromVectorReduced.x
    troops.fromZ = fromVectorReduced.y
    troops.area = spriteConf.area
    troopss.push(troops)

    return troops
}

// //
// canvas.addEventListener('click', e => {
//     console.log(e, tiles.map(tile => tile.div.element))
// })
