import * as THREE from 'three'

export function addTerrain({ renderer, scene, url }) {
    const geometry = new THREE.PlaneBufferGeometry(100, 100)
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()
    const textureLoaded = new THREE.TextureLoader().load(url)
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: textureLoaded
    })
    const mesh = new THREE.Mesh(geometry, material)

    textureLoaded.anisotropy = maxAnisotropy
    textureLoaded.wrapS = textureLoaded.wrapT = THREE.RepeatWrapping
    textureLoaded.repeat.set(512, 512)
    mesh.position.y -= 0.2
    mesh.rotation.x = -Math.PI / 2
    mesh.scale.set(200, 200, 200)
    scene.add(mesh)
    return mesh
}

const textureLoader = new THREE.TextureLoader()
export function addDecorativeSprite({ scene, element, x, z }) {
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
