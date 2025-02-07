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
const geometry = new THREE.SphereGeometry( 15, 64, 32 ); 
const material = new THREE.MeshStandardMaterial( { map: earthTexture } ); 
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

function animate () {
  requestAnimationFrame( animate );
  sphere.rotation.x -= 0.001;
  sphere.rotation.y += 0.01;
  controls.update();
  renderer.render( scene, camera );
}

animate();
