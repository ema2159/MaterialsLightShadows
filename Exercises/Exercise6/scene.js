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
// Enable shadows in scene
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
// Set renderer size (window size)
renderer.setSize(window.innerWidth, window.innerHeight);

// Auto resize
function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", resize, false);

// Setup orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, -2);
controls.listenToKeyEvents(window); // optional

// Append renderer to index.html body
document.body.appendChild(renderer.domElement);

// Cornel box function creator
function createCornellBox(
  boxCenter,
  boxSide,
  lightIntensity,
  lightColor,
  planeSegments
) {
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
  leftWall.receiveShadow = true;
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(
    cornellPlaneGeometry,
    greenLambertianMaterial
  );
  rightWall.rotation.y -= pi / 2;
  rightWall.position.set(x0 + boxSide / 2, y0, z0);
  rightWall.receiveShadow = true;
  scene.add(rightWall);

  const backWall = new THREE.Mesh(
    cornellPlaneGeometry,
    whiteLambertianMaterial
  );
  backWall.position.set(x0, y0, z0 - boxSide / 2);
  backWall.receiveShadow = true;
  scene.add(backWall);

  const roof = new THREE.Mesh(cornellPlaneGeometry, whiteLambertianMaterial);
  roof.rotation.x += pi / 2;
  roof.position.set(x0, y0 + boxSide / 2, z0);
  scene.add(roof);

  const floor = new THREE.Mesh(cornellPlaneGeometry, whiteLambertianMaterial);
  floor.rotation.x -= pi / 2;
  floor.position.set(x0, y0 - boxSide / 2, z0);
  floor.receiveShadow = true;
  scene.add(floor);

  let light = new THREE.PointLight(lightColor, lightIntensity, 100);
  let lightPosition = [x0, y0 + boxSide / 2 - 1, z0];
  light.position.set(...lightPosition);
  light.castShadow = true;
  scene.add(light);

  return [leftWall, rightWall, light, lightPosition];
}

// Cornell Box properties
const cornellBoxCenter = [0, 0, -7];
const [x0, y0, z0] = cornellBoxCenter;
const boxSize = 9;

// Light properties (for GUI)
let lightColor = 0xffffff;
let lightIntensity = 2;
let lightTarget = [0, -3.5, -6];
const targetObject = new THREE.Object3D(); // Target object for light to track
targetObject.position.set(...lightTarget);
scene.add(targetObject);

// Add ambient light
let ambientLightIntensity = 1;
const ambientLight = new THREE.AmbientLight(0x404040, ambientLightIntensity); // soft white ambientLight
scene.add(ambientLight);

// Create Cornell Box
let [
  leftWall,
  rightWall,
  light,
  lightPosition,
] = createCornellBox(cornellBoxCenter, boxSize, lightIntensity, lightColor, [
  100,
  100,
]);

// Light helper
let activateHelper = false;
let helper = new THREE.PointLightHelper(light);

// Materials
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
cone1.castShadow = true; //default is false
cone1.receiveShadow = false; //default
scene.add(cone1);

// Cylinder
const cylinderProps = [1, 1, 4, 32];
const cylinderGeometry1 = new THREE.CylinderGeometry(...cylinderProps);
const cylinder1 = new THREE.Mesh(cylinderGeometry1, phongMaterial);
cylinder1.position.set(x0 + 2, y0 - boxSize / 2 + cylinderProps[2] / 2, z0 - 2);
cylinder1.castShadow = true; //default is false
cylinder1.receiveShadow = false; //default
scene.add(cylinder1);

// Sphere 1
const sphereProps = [1, 30, 30];
const sphereGeometry1 = new THREE.SphereGeometry(...sphereProps);
const sphere1 = new THREE.Mesh(sphereGeometry1, physicalMaterial);
sphere1.position.set(x0, y0 - boxSize / 2 + sphereProps[0], z0 + 1);
sphere1.castShadow = true; //default is false
sphere1.receiveShadow = false; //default
scene.add(sphere1);

// GUI
let ui = new UIL.Gui({
  css: "top:145px; left:20%;",
  size: 300,
  w: 420,
  h: 20,
  center: true,
});
ui.add("title", {name: "Controls", h: 60});
ui.add("list", {
  name: "Lighting",
  callback: (lightTime) => {
    scene.remove(light);
    if (activateHelper) {
      scene.remove(helper);
    }
    switch (lightTime) {
      case "Point light":
        light = new THREE.PointLight(parseInt(lightColor), lightIntensity, 100);
        helper = new THREE.PointLightHelper(light);
        break;
      case "Directional light":
        console.log(parseInt(lightColor));
        light = new THREE.DirectionalLight(
          parseInt(lightColor),
          lightIntensity
        );
        light.target = targetObject;
        helper = new THREE.DirectionalLightHelper(light, 5);
        break;
      case "Spot light":
        light = new THREE.SpotLight(parseInt(lightColor), lightIntensity);
        light.target = targetObject;
        helper = new THREE.SpotLightHelper(light);
        break;
      case "Hemisphere light":
        light = new THREE.HemisphereLight(
          parseInt(lightColor),
          0x080820,
          lightIntensity
        );
        helper = new THREE.HemisphereLightHelper(light);
        break;
      default:
        console.log("Invalid option. Should be unreachable.");
        break;
    }
    if (activateHelper) {
      scene.add(helper);
    }
    light.position.set(...lightPosition);
    light.castShadow = true;
    scene.add(light);

  },
  list: ["Point light", "Directional light", "Spot light", "Hemisphere light"],
});

// Ambient light controlls
ui.add("slide", {
  name: "Ambient light",
  callback: (intensity) => {
    ambientLight.intensity = intensity;
  },
  value: ambientLightIntensity,
  min: 0,
  max: 5,
  fontColor: "#FFFFFF",
  stype: 1,
});

// Add Light properties controls
ui.add("slide", {
  name: "Light intensity",
  callback: (intensity) => {
    lightIntensity = intensity;
    light.intensity = lightIntensity;
  },
  value: lightIntensity,
  min: 0,
  max: 5,
  fontColor: "#FFFFFF",
  stype: 1,
});
ui.add("color", {
  name: "Light color",
  callback: (color) => {
    lightColor = color;
    light.color.setHex(lightColor);
  },
  type: "html",
  value: lightColor,
});
ui.add("bool", {
  name: "Light helper",
  callback: (activate) => {
    activateHelper = activate;
    if (activate) {
      scene.add(helper);
    } else {
      scene.remove(helper);
    }
  },
  value: activateHelper,
});
ui.add("number", {
  name: "Position",
  callback: (position) => {
    lightPosition = position;
    light.position.set(...lightPosition);
  },
  value: lightPosition,
});
ui.add("slide", {
  name: "Target X",
  callback: (targetX) => {
    targetObject.position.setX(targetX);
    light.target = targetObject;
    if (activateHelper) {
      helper.update();
    }
  },
  value: lightTarget[0],
  min: -10,
  max: 10,
});
ui.add("slide", {
  name: "Target Y",
  callback: (targetY) => {
    targetObject.position.setY(targetY);
    light.target = targetObject;
    if (activateHelper) {
      helper.update();
    }
  },
  value: lightTarget[1],
  min: -10,
  max: 10,
});
ui.add("slide", {
  name: "Target Z",
  callback: (targetZ) => {
    targetObject.position.setZ(targetZ);
    light.target = targetObject;
    if (activateHelper) {
      helper.update();
    }
  },
  value: lightTarget[2],
  min: -10,
  max: 10,
});
ui.add("title", {name: "Shadow properties (some depend on the light)", h: 60});
ui.add("slide", {
  name: "Penumbra",
  callback: (value) => {
    light.penumbra = value;
  },
  value: 1,
  min: 0,
  max: 1,
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
