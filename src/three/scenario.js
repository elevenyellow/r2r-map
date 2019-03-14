import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import SVGLoader from './SVGLoader'

const textureLoader = new THREE.TextureLoader()
const svgloader = new SVGLoader()

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
    mesh.position.y -= 0.1
    mesh.rotation.x = -Math.PI / 2
    mesh.scale.set(200, 200, 200)
    scene.add(mesh)
    return mesh
}

// https://gamedev.stackexchange.com/questions/167762/how-to-avoid-the-cutoff-of-a-sprite-when-overlapping-in-a-terrain?noredirect=1#comment298081_167762
export function createBuildingSprite({ scene, spriteConf, x, z }) {
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

export function createDecorativeSprite({ scene, spriteConf, x, z }) {
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

export function createTroopsSprite({ scene, spriteConf, fromX, fromZ }) {
    const textureLoaded = textureLoader.load(spriteConf.url)
    const material = new THREE.SpriteMaterial({
        map: textureLoaded
    })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(spriteConf.scale.x, spriteConf.scale.y, spriteConf.scale.z)
    sprite.position.x = fromX
    sprite.position.z = fromZ
    scene.add(sprite)
    return sprite
}

export function createArrowLine({ scene, arrowConf }) {
    const arrows = new THREE.Group()
    const tweens = []
    scene.add(arrows)

    svgloader.load(arrowConf.url, paths => {
        const arrow = new THREE.Group()
        arrow.scale.set(arrowConf.scale.x, arrowConf.scale.y, arrowConf.scale.z)
        // arrow.position.y = 0.1
        arrow.position.x += arrowConf.offsetX
        arrow.position.z += arrowConf.offsetZ
        arrow.rotation.x = -Math.PI / 2
        // arrow.position.x += arrowConf.separation * 2
        // arrows.add(arrow)

        for (let i = 0; i < paths.length; i++) {
            const path = paths[i]
            const material = new THREE.MeshBasicMaterial({
                color: path.color,
                side: THREE.DoubleSide,
                depthWrite: false,
                transparent: true
            })
            const shapes = path.toShapes(true)
            for (let j = 0; j < shapes.length; j++) {
                const shape = shapes[j]
                const geometry = new THREE.ShapeBufferGeometry(shape)
                const mesh = new THREE.Mesh(geometry, material)
                arrow.add(mesh)
            }
        }

        for (let i = 0; i < arrowConf.quantity; i++) {
            const arr = arrow.clone()
            const origin = arr.position.x
            const destiny = origin + arrowConf.separation * arrowConf.quantity
            const time = arrowConf.time
            const delay = time / arrowConf.quantity
            arr.children[0].material = arrow.children[0].material.clone()
            // arr.position.x = origin
            arr.position.x = arrowConf.separation * i
            arrows.add(arr)

            // const tween = new TWEEN.Tween({ x: origin, opacity: 1 })
            //     .to({ x: destiny, opacity: 0.2 }, time)
            //     // .easing(TWEEN.Easing.Quadratic.InOut)
            //     .repeat(Infinity)
            //     .delay(delay * i)
            //     .repeatDelay(0)
            //     .onUpdate(o => {
            //         arr.position.x = o.x
            //         arr.children[0].material.opacity = o.opacity
            //     })
            //     .start() // Start the tween immediately.

            // tweens.push(tween)
        }
    })

    return { arrows, tweens }
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
