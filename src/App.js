import logo from './logo.svg';
import './App.css';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// three.js globals
let camera, scene, renderer;
let geometry, material, mesh, grid;

function App() {
  const mountRef = useRef(null);

  // setup three.js, mount renderer, animate, demount
  useEffect(() => {
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	  camera.position.z = 500;

  	scene = new THREE.Scene();

  	geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  	material = new THREE.MeshNormalMaterial();

  	mesh = new THREE.Mesh(geometry, material);
  	scene.add(mesh);

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    const size = 400;
    const divisions = 40;
    grid = new THREE.GridHelper(size, divisions, 0x0000ff, 0x808080);
    grid.position.y = - 50;
    grid.rotation.x = 90 * Math.PI / 180;
    scene.add(grid);

  	renderer = new THREE.WebGLRenderer({ antialias: true });
  	renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    window.addEventListener("resize", onWindowResize, false);
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.update();
    animate();

    return () => mountRef.current.removeChild(renderer.domElement);
  }, []);


  return (
    <div className="Three" ref={mountRef}></div>
  );
}

const animate = () => {
  requestAnimationFrame(animate)
  mesh.rotation.x += 0.02;
  mesh.rotation.y += 0.02;
  renderer.render(scene, camera);
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

export default App;
