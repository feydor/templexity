// Page.js - page classes with animation methods
import {gRenderer, THREE} from './Globals.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class Page {
  constructor(scene, camera, npage) {
    this.scene = scene;
    this.camera = camera;
    this.npage = npage;
  }

  render() {
    gRenderer.render(this.scene, this.camera);
  }

  // currPageIndex is 0-indexed
  isCurrent(currPageIndex) {
    return (currPageIndex + 1) === this.npage;
  }
}

// P1: arithmetic spirals infinitely inwards towards Zero
// equ: r = a*r(t), x = r*cos(t), y = r*sin(t)
class Page1 extends Page {
  constructor() {
    const {scene, camera} = makeScene();

    const points = createLogarithmicSpiral(1.00198, 0.05, 0.07);
    // const points = createLogarithmicSpiral(1.00198, 0.05, 0.0001, false);

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x00d333, linewidth: 20 });
    const mesh = new THREE.Line(geometry, material);
    scene.add(mesh);
    scene.mesh = mesh;
    camera.position.set(0, 0, 2);
    camera.lookAt(0, 0, 0);

    super(scene, camera, 1);
  }

  animate(time) {
    this.scene.mesh.rotation.z = time * 1;
  }
}

class Page2 extends Page {
  constructor() {
    const {scene, camera} = makeScene();
    camera.position.z = 3333;
    camera.lookAt(0, 0, 0);

    const geometry = new THREE.IcosahedronGeometry(666);
    const material = new THREE.MeshBasicMaterial({ color:0x00d333, wireframe: true });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.flatShading = true;
    scene.add(mesh);
    const light = new THREE.AmbientLight( { color: 0x404040, intensity: 1.2 } );
    scene.add(light);
    scene.mesh = mesh;

    super(scene, camera, 2);
  }

  animate(time) {
    this.scene.mesh.rotation.x = time * -0.1;
    this.scene.mesh.rotation.y = time * 0.1;
  }
}

class Page3 extends Page {
  constructor() {
    const {scene, camera} = makeScene();

    const points = createArithmeticSpiral(3, 1.3, phi => {
      if (Math.round(phi) % 2 === 0) {
        return 5.1*phi;
      } else {
        return 4.1*phi;
      }
    });

    const material = new THREE.LineBasicMaterial({ color: 0x00d333, linewidth: 20 });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const mesh = new THREE.Line(geometry, material);
    scene.add(mesh);
    scene.mesh = mesh;
    camera.position.set( -200, -100, 1000 );
    camera.lookAt( 0, 0, 0 );

    super(scene, camera, 3);
  }

  animate(time) {
    this.scene.mesh.rotation.z = time * 1;
    const bounds = 600;
    if (this.camera.position.x >= bounds) this.camera.position.x = bounds;
  }
}

// spiral eq: r = r(φ), x = r*cos(φ), y = r*sin(φ)
// arithmetic: r(φ) = a*φ
// logarithmic: r(φ) = e^(k*φ)
function createSpiral(initialRadius, deltaRadius = phi => phi,
    deltaZ = phi => 0, deltaPhi = phi => phi+0.4 ) {
  const points = [];
  const degrees = 360*3;
  let pos = {x: 0, y: 0, z: 0};
  let r = initialRadius;
  for (let phi = 0; phi <= degrees; phi = deltaPhi(phi)) {
    r = deltaRadius(phi);
    
    // convert polar coordinate (r, φ) into cartesian
    pos.x = r * Math.cos(phi);
    pos.y = r * Math.sin(phi);
    pos.z = deltaZ(phi);
    points.push(new THREE.Vector3(pos.x, pos.y, pos.z));
  }
  return points;
}

function createArithmeticSpiral(initialRadius, amplitude, deltaZ = phi => 0) {
  return createSpiral(initialRadius, phi => amplitude*phi, deltaZ);
}

function createLogarithmicSpiral(initialRadius, amplitude, k, deltaZ = phi => 0) {
  return createSpiral(initialRadius,
    phi => amplitude * (Math.E ** (k*phi)),
    deltaZ, phi => 0.1+phi);
}

function makeScene() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
  const controls = new OrbitControls(camera, gRenderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = true;
  controls.enableDamping = true;
  controls.minPolarAngle = 0.8;
  controls.maxPolarAngle = 2.4;
  controls.dampingFactor = 0.07;
  controls.rotateSpeed = 0.07;
  controls.update();

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  return {scene, camera};
};

export {Page1, Page2, Page3};
