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

    const points = createLogarithmicSpiral(1.00198, 0.05, 0.0001, false);

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

    const points = createArithmeticSpiral(1.00198, 0.1, true);

    const material = new THREE.LineBasicMaterial({ color: 0x00d333, linewidth: 20 });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const mesh = new THREE.Line(geometry, material);
    scene.add(mesh);
    scene.mesh = mesh;
    camera.position.set( 500, 1000, 200 );
    camera.lookAt( 0, 0, 0 );

    super(scene, camera, 3);
  }

  animate(time) {
    this.scene.mesh.rotation.z = time * 1;
  }
}

function createArithmeticSpiral(a, r_i, rising) {
  const points = [];
  const ticks = 999;
  let x = 0;
  let y = 0;
  let z = 0;
  let r = r_i;
  for (let t = 0; t < ticks; t += 0.1) {
    r *= a;
    x = r * Math.cos(t);
    y = r * Math.sin(t);
    z = rising ? t : 0;
    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
}

function createLogarithmicSpiral(a, r_i, k, rising) {
  const points = [];
  const ticks = 999;
  let x = 0;
  let y = 0;
  let z = 0;
  let r = r_i;
  for (let t = 0; t < ticks; t += 0.1) {
    r *= a * (Math.E ** (k*t));
    x = r * Math.cos(t);
    y = r * Math.sin(t);
    z = rising ? t : 0;
    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
}

function makeScene() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
  const controls = new OrbitControls(camera, gRenderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;
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
