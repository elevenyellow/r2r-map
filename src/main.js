import * as THREE from 'three'
import * as d3 from './d3'
import ThreePanCamera from '/mnt/c/Users/enzo/drive/projects/three-pan-camera/dist/three-pan-camera.esm.js'

const Iso = ThreePanCamera({
    canvas: document.getElementById('canvas'),
    THREE,
    d3
})
// const scene = Iso.scene
// const renderer = Iso.renderer
