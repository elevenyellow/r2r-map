import * as THREE from 'three'
import { textureLoader } from './utils'

export default function createSpriteBorder({ url, urlBorder, scale }) {
    // Loading body
    const material = new THREE.SpriteMaterial({
        map: textureLoader.load(url)
    })
    const body = new THREE.Sprite(material)
    material.map.minFilter = THREE.LinearFilter //THREE.LinearMipMapNearestFilter
    // textureLoaded.anisotropy = window.renderer.capabilities.getMaxAnisotropy()

    // Loading border
    const materialBorder = new THREE.SpriteMaterial({
        map: textureLoader.load(urlBorder)
    })
    materialBorder.map.minFilter = THREE.LinearFilter //THREE.LinearMipMapNearestFilter
    const border = new THREE.Sprite(materialBorder)

    const sprite = new THREE.Group()
    sprite.add(body)
    sprite.add(border)
    sprite.scale.set(scale.x, scale.y, scale.z)

    return { sprite, body, border }
}
