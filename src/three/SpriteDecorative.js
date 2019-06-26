import * as THREE from 'three'
import { textureLoader } from './utils'

export default function SpriteDecorative({ url, scale }) {
    const texture = textureLoader.load(url)
    const material = new THREE.SpriteMaterial({
        map: texture
        // sizeAttenuation: false
        // depthTest: false
    })
    const sprite = new THREE.Sprite(material)
    texture.minFilter = THREE.LinearMipMapLinearFilter
    sprite.scale.set(scale.x, scale.y, scale.z)
    sprite.position.y = scale.y / 2
    return sprite
}
