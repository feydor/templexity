// Globals.js - dependencies and the global renderer
import * as THREE from 'three';

let gRenderer = new THREE.WebGLRenderer({ antialias: true });
gRenderer.setSize(window.innerWidth, window.innerHeight);

export {gRenderer, THREE};
