import * as THREE from 'three'
import { textureLoader } from './utils'

export default function createSpriteDecorative({ url, scale }) {
    const textureLoaded = textureLoader.load(url)
    const material = new THREE.SpriteMaterial({
        map: textureLoaded
        // sizeAttenuation: false
        // depthTest: false
    })
    const sprite = new THREE.Sprite(material)
    material.map.minFilter = THREE.LinearMipMapLinearFilter
    sprite.scale.set(scale.x, scale.y, scale.z)
    sprite.position.y = scale.y / 2
    return sprite
}
