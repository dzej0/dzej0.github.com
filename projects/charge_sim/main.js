import * as THREE from 'three'
import { TrackballControls } from 'three/addons/controls/TrackballControls.js'
import { PhysObj } from './objects/physObj'
import { addButtonEvents } from './user_input'
import { paused } from './user_input'

const screen = document.getElementById("sim")

const width = 1200
const height = 800

const aspectRatio = width / height

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, aspectRatio, 0.1, 200000)

// renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)
screen.appendChild(renderer.domElement)

let controls
const clock = new THREE.Clock()
const cameraLight = new THREE.PointLight(0xffffff, 1, 0, 4)

// initial object
let bolo

function addXYZaxes(length) {
  const pointsX = [new THREE.Vector3(-length, 0, 0), new THREE.Vector3(length, 0, 0)]
  const pointsY = [new THREE.Vector3(0, -length, 0), new THREE.Vector3(0, length, 0)]
  const pointsZ = [new THREE.Vector3(0, 0, -length), new THREE.Vector3(0, 0, length)]

  const XAxisMaterial = new THREE.LineBasicMaterial({color:0xaa0000})
  const YAxisMaterial = new THREE.LineBasicMaterial({color:0x00aa00})
  const ZAxisMaterial = new THREE.LineBasicMaterial({color:0x0000aa})

  const Xaxisgeometry = new THREE.BufferGeometry().setFromPoints(pointsX)
  const Yaxisgeometry = new THREE.BufferGeometry().setFromPoints(pointsY)
  const Zaxisgeometry = new THREE.BufferGeometry().setFromPoints(pointsZ)

  const Xaxis = new THREE.Line(Xaxisgeometry,XAxisMaterial)
  const Yaxis = new THREE.Line(Yaxisgeometry,YAxisMaterial)
  const Zaxis = new THREE.Line(Zaxisgeometry,ZAxisMaterial)

  scene.add(Xaxis, Yaxis, Zaxis)
}

function init() {
  new PhysObj(0, 1, -5, new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0), scene)
  new PhysObj(1, 1,  5, new THREE.Vector3(0,0,1), new THREE.Vector3(3,0,0), scene)
  new PhysObj(1, 1, 5, new THREE.Vector3(0,0,0), new THREE.Vector3(3,5,0), scene)
  console.log(PhysObj.objectList)

  const ambientLighting = new THREE.AmbientLight(0xffffff, 0.8)

  scene.add(cameraLight)
  scene.add(ambientLighting)
  camera.position.z = 50
  screen.appendChild( renderer.domElement )
  
  controls = new TrackballControls( camera, renderer.domElement )
  
  controls.rotateSpeed = 1;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.keys = [ 'KeyA', 'KeyS', 'KeyD' ]
  // todo usunac?
  // screen.addEventListener('click', () => {
    
  // })

  addXYZaxes(2000)
}

let delta 
let precision
function animate() {
  requestAnimationFrame(animate)

  delta = clock.getDelta()

  precision = document.getElementById("sim-precision").value
  if (!paused) {
    PhysObj.tick((1/precision)*delta)
    //console.log(precision)
  }

  controls.update()

  cameraLight.position.set(camera.position)

  renderer.render(scene,camera)
}

function debug() {
  console.log(bolo)
}

// debug
document.addEventListener('keydown', (key) => {
  if (key.key == 'k') {
    console.log(camera.rotation)
    console.log(`paused: ${paused}`)
    debug()
  }

  if (key.key == 'm') {
    PhysObj.tick(1)
  }

  if (key.key == 'r') {
    bolo.worldObject.position.set(100,0,100)
  }

  if (key.key == 'd') {
    console.log(PhysObj.objectList)
  }

  if (key.key == 'a') {
    PhysObj.editObject(2, (object) => {
      object.changePosition(new THREE.Vector3(0,4,0))
      let stolo = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshStandardMaterial({color:0x00ff00}))
      console.log(object)
      object.worldObject = stolo
    })
  }
})

document.getElementById("clear_button").addEventListener("click", () => {
    PhysObj.objectList.forEach((obj) => {
      scene.remove(obj.worldObject)
    })
    PhysObj.objectList = []
})

document.addEventListener("DOMContentLoaded", () => {
  init()
  animate()
  addButtonEvents(scene)
})