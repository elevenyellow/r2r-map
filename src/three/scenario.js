import * as THREE from 'three'

const textureLoader = new THREE.TextureLoader()

export function addTerrain({ renderer, scene, url }) {
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

export function addDecorativeMapElement({ scene, element, x, z }) {
    const textureLoaded = textureLoader.load(element.url)
    const material = new THREE.SpriteMaterial({
        map: textureLoaded,
        color: 0xffffff
    })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(element.scale.x, element.scale.y, element.scale.z)
    sprite.position.y = element.scale.y / 2
    sprite.position.x = x
    sprite.position.z = z
    scene.add(sprite)
    return sprite
}

// https://gamedev.stackexchange.com/questions/167762/how-to-avoid-the-cutoff-of-a-sprite-when-overlapping-in-a-terrain?noredirect=1#comment298081_167762
export function addInteractiveMapElement({ scene, element, x, z }) {
    const textureLoaded = textureLoader.load(element.url)
    const material = new THREE.SpriteMaterial({
        map: textureLoaded,
        color: 0xffffff
    })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(element.scale.x, element.scale.y, element.scale.z)
    sprite.position.x = x + element.scale.x / 2
    sprite.position.y = element.scale.y / 2
    sprite.position.z = z + element.scale.z / 2
    scene.add(sprite)

    const helper = new THREE.AxesHelper(10)
    helper.position.x = x
    helper.position.z = z
    scene.add(helper)

    return sprite
}

// export function addInteractiveMapElement({ scene, element, x, z }) {
//     const textureLoaded = textureLoader.load(element.url)
//     const material = new THREE.MeshBasicMaterial({ map: textureLoaded })
//     // var material = new THREE.MeshBasicMaterial({
//     //     color: 0xffff00,
//     //     side: THREE.DoubleSide
//     // })
//     const geometry = new THREE.PlaneGeometry(10, 10, 1, 1)
//     const mesh = new THREE.Mesh(geometry, material)
//     mesh.position.y = 0.1
//     // mesh.position.z = 1
//     // mesh.position.x = 1
//     mesh.rotation.x = -Math.PI / 2
//     mesh.rotation.z = -Math.PI / 1.5

//     scene.add(mesh)
// }
