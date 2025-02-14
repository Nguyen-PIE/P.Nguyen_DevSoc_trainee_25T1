import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Initialise scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Initialise camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Initialise renderer
const renderer  = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(30);
renderer.render(scene, camera);

// Create Earth
const earthTexture = new THREE.TextureLoader().load('https://github.com/Nguyen-PIE/P.Nguyen_DevSoc_trainee_25T1/blob/main/public/earth.jpg');
const mountainsTexture = new THREE.TextureLoader().load('./mountains.jpg');
const geometry = new THREE.SphereGeometry(15, 64, 32);
const material = new THREE.MeshStandardMaterial({ map: earthTexture, normalMap: mountainsTexture });
const sphere = new THREE.Mesh(geometry, material);
sphere.rotation.x = Math.PI / 10;

scene.add(sphere);

// Add lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Add grid helper (for debugging)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

// Function to add scattered stars in the scene
function addStar() {
  const geometry = new THREE.IcosahedronGeometry(0.15, 0);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  
  // Generate random position within a defined range
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(150));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(700).fill().forEach(addStar);

// Create Floating Head (Image Plane)
const floatingHead = new THREE.PlaneGeometry(12, 12);
const headTexture = new THREE.TextureLoader().load('./me.jpg');
const headMaterial = new THREE.MeshStandardMaterial({ 
  map: headTexture, 
  side: THREE.DoubleSide
});
const plane = new THREE.Mesh(floatingHead, headMaterial);
plane.position.set(-65, 8, -35);
plane.visible = false; // Initially hidden
scene.add(plane);

// Create the Sun (Bright Sphere)
const sunTexture = new THREE.TextureLoader().load('./sun_texture.jpg');
const sunGeometry = new THREE.SphereGeometry(40, 64, 32);
const sunMaterial = new THREE.MeshStandardMaterial({
  map: sunTexture,
  emissive: 0xffff00,
  emissiveMap: sunTexture,
  emissiveIntensity: 500,
  toneMapped: false
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);

// Position the sun far away
sun.position.set(400, 100, -700);
scene.add(sun);



// Camera movement variables
let scrollOffset = 0;
let baseRadius = 30;
let angle = 0;
const spiralSpeed = 0.009;
const expansionRate = 0.14;

// Function to move camera based on scroll
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  scrollOffset = -t * 0.1;

  angle = scrollOffset * spiralSpeed;
  let radius = baseRadius + scrollOffset * expansionRate;

  camera.position.x = radius * Math.cos(angle);
  camera.position.z = radius * Math.sin(angle);
  camera.position.y = Math.sin(angle * 0.5) * 10;

  camera.lookAt(sphere.position);

  plane.visible = true;
  plane.rotation.x += 0.01;
  plane.rotation.y += 0.01;
  plane.rotation.z += 0.01;
}

document.body.onscroll = moveCamera;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // sphere.rotation.x -= 0.0003;
  sphere.rotation.y += 0.01;

  controls.update();
  renderer.render(scene, camera);
}

animate();