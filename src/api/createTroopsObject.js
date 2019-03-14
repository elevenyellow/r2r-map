import * as THREE from 'three'
import { TROOPS } from '../config/sprites/interactive'
import { ARROW } from '../config/sprites/indicator'
import { getTileById } from './getters'

export default function createTroopsObject({
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
        fromX,
        fromZ,
        toX,
        toZ,
        spriteConf: TROOPS,
        arrowConf: ARROW
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
