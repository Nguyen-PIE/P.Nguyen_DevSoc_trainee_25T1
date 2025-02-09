import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Set background to black

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer  = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(30);

renderer.render( scene, camera );

const earthTexture = new THREE.TextureLoader().load( 'earth.jpg' );
const mountainsTexture = new THREE.TextureLoader().load( 'mountains.jpg' );
const geometry = new THREE.SphereGeometry( 15, 64, 32 ); 
const material = new THREE.MeshStandardMaterial( { map: earthTexture, normalMap: mountainsTexture } ); 
const sphere = new THREE.Mesh( geometry, material ); 


scene.add( sphere );

const pointLight = new THREE.PointLight( 0xffffff )
pointLight.position.set(5,5,5)

const ambientLight = new THREE.AmbientLight( 0xffffff )
scene.add(pointLight, ambientLight)

const gridHelper = new THREE.GridHelper(200,50);
scene.add(gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.IcosahedronGeometry(0.15, 0)
  const material = new THREE.MeshStandardMaterial( { color: 0xffffff } )
  const star = new THREE.Mesh( geometry, material );

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(150));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(700).fill().forEach(addStar);


const floatingHead = new THREE.PlaneGeometry( 12, 12 );
const headTexture = new THREE.TextureLoader().load( 'me.jpg' );
const headMaterial = new THREE.MeshStandardMaterial({ 
  map: headTexture, 
  side: THREE.DoubleSide
});

const plane = new THREE.Mesh(floatingHead, headMaterial);
plane.position.set(-65, 8, -35); 
scene.add( plane );

let scrollOffset = 0;
let baseRadius = 30; // Initial distance from the sphere
let angle = 0; // Angle around the sphere
const spiralSpeed = 0.009; // Slower rotation per scroll
const expansionRate = 0.14; // Slower outward movement

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  scrollOffset = -t * 0.1; // Scale scroll effect

  angle = scrollOffset * spiralSpeed; // Rotate based on scroll
  let radius = baseRadius + scrollOffset * expansionRate; // Expand out

  // Set new camera position in a spiral orbit
  camera.position.x = radius * Math.cos(angle);
  camera.position.z = radius * Math.sin(angle);
  camera.position.y = Math.sin(angle * 0.5) * 10; // Smooth height oscillation

  camera.lookAt(sphere.position); // Keep looking at the sphere

  plane.rotation.x += 0.01;
  plane.rotation.y += 0.01;
  plane.rotation.z += 0.01;
}

document.body.onscroll = moveCamera;

function animate () {
  requestAnimationFrame( animate );
  sphere.rotation.x -= 0.0003;
  sphere.rotation.y += 0.01;

  controls.update();
  renderer.render( scene, camera );
}

animate();
