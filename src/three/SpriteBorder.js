import * as THREE from 'three'
import { textureLoader } from './utils'

export default function SpriteBorder({ url, urlBorder, scale }) {
    // Loading body
    const texture = textureLoader.load(url)
    const material = new THREE.SpriteMaterial({
        map: texture
    })
    const body = new THREE.Sprite(material)
    texture.minFilter = THREE.LinearFilter //THREE.LinearMipMapNearestFilter
    // textureLoaded.anisotropy = window.renderer.capabilities.getMaxAnisotropy()

    // Loading border
    const textureborder = textureLoader.load(urlBorder)
    const materialBorder = new THREE.SpriteMaterial({
        map: textureborder
    })
    textureborder.minFilter = THREE.LinearFilter //THREE.LinearMipMapNearestFilter
    const border = new THREE.Sprite(materialBorder)

    const sprite = new THREE.Group()
    sprite.add(body)
    sprite.add(border)
    sprite.scale.set(scale.x, scale.y, scale.z)

    return { sprite, body, border }
}
