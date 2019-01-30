import * as THREE from 'three'

function pointyHexagonalCorner(center_x, center_y, size, i) {
    const angle_deg = 60 * i
    const angle_rad = (Math.PI / 180) * angle_deg
    return [
        center_x + size * Math.cos(angle_rad),
        center_y + size * Math.sin(angle_rad)
    ]
}

function getHexagonPoints(size) {
    const points = []
    for (let i = 0; i < 6; ++i) {
        points.push(pointyHexagonalCorner(0, 0, size, i))
    }
    return points
}

function createHexagon(size, color) {
    const shape = new THREE.Shape()
    const points = getHexagonPoints(size)
    points.forEach((point, index) => {
        index === 0
            ? shape.moveTo(point[0], point[1])
            : shape.lineTo(point[0], point[1])
    })

    // // LINE MATERIAL
    // shape.autoClose = true;
    // var points = shape.getPoints();
    // var spacedPoints = shape.getSpacedPoints( 50 );
    // var geometryPoints = new THREE.BufferGeometry().setFromPoints( points );
    // var geometrySpacedPoints = new THREE.BufferGeometry().setFromPoints( spacedPoints );
    // // var mesh = new THREE.Points( geometrySpacedPoints, new THREE.PointsMaterial( { color: color, size: 1 } ) );
    // var mesh = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial( { color: color,
    // 	linewidth: 20,
    //  } ) );

    const geometry = new THREE.ShapeGeometry(shape)
    const material = new THREE.MeshBasicMaterial({ color: color })
    // material.transparent = true
    material.opacity = 0.2
    const mesh = new THREE.Mesh(geometry, material)

    mesh.position.y += 0.1
    mesh.rotation.x = -Math.PI / 2
    return mesh
}

function getPositionByCordinate(col, row, size) {
    const hor_distance = Math.sqrt(3) * size
    const ver_distance = (2 * size * 3) / 4
    return [
        row % 2 === 0
            ? col * hor_distance
            : col * hor_distance - hor_distance / 2,
        row * ver_distance
    ]
}

function createAndPlaceHexagon(col, row, size, color) {
    const hexagon = createHexagon(size, color)
    const position = getPositionByCordinate(col, row, size)
    hexagon.position.x = position[1]
    hexagon.position.z = -position[0]
    return hexagon
}

export default function go({ scene, renderer }) {
    const size = 3
    scene.add(createAndPlaceHexagon(0, 0, size, 0xff00ff))

    for (let i = 0; i < 6; ++i) {
        scene.add(createAndPlaceHexagon(i, 0, size, 0xff00ff))
        scene.add(createAndPlaceHexagon(i, 1, size, 0x2260ff))
        scene.add(createAndPlaceHexagon(i, 2, size, 0xa5026f))
        scene.add(createAndPlaceHexagon(i, 3, size, 0x026fff))
        scene.add(createAndPlaceHexagon(i, 4, size, 0xff00ff))
        scene.add(createAndPlaceHexagon(i, 5, size, 0x260f0ff))
    }

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    // elements
    // http://jsfiddle.net/JesusMira/ttwv46nv/15/
    // sprites
    // http://stemkoski.github.io/Three.js/Sprites.html
    var textureLoader = new THREE.TextureLoader()
    var spriteMap = new textureLoader.load('assets/obj/tree.png')
    var spriteMap2 = new textureLoader.load('assets/obj/tree2.png')
    var spriteMap3 = new textureLoader.load('assets/obj/tree3.png')
    var spriteMap4 = new textureLoader.load('assets/obj/tree4.png')
    var spriteMap5 = new textureLoader.load('assets/obj/bush.png')
    var spriteMap6 = new textureLoader.load('assets/obj/rock.png')
    var spriteMap7 = new textureLoader.load('assets/obj/rock2.png')
    var spriteMap8 = new textureLoader.load('assets/obj/tree5.png')
    var spriteMap9 = new textureLoader.load('assets/obj/trunk.png')
    var spriteMaterial = new THREE.SpriteMaterial({
        map: spriteMap,
        color: 0xffffff
    })
    var spriteMaterial2 = new THREE.SpriteMaterial({
        map: spriteMap2,
        color: 0xffffff
    })
    var spriteMaterial3 = new THREE.SpriteMaterial({
        map: spriteMap3,
        color: 0xffffff
    })
    var spriteMaterial4 = new THREE.SpriteMaterial({
        map: spriteMap4,
        color: 0xffffff
    })
    var spriteMaterial5 = new THREE.SpriteMaterial({
        map: spriteMap5,
        color: 0xffffff
    })
    var spriteMaterial6 = new THREE.SpriteMaterial({
        map: spriteMap6,
        color: 0xffffff
    })
    var spriteMaterial7 = new THREE.SpriteMaterial({
        map: spriteMap7,
        color: 0xffffff
    })
    var spriteMaterial8 = new THREE.SpriteMaterial({
        map: spriteMap8,
        color: 0xffffff
    })
    var spriteMaterial9 = new THREE.SpriteMaterial({
        map: spriteMap9,
        color: 0xffffff
    })
    var sprite = new THREE.Sprite(spriteMaterial)
    var sprite2 = new THREE.Sprite(spriteMaterial2)
    var sprite3 = new THREE.Sprite(spriteMaterial3)
    var sprite4 = new THREE.Sprite(spriteMaterial4)
    var sprite5 = new THREE.Sprite(spriteMaterial5)
    var sprite6 = new THREE.Sprite(spriteMaterial6)
    var sprite7 = new THREE.Sprite(spriteMaterial7)
    var sprite8 = new THREE.Sprite(spriteMaterial8)
    var sprite9 = new THREE.Sprite(spriteMaterial9)

    sprite.scale.set(1, 1, 1)
    sprite.position.y += 0.5
    sprite.position.x += 1.25
    scene.add(sprite)

    sprite2.scale.set(1, 1, 1)
    sprite2.position.y += 0.5
    sprite2.position.z += 1.25
    scene.add(sprite2)

    sprite3.scale.set(1.5, 1.5, 1.5)
    sprite3.position.y += 0.75
    scene.add(sprite3)

    sprite4.scale.set(1, 1, 1)
    sprite4.position.y += 0.5
    sprite4.position.x -= 1.25
    sprite4.position.z += 1.25
    scene.add(sprite4)

    sprite5.scale.set(0.5, 0.5, 0.5)
    sprite5.position.y += 0.25
    sprite5.position.z -= 1.25
    scene.add(sprite5)

    sprite6.scale.set(1, 1, 1)
    sprite6.position.y += 0.5
    sprite6.position.x -= 1.25
    scene.add(sprite6)

    sprite7.scale.set(1, 1, 1)
    sprite7.position.y += 0.5
    sprite7.position.x -= 1.25
    sprite7.position.z -= 1.25
    scene.add(sprite7)

    sprite8.scale.set(0.5, 0.5, 0.5)
    sprite8.position.y += 0.25
    sprite8.position.x += 1.25
    sprite8.position.z -= 1.25
    scene.add(sprite8)

    sprite9.scale.set(0.75, 0.75, 0.75)
    sprite9.position.y += 0.375
    sprite9.position.x += 1.25
    sprite9.position.z += 1.25
    scene.add(sprite9)

    var maxAnisotropy = renderer.capabilities.getMaxAnisotropy()

    // var texture1 = textureLoader.load( "assets/crate.gif" );
    var texture1 = textureLoader.load('assets/tile2.png')
    // var texture1 = textureLoader.load( "assets/Green_grass_ground_land_dirt_aerial_top_seamless_texture.jpg" );
    // var texture1 = textureLoader.load( "assets/grass.jpg" );
    var material1 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: texture1
    })

    texture1.anisotropy = maxAnisotropy
    texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping
    texture1.repeat.set(512, 512)

    const geometry = new THREE.PlaneBufferGeometry(100, 100)

    var mesh1 = new THREE.Mesh(geometry, material1)
    mesh1.position.y -= 0.2
    mesh1.rotation.x = -Math.PI / 2
    mesh1.scale.set(200, 200, 200)
    scene.add(mesh1)

    // scene.add(new THREE.GridHelper(50, 100, 0xaaaaaa, 0x999999))
    // scene.add(new THREE.AxesHelper(10))
}
