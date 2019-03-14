import { getPositionByCordinate } from '../utils/hexagons'

export default function createTileObject({
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
