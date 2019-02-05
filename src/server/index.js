function randomInt(min, max) {
    const i = (Math.random() * 32768) >>> 0
    return (i % (min - max)) + min
}

export function generateRandomDecorativeSprites({
    sprites,
    point1,
    point2,
    quantity,
    ignoreAreas,
    separation = 100
}) {
    const ignorePoints = {}
    ignoreAreas.forEach(area => {
        let x1 = area.x - area.radius
        let x2 = area.x + area.radius
        let z2 = area.z + area.radius
        for (; x1 <= x2; x1++) {
            for (let z1 = area.z - area.radius; z1 <= z2; z1++) {
                ignorePoints[`${x1}.${z1}`] = true
            }
        }
    })

    const spriteIndex = []
    sprites.forEach((sprite, index) => {
        const repeats = Array(sprite.frecuencyRatio).fill(index)
        spriteIndex.push.apply(spriteIndex, repeats)
    })

    const repeated = {}
    const result = []
    const point1x = point1.x * separation
    const point2x = point2.x * separation
    const point1z = point1.z * separation
    const point2z = point2.z * separation
    while (result.length < quantity) {
        const randomX = randomInt(point1x, point2x) / separation
        const randomZ = randomInt(point1z, point2z) / separation
        const key = `${Math.round(randomX)}.${Math.round(randomZ)}`
        if (repeated[key] === undefined && ignorePoints[key] === undefined) {
            const randomIndex = randomInt(0, spriteIndex.length)
            repeated[key] = true
            result.push({
                id: sprites[spriteIndex[randomIndex]].id,
                x: randomX,
                z: randomZ
            })
        }
    }
    return result
}
