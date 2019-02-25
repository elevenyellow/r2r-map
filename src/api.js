import { OWNER } from './const'
import BUILDING from './config/sprites/building'
import ARMY from './config/sprites/army'
import DECORATIVE from './config/sprites/decorative'
import { TILE_OWNER_CLASSES } from './config/ui'
import createTileFactory from './factories/createTileFactory'
import createArmyFactory from './factories/createArmyFactory'

export default function createApi({ tiles, armys, ui, camera, sceneSprites }) {
    const createTile = createTileFactory({
        ui,
        camera,
        scene: sceneSprites
    })
    const createArmy = createArmyFactory({
        ui,
        camera,
        scene: sceneSprites
    })
    return {
        createVillage: ({ col, row }) => {
            return createGenericTile({
                createTile,
                col,
                row,
                spriteConf: BUILDING.VILLAGE,
                tiles
            })
        },
        createCottage: ({ col, row }) => {
            return createGenericTile({
                createTile,
                col,
                row,
                spriteConf: BUILDING.COTTAGE,
                tiles
            })
        },
        createArmy: ({ from, to }) => {
            const fromX = from.col
            const fromZ = from.row
            const toX = to.col
            const toZ = to.row
            const army = createArmy({
                x: fromX,
                z: fromZ,
                spriteConf: ARMY.ARMY
            })
            armys.push(army)
            return {
                changeUnits: units => {
                    army.changeUnits(units)
                },
                changeDistance: distance => {
                    const x = (distance * (toX - fromX)) / 100
                    const z = (distance * (toZ - fromZ)) / 100
                    army.changePosition({ x: x + fromX, z: z + fromZ })
                }
            }
        }
    }
}

// Private
function createGenericTile({ createTile, col, row, spriteConf, tiles }) {
    const tile = createTile({
        x: col,
        z: row,
        spriteConf
    })
    const idNeutral = Math.random()
    // tile.addOwner(idNeutral)
    // tile.changeOwner(idNeutral, TILE_OWNER_CLASSES[OWNER.NEUTRAL])
    tiles.push(tile)
    return createTileMethods({ tile, idNeutral })
}

function createTileMethods({ tile, idNeutral }) {
    return {
        changeRecruitmentPower: power => {
            tile.changeRecruitmentPower(power)
        },
        addOwnerAsPlayer: (id, name = '', units = 0) => {
            // tile.removeOwner(idNeutral)
            tile.addOwner(id)
            tile.changeOwner(id, TILE_OWNER_CLASSES[OWNER.PLAYER])
            tile.changeName(id, name)
            tile.changeUnits(id, units)
        },
        addOwnerAsEnemy: (id, name = '', units = 0) => {
            // tile.removeOwner(idNeutral)
            tile.addOwner(id)
            tile.changeOwner(id, TILE_OWNER_CLASSES[OWNER.ENEMY])
            tile.changeName(id, name)
            tile.changeUnits(id, units)
        },
        removeOwner: id => {
            tile.removeOwner(id)
            // if (Object.keys(tile.owners).length === 0) {
            // tile.addOwner(idNeutral)
            // tile.changeOwner(idNeutral, TILE_OWNER_CLASSES[OWNER.NEUTRAL])
            // }
        },
        changeUnits: (id, units) => {
            tile.changeUnits(id, units)
        },
        startHighlight: () => {
            tile.startHighlight()
        },
        stopHighlight: () => {
            tile.stopHighlight()
        }
    }
}

// //
// canvas.addEventListener('click', e => {
//     console.log(e, tiles.map(tile => tile.div.element))
// })

// // Adding decorative sprites
// const spriteList = [
//     { id: 'tree1', frecuencyRatio: 8 },
//     { id: 'tree2', frecuencyRatio: 8 },
//     { id: 'tree3', frecuencyRatio: 40 },
//     { id: 'tree4', frecuencyRatio: 8 },
//     { id: 'bush1', frecuencyRatio: 5 },
//     // { id: 'rock1', frecuencyRatio: 2 },
//     { id: 'rock2', frecuencyRatio: 3 },
//     { id: 'trunk1', frecuencyRatio: 10 },
//     { id: 'trunk2', frecuencyRatio: 10 }
// ]
// const sprites = generateRandomDecorativeSprites({
//     quantity: 500,
//     sprites: spriteList,
//     point1: { x: -100, z: -100 },
//     point2: { x: 100, z: 100 },
//     ignoreAreas: [{ x: 0, z: 0, radius: 5 }, { x: 10, z: 5, radius: 3 }]
// })
// sprites.forEach(sprite => {
//     createDecorativeSprite({
//         scene: sceneSprites,
//         x: sprite.x,
//         z: sprite.z,
//         spriteConf: spritesConfig[sprite.id]
//     })
// })
