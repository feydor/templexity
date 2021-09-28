import './App.css';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { GUI } from 'three/examples/jsm/libs/dat.gui.module';

// three.js globals
let camera, scene, renderer;
let geometry, material, mesh;
const startingZ = 200;

const Pages = {
    P1: 0,
    P2: 1,
    P3: 2
};

function App() {
  const mountRef = useRef(null);
  const [page, setPage] = useState(Pages.P1);

  // setup three.js, mount renderer, animate, demount
  useEffect(() => {
    setupThree(mountRef);

    runPage(page);

    const changePage = () => {
      switch (page) {
        case Pages.P1:
          setPage(Pages.P2);
          break;
        case Pages.P2:
          setPage(Pages.P3);
          break;
        case Pages.P3:
          setPage(Pages.P1);
          break;
        default:
          setPage(Pages.P1);
          break;
      }
    };

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

const setupThree = (mountRef) => {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = startingZ;
  scene = new THREE.Scene();

  /*
  const gui = new GUI();
  const cameraFolder = gui.addFolder('Camera');
  cameraFolder.add(camera.position, 'z', 0, 10);
  cameraFolder.open();
  */

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  mountRef.current.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize, false);
  const controls = new OrbitControls( camera, renderer.domElement );
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.minPolarAngle = 0.8;
  controls.maxPolarAngle = 2.4;
  controls.dampingFactor = 0.07;
  controls.rotateSpeed = 0.07;
  controls.update();
}

const runPage = (page) => {
    switch (page) {
      case Pages.P1: page1(); break;
      case Pages.P2: page2(); break;
      case Pages.P3: page3(); break;
      default: console.log("default state"); break;
    }
}

// P1: arithmetic spirals infinitely inwards twoards Zero
const page1 = () => {
  const points = [];
  const ticks = 9999;
  let x = 0;
  let y = 0;
  let r = 0.1;
  const a = 1.00098;
  for (let t = 0; t < ticks; ++t) {
    r *= a;
    x = r * Math.cos(t);
    y = r * Math.sin(t);
    points.push(new THREE.Vector3(x, y, 0));
  }

  material = new THREE.LineBasicMaterial({ color: 0xffffff });
  geometry = new THREE.BufferGeometry().setFromPoints(points);
  mesh = new THREE.Line(geometry, material);
  scene.add(mesh);

  animateS1();
}

const page2 = () => {
  console.log("state2");
};
const page3 = () => {
  console.log("state3");
};

const animateS1 = () => {
  requestAnimationFrame(animateS1);
  // mesh.rotation.x += 0.02;
  // mesh.rotation.z += 0.001;
  camera.position.z -= 1;
  if (camera.position.z < 50) {
    camera.position.z = startingZ;
  }
  renderer.render(scene, camera);
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

export default App;
