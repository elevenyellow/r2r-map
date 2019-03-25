import * as THREE from 'three'
import { textureLoader } from './utils'

// https://gamedev.stackexchange.com/questions/167762/how-to-avoid-the-cutoff-of-a-sprite-when-overlapping-in-a-terrain?noredirect=1#comment298081_167762
export default function createTerrain({ renderer, url }) {
    const geometry = new THREE.PlaneBufferGeometry(100, 100)
    const textureLoaded = textureLoader.load(url)
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: textureLoaded
    })
    const terrain = new THREE.Mesh(geometry, material)
    textureLoaded.anisotropy = renderer.capabilities.getMaxAnisotropy()
    textureLoaded.wrapS = textureLoaded.wrapT = THREE.RepeatWrapping
    textureLoaded.repeat.set(512, 512)
    terrain.position.y -= 0.5
    terrain.rotation.x = -Math.PI / 2
    terrain.scale.set(200, 200, 200)
    return terrain
}
