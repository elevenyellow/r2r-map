var angleV = 45 // vertical angle
var angleH = 45 // horizontal angle
var radius = 50 // or distance
var fov = 10 // the lower the better to respect the proportions (to be orthographic)
var width = window.innerWidth
var height = window.innerHeight
var camera = new THREE.PerspectiveCamera(
    fov,
    width / height, // aspect
    10, // near
    500 // far
)
var scene = new THREE.Scene()
var canvas = document.getElementById('canvas')
var renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: canvas
})
renderer.setClearColor('#000000')
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(width, height)
function animate(time) {
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}
animate()
window.addEventListener('resize', function() {
    width = window.innerWidth
    height = window.innerHeight
    updateCameraPosition(d3_transform)
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
})
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
//
//
//
//
//
// d3
var d3_transform
var zoom = d3
    .zoom()
    .scaleExtent([
        getScaleFromRadius(radius * 2),
        getScaleFromRadius(radius / 3)
    ])
    .on('zoom', function() {
        d3_transform = d3.event.transform
        return updateCameraPosition(d3_transform)
    })
var view = d3.select(renderer.domElement)
view.call(zoom)
var initial_scale = getScaleFromRadius(radius)
var initial_transform = d3.zoomIdentity
    .translate(width / 2, height / 2)
    .scale(initial_scale)
zoom.transform(view, initial_transform)
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
scene.add(new THREE.GridHelper(50, 100, 0xaaaaaa, 0x999999))
scene.add(new THREE.AxesHelper(5))
scene.add(
    new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({
            roughness: 0.4,
            metalness: 0.1
        })
    )
)
var dirLight = new THREE.DirectionalLight()
dirLight.position.set(1, 0.4, 0.2)
scene.add(dirLight, new THREE.AmbientLight(0x444444))
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
// pure
function polarToCartesian(angleV, angleH, radius) {
    var phi = ((90 - angleV) * Math.PI) / 180
    var theta = ((angleH + 180) * Math.PI) / 180
    return {
        x: -radius * Math.sin(phi) * Math.sin(theta),
        y: radius * Math.cos(phi),
        z: -radius * Math.sin(phi) * Math.cos(theta)
    }
}
function getScaleFromRadius(camera_radius_position) {
    var half_fov = fov / 2
    var half_fov_radians = (half_fov * Math.PI) / 180
    var half_fov_height = Math.tan(half_fov_radians) * camera_radius_position
    var fov_height = half_fov_height * 2
    var scale = height / fov_height // Divide visualization height by height derived from field of view
    return scale
}
function getRadiusFromScale(scale) {
    var half_fov = fov / 2
    var half_fov_radians = (half_fov * Math.PI) / 180
    var scale_height = height / scale
    var camera_radius_position = scale_height / (2 * Math.tan(half_fov_radians))
    return camera_radius_position
}
function panCamera(position, lookAt, x, y) {
    var worldUp = new THREE.Vector3(0, 1, 0).normalize()
    var distance = lookAt
        .clone()
        .sub(position)
        .normalize()
    var right = distance
        .clone()
        .cross(worldUp)
        .normalize()
    var up = distance.clone().cross(right)
    right.multiplyScalar(-x)
    up.multiplyScalar(-y)
    position = position
        .clone()
        .add(right)
        .add(up)
    lookAt = lookAt
        .clone()
        .add(right)
        .add(up)
    return {
        position: position,
        lookAt: lookAt
    }
}
function updateCameraPosition(d3_transform) {
    var scale = d3_transform.k
    var newRadius = getRadiusFromScale(scale)
    var cameraAngle = polarToCartesian(angleV, angleH, newRadius)
    var x = (d3_transform.x - width / 2) / scale
    var y = (d3_transform.y - height / 2) / scale
    var cameraPaned = panCamera(
        new THREE.Vector3(cameraAngle.x, cameraAngle.y, cameraAngle.z),
        new THREE.Vector3(0, 0, 0),
        x,
        y
    )
    var position = cameraPaned.position
    camera.position.set(position.x, position.y, position.z)
    camera.lookAt(cameraPaned.lookAt)
}
