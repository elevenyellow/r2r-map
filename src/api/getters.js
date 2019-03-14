export function getTileById({ tiles, idTile }) {
    return tiles.find(tile => tile.id === idTile)
}

export function getTroopsById({ troopss, idTroops }) {
    return troopss.find(troops => troops.id === idTroops)
}

export function getArrowById({ arrows, idArrow }) {
    return arrows.find(arrow => arrow.id === idArrow)
}
