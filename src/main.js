import * as THREE from 'three'
import * as d3 from './d3'
import ThreeGameCamera from '/mnt/c/Users/enzo/drive/projects/three-game-camera/'
import go from './code'

const canvas = document.getElementById('canvas')
const Iso = ThreeGameCamera({ canvas, THREE, d3 })
const scene = Iso.scene
const renderer = Iso.renderer

go({ scene, renderer })
