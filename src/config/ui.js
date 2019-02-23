import { OWNER } from '../const'

export const DOM = {
    UI: 'ui',
    CANVAS: 'canvas'
}

export const TILE_OWNER_CLASSES = {
    [OWNER.NEUTRAL]: 'tileOwner neutral',
    [OWNER.PLAYER]: 'tileOwner player',
    [OWNER.ENEMY]: 'tileOwner enemy'
}
