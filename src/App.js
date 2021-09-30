import './App.css';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { GUI } from 'three/examples/jsm/libs/dat.gui.module';

import Solver from './math.js';

// three.js globals
let scene, camera, renderer;

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
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 0;
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

    runPage(page);

    const changePage = () => {
      scene.remove.apply(scene, scene.children);
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
      <p>({Solver.quadratic(2, 4, 2)[0]}, {Solver.quadratic(2, 4, 2)[1]})</p>
      <div className="THREE" ref={mountRef}></div>
      <button id="button" href="#"> > </button>
    </div>
  );
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
  const a = 1.00298;
  for (let t = 0; t < ticks; ++t) {
    r *= a;
    x = r * Math.cos(t);
    y = r * Math.sin(t);
    points.push(new THREE.Vector3(x, y, 0));
  }

  const material = new THREE.LineBasicMaterial({ color: 0xffffff });
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const mesh = new THREE.Line(geometry, material);
  scene.add(mesh);

  const animate = () => {
    requestAnimationFrame(animate);
    camera.position.z -= 2;
    if (camera.position.z < 50) {
      camera.position.z = 3333;
    }
    renderer.render(scene, camera);
  };
  animate();
}

const page2 = () => {
  const material = new THREE.MeshNormalMaterial({ color:0x00d333, flatShading: true });
  const geometry = new THREE.DodecahedronGeometry(666);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.flatShading = true;
  scene.add(mesh);
  const light = new THREE.AmbientLight( { color: 0x404040, intensity: 1.2 } );
  scene.add( light );

  const animate = () => {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    camera.position.z = 3333;
    renderer.render(scene, camera);
  };
  animate();
};

const page3 = () => {
  const material = new THREE.MeshNormalMaterial({ color:0x00d333, flatShading: true });
  const geometry = new THREE.DodecahedronGeometry(333);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.flatShading = true;
  scene.add(mesh);
  const light = new THREE.AmbientLight( { color: 0x404040, intensity: 1.2 } );
  scene.add( light );

  const animate = () => {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    camera.position.z = 3333;
    renderer.render(scene, camera);
  };
  animate();
};

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

export default App;
