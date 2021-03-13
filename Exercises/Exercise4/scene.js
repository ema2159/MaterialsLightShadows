import * as THREE from "https://unpkg.com/three/build/three.module.js";
import {OrbitControls} from "https://unpkg.com/three/examples/jsm/controls/OrbitControls.js";
import "./node_modules/uil/build/uil.js";

const pi = Math.PI; // I am tired of writing Math.PI

// Setup scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdadada);

// Camera configuration
// Parameters: FOV, aspect ratio, minimum rendering distance, maximum rendering distance
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.x = 0;
camera.position.z = 0;

// Renderer setup
const renderer = new THREE.WebGLRenderer();
// Set renderer size (window size)
renderer.setSize(window.innerWidth, window.innerHeight);


// Auto resize
function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener( 'resize', resize, false );

// Setup orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, -2);
controls.listenToKeyEvents(window); // optional

// Append renderer to index.html body
document.body.appendChild(renderer.domElement);

// Cornel box
function createCornellBox(boxCenter, boxSide, lightIntensity, planeSegments) {
  const [x0, y0, z0] = boxCenter;
  const cornellPlaneGeometry = new THREE.PlaneBufferGeometry(
    boxSide,
    boxSide,
    ...planeSegments
  );

  const whiteLambertianMaterial = new THREE.MeshLambertMaterial({
    color: 0xe1e2d4,
    emissive: 0x2a2a2a,
    emissiveIntensity: 0.5,
    boxSide: THREE.DoubleSide,
  });
  const redLambertianMaterial = new THREE.MeshLambertMaterial({
    color: 0xe80202,
    emissive: 0x2a2a2a,
    emissiveIntensity: 0.5,
    boxSide: THREE.DoubleSide,
  });

  const greenLambertianMaterial = new THREE.MeshLambertMaterial({
    color: 0x0fcf02,
    emissive: 0x2a2a2a,
    emissiveIntensity: 0.5,
    boxSide: THREE.DoubleSide,
  });

  const leftWall = new THREE.Mesh(cornellPlaneGeometry, redLambertianMaterial);
  leftWall.rotation.y += pi / 2;
  leftWall.position.set(x0 - boxSide / 2, y0, z0);
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(
    cornellPlaneGeometry,
    greenLambertianMaterial
  );
  rightWall.rotation.y -= pi / 2;
  rightWall.position.set(x0 + boxSide / 2, y0, z0);
  scene.add(rightWall);

  const backWall = new THREE.Mesh(
    cornellPlaneGeometry,
    whiteLambertianMaterial
  );
  backWall.position.set(x0, y0, z0 - boxSide / 2);
  scene.add(backWall);

  const roof = new THREE.Mesh(cornellPlaneGeometry, whiteLambertianMaterial);
  roof.rotation.x += pi / 2;
  roof.position.set(x0, y0 + boxSide / 2, z0);
  scene.add(roof);

  const floor = new THREE.Mesh(cornellPlaneGeometry, whiteLambertianMaterial);
  floor.rotation.x -= pi / 2;
  floor.position.set(x0, y0 - boxSide / 2, z0);
  scene.add(floor);

  const light = new THREE.PointLight(0xffffff, lightIntensity, 100);
  light.position.set(x0, y0 + boxSide / 2 - 1, z0);
  scene.add(light);

  return [leftWall, rightWall, light];
}

const cornellBoxCenter = [0, 0, -7];
const [x0, y0, z0] = cornellBoxCenter;
const boxSize = 9;

const [leftWall, rightWall, light] = createCornellBox(cornellBoxCenter, boxSize, 2, [100, 100]);

// Add ambient light
let ambientLightIntensity = 0.3;
const ambientLight = new THREE.AmbientLight(0x404040, ambientLightIntensity); // soft white ambientLight
scene.add(ambientLight);


const lambertianProperties = {
  color: 0x0fcf02,
  emissive: 0x2a2a2a,
  emissiveIntensity: 0.5,
  opacity: 1,
  transparent: true
}
let lambertianMaterial = new THREE.MeshLambertMaterial({
  ...lambertianProperties
});

const phongMaterial = new THREE.MeshPhongMaterial({
  color: 0xe80202,
  shininess: 100,
  specular: 0xe80202,
});

const physicalMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x79e6f3,
});

// Cone
const coneProps = [1, 4, 100];
const coneGeometry1 = new THREE.ConeGeometry(...coneProps);
const cone1 = new THREE.Mesh(coneGeometry1, lambertianMaterial);
cone1.position.set(x0 - 2, y0 - boxSize / 2 + coneProps[1] / 2, z0 - 2);
scene.add(cone1);

// Cylinder
const cylinderProps = [1, 1, 4, 32];
const cylinderGeometry1 = new THREE.CylinderGeometry(...cylinderProps);
const cylinder1 = new THREE.Mesh(cylinderGeometry1, phongMaterial);
cylinder1.position.set(x0 + 2, y0 - boxSize / 2 + cylinderProps[2] / 2, z0 - 2);
scene.add(cylinder1);

// Sphere 1
const sphereProps = [1, 30, 30];
const sphereGeometry1 = new THREE.SphereGeometry(...sphereProps);
const sphere1 = new THREE.Mesh(sphereGeometry1, physicalMaterial);
sphere1.position.set(x0, y0 - boxSize / 2 + sphereProps[0], z0 + 1);
scene.add(sphere1);

// GUI
let ui = new UIL.Gui({css: "top:145px; left:20%;", size: 300, w:420, h:20, center:true})
    .onChange((debug) => {
    });
ui.add("title", {name: "Controls", h: 60});
// Add Walls controls
ui.add("color", {
  name: "Left Wall Color",
  callback: (color) => leftWall.material.color.setHex(color),
  type: "html",
  value: 0xe80202,
});
ui.add("color", {
  name: "Right Wall Color",
  callback: (color) => rightWall.material.color.setHex(color),
  type: "html",
  value: 0x0fcf02,
});
// Add Light intensity controls
ui.add('slide', {
  name:'Light intensity',
  callback: (intensity) => light.intensity = intensity,
  value:2, min:0, max:5, fontColor:'#FFFFFF', stype:1});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
