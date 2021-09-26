import './App.css';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// three.js globals
let camera, scene, renderer;
let geometry, material, mesh, grid;
const startingZ = 200;

function App() {
  const mountRef = useRef(null);

  // setup three.js, mount renderer, animate, demount
  useEffect(() => {
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
	  camera.position.z = startingZ;

  	scene = new THREE.Scene();

    const points = [];
    const ticks = 9999;
    let x = 0;
    let y = 0;
    let r = 0.1;
    const a = 1.00098;
    const theta = 45;
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

    //const axesHelper = new THREE.AxesHelper(100);
    //scene.add(axesHelper);

    const size = 400;
    const divisions = 40;
    //grid = new THREE.GridHelper(size, divisions, 0x0000ff, 0x808080);
    //grid.position.y = - 50;
    //grid.rotation.x = 90 * Math.PI / 180;
    //scene.add(grid);

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
    animate();

    return () => mountRef.current.removeChild(renderer.domElement);
  }, []);


  return (
    <div className="Three" ref={mountRef}></div>
  );
}

const animate = () => {
  requestAnimationFrame(animate);
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
