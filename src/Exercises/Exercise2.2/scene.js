import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";
import "./vendor/uil/build/uil.js";

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

// Setup orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, -2);

// Append renderer to index.html body
document.getElementById('content').appendChild(renderer.domElement);

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

const lambertianMaterial1 = new THREE.MeshLambertMaterial({
  color: 0x0fcf02,
  emissive: 0x2a2a2a,
  emissiveIntensity: 0.5,
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
const cone1 = new THREE.Mesh(coneGeometry1, lambertianMaterial1);
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

// GUI variables, function and creation
let ui2;
let screen2 = null;
let interactive = new THREE.Group();
scene.add(interactive);
let plane2 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 7, 2.312 , 5, 1 ), new THREE.MeshBasicMaterial( { transparent:true } ) );
plane2.position.z = -10;
plane2.position.y = 2;
plane2.position.x = 0;
plane2.name = 'p2';
plane2.visible = false;

interactive.add( plane2 );

let cw = 600, ch = 148;

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let mouse2d = new THREE.Vector2();

function raytest ( e ) {
  mouse.set( (e.clientX / window.innerWidth) * 2 - 1, - ( e.clientY / window.innerHeight) * 2 + 1 );
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( interactive.children );
  if ( intersects.length > 0 ){
    var uv = intersects[ 0 ].uv;
    mouse2d.x = Math.round( uv.x*cw );
    mouse2d.y = ch - Math.round( uv.y*ch );
    if( intersects[ 0 ].object.name === 'p2' ) {
      ui2.setMouse( mouse2d )
    }
    return true;
  } else {
    ui2.reset( true );
    return false;
  }
}

// Mouse events
function onMouseUp( e ){
  e.preventDefault();
  if(!controls.enabled) controls.enabled = true;
}

function onMouseDown( e ){
  e.preventDefault();
  // If clicking GUI element, stop orbit controls
  controls.enabled = raytest( e ) ? false : true;
}

function onMouseMove( e ) {
  e.preventDefault();
  raytest( e );
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

// GUI instantiation and elements
function initGUI2 () {
  ui2 = new UIL.Gui( { w:cw, maxHeight:ch, parent:null, isCanvas:true } ).onChange( function( v ){ } );

  ui2.add("color", {
    name: "Cone",
    callback: (color) => cone1.material.color.setHex(color),
    type: "html",
    value: 0x0fcf02,
  });
  ui2.add("color", {
    name: "Sphere",
    callback: (color) => sphere1.material.color.setHex(color),
    type: "html",
    value: 0x79e6f3,
  });
  ui2.add("color", {
    name: "Cylinder",
    callback: (color) => cylinder1.material.color.setHex(color),
    type: "html",
    value: 0xe80202,
  });

  ui2.onDraw = function () {

    if( screen2 === null ){

      screen2 = new THREE.Texture( this.canvas );
      screen2.minFilter = THREE.LinearFilter;
      screen2.needsUpdate = true;
      plane2.material.map = screen2;
      plane2.material.needsUpdate = true;
      plane2.visible = true;
      
    } else {

      screen2.needsUpdate = true;

    }

  }
}

// Create 3D GUI
initGUI2()

// Add mouse events
window.addEventListener( 'resize', resize, false );
document.addEventListener( 'pointerup', onMouseUp, false );
document.addEventListener( 'pointerdown', onMouseDown, false );
document.addEventListener( 'pointermove', onMouseMove, false );

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
