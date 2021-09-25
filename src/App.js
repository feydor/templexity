import logo from './logo.svg';
import './App.css';
import { useEffect, useRef } from 'react';
import * as THREE from "three";

// three.js globals
let camera, scene, renderer;
let geometry, material, mesh;

function App() {
  const mountRef = useRef(null);

  // setup three.js
  useEffect(() => {
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
	  camera.position.z = 1;

  	scene = new THREE.Scene();

  	geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  	material = new THREE.MeshNormalMaterial();

  	mesh = new THREE.Mesh(geometry, material);
  	scene.add(mesh);

  	renderer = new THREE.WebGLRenderer({ antialias: true });
  	renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    window.addEventListener("resize", onWindowResize, false);
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
