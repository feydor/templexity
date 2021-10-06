import './App.css';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { GUI } from 'three/examples/jsm/libs/dat.gui.module';

// import Solver from './math.js';

// three.js globals
let renderer, currPage = 0;
const NUM_PAGES = 3;
let pages = []; // contains an object with a scene and a camera

class Page {
  constructor(scene, camera, npage) {
    this.scene = scene;
    this.camera = camera;
    this.npage = npage;
  }

  render() {
    renderer.render(this.scene, this.camera);
  }

  // currPageIndex is 0-indexed
  isCurrent(currPageIndex) {
    return (currPageIndex + 1) === this.npage;
  }
}

class Page1 extends Page {
  constructor() {
    const {scene, camera} = makeScene();

    const points = [];
    {
      const ticks = 999;
      let x = 0;
      let y = 0;
      let r = 0.1;
      const a = 1.00198;
      for (let t = 0; t < ticks; t += 0.1) {
        r *= a;
        x = r * Math.cos(t);
        y = r * Math.sin(t);
        points.push(new THREE.Vector3(x, y, 0));
      }
    }

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

    const points = [];
    {
      const ticks = 999;
      let x = 0;
      let y = 0;
      let r = 0.1;
      const a = 1.00198;
      for (let t = 0; t < ticks; t += 0.1) {
        r *= a;
        x = r * Math.cos(t);
        y = r * Math.sin(t);
        points.push(new THREE.Vector3(x, y, t));
      }
    }

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

function App() {
  const mountRef = useRef(null);
  // const [page, setPage] = useState(Pages.P1);

  // setup three.js, mount renderer, animate, demount
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  pages[0] = new Page1();
  pages[1] = new Page2();
  pages[2] = new Page3();

  useEffect(() => {
    mountRef.current.appendChild(renderer.domElement);
    window.addEventListener("resize", onWindowResize(pages[currPage].camera), false);

    const changePage = () => {
      if (++currPage >= NUM_PAGES) {
        currPage = 0;
      }
    };

    render();

    const currentRef = mountRef.current;
    document.getElementById('button').addEventListener('click', changePage);

    return () => {
      document.getElementById('button').removeEventListener('click', changePage);
      currentRef.removeChild(renderer.domElement);
    }
  });

  return (
    <div>
      <div className="THREE" ref={mountRef}></div>
      <button id="button" href="#"> > </button>
    </div>
  );
}

// P1: arithmetic spirals infinitely inwards towards Zero
const onWindowResize = (camera) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function makeScene() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
  const controls = new OrbitControls(camera, renderer.domElement);
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

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

const render = (time) => {
  time *= 0.001;
  resizeRendererToDisplaySize(renderer);

  for (const page of pages) {
    page.animate(time);
    if (page.isCurrent(currPage)) {
      page.render();
    }
  }

  requestAnimationFrame(render);
};

export default App;
