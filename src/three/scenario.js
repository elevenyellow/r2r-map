import * as THREE from 'three'

const textureLoader = new THREE.TextureLoader()

export function createTerrain({ renderer, scene, url }) {
    const geometry = new THREE.PlaneBufferGeometry(100, 100)
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()
    const textureLoaded = textureLoader.load(url)
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: textureLoaded
    })
    const mesh = new THREE.Mesh(geometry, material)

    textureLoaded.anisotropy = maxAnisotropy
    textureLoaded.wrapS = textureLoaded.wrapT = THREE.RepeatWrapping
    textureLoaded.repeat.set(512, 512)
    // mesh.position.y -= 0.2
    mesh.rotation.x = -Math.PI / 2
    mesh.scale.set(200, 200, 200)
    scene.add(mesh)
    return mesh
}

// https://gamedev.stackexchange.com/questions/167762/how-to-avoid-the-cutoff-of-a-sprite-when-overlapping-in-a-terrain?noredirect=1#comment298081_167762
export function addBuildingSprite({ scene, spriteConf, x, z }) {
    const textureLoaded = textureLoader.load(spriteConf.url)
    const material = new THREE.SpriteMaterial({
        map: textureLoaded
        // depthTest: false
    })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(spriteConf.scale.x, spriteConf.scale.y, spriteConf.scale.z)
    sprite.position.x = x
    sprite.position.z = z
    scene.add(sprite)

    // const helper = new THREE.AxesHelper(10)
    // helper.position.x = x
    // helper.position.z = z
    // scene.add(helper)

    return sprite
}

export function addDecorativeSprite({ scene, spriteConf, x, z }) {
    const textureLoaded = textureLoader.load(spriteConf.url)
    const material = new THREE.SpriteMaterial({
        map: textureLoaded
    })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(spriteConf.scale.x, spriteConf.scale.y, spriteConf.scale.z)
    sprite.position.y = spriteConf.scale.y / 2
    sprite.position.x = x
    sprite.position.z = z
    scene.add(sprite)
    return sprite
}

// export function addUiSprite({ scene, element, x, z }) {
//     const textureLoaded = textureLoader.load(element.url)
//     const material = new THREE.SpriteMaterial({
//         map: textureLoaded
//         // depthTest: false
//     })
//     const sprite = new THREE.Sprite(material)
//     sprite.scale.set(element.scale.x, element.scale.y, element.scale.z)
//     sprite.position.y = 10
//     sprite.position.x = x + 10
//     sprite.position.z = z + 10
//     scene.add(sprite)

//     // const helper = new THREE.AxesHelper(10)
//     // helper.position.x = x
//     // helper.position.z = z
//     // scene.add(helper)

//     return sprite
// }

// export function addTextSprite({
//     scene,
//     text,
//     color = 'white',
//     textHeight = 1,
//     x,
//     z
// }) {
//     const sprite = new SpriteText(text)
//     sprite.textHeight = textHeight
//     sprite.fontSize = 100
//     sprite.color = color
//     sprite.fontFace = 'Allan'
//     sprite.position.y = 10
//     sprite.position.x = x + 10
//     sprite.position.z = z + 10
//     scene.add(sprite)
//     return sprite
// }
