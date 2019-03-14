import { getPositionByCordinate } from '../utils/hexagons'

export default function createTileObject({
    id,
    createTile,
    col,
    row,
    spriteConf,
    hexagonSize
}) {
    const [x, z] = getPositionByCordinate({ col, row, size: hexagonSize })
    const tile = createTile({ id, x, z, area: spriteConf.area, spriteConf })
    return tile
}
