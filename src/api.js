import { OWNER } from './const'
import { VISUAL } from './config/values'
import { TILE_OWNER_CLASSES } from './config/ui'
import BUILDING from './config/sprites/building'
import DECORATIVE from './config/sprites/decorative'
import createTileFactory from './factories/createTileFactory'

export default function createApi({ tiles, ui, camera, sceneSprites }) {
    const createTile = createTileFactory({
        ui,
        camera,
        scene: sceneSprites,
        ratioScaleDivWhenZoom: VISUAL.RATIO_SCALE_DIV_WHEN_ZOOM
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
    tile.addOwner(idNeutral)
    tile.changeOwner(idNeutral, TILE_OWNER_CLASSES[OWNER.NEUTRAL])
    tiles.push(tile)
    return createTileMethods({ tile, idNeutral })
}

function createTileMethods({ tile, idNeutral }) {
    return {
        addOwnerAsPlayer: (id, name = '', units = 0) => {
            tile.removeOwner(idNeutral)
            tile.addOwner(id)
            tile.changeOwner(id, TILE_OWNER_CLASSES[OWNER.PLAYER])
            tile.changeName(id, name)
            tile.changeUnits(id, units)
        },
        addOwnerAsEnemy: (id, name = '', units = 0) => {
            tile.removeOwner(idNeutral)
            tile.addOwner(id)
            tile.changeOwner(id, TILE_OWNER_CLASSES[OWNER.ENEMY])
            tile.changeName(id, name)
            tile.changeUnits(id, units)
        },
        removeOwner: id => {
            tile.removeOwner(id)
            if (Object.keys(tile.owners).length === 0) {
                tile.addOwner(idNeutral)
                tile.changeOwner(idNeutral, TILE_OWNER_CLASSES[OWNER.NEUTRAL])
            }
        },
        changeUnits: (id, units) => {
            tile.changeUnits(id, units)
        }
    }
}
