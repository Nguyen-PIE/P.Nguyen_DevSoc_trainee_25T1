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

Array(500).fill().forEach(addStar);


const floatingHead = new THREE.PlaneGeometry( 15, 15 );
const headTexture = new THREE.TextureLoader().load( 'me.jpg' );
const headMaterial = new THREE.MeshStandardMaterial({ 
  map: headTexture, 
  side: THREE.DoubleSide
});

const plane = new THREE.Mesh(floatingHead, headMaterial);
plane.position.set(-10, 0, 30); 
scene.add( plane );

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  
  plane.rotation.x += 0.01;
  plane.rotation.y += 0.5;
  plane.rotation.z += 0.5;

  camera.position.x = t * -0.00001;
  camera.position.y = t * -0.00001;
  camera.position.z = t * -0.001;
}

document.body.onscroll = moveCamera


function animate () {
  requestAnimationFrame( animate );
  sphere.rotation.x -= 0.0003;
  sphere.rotation.y += 0.01;

  controls.update();
  renderer.render( scene, camera );
}

animate();
