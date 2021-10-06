// Globals.js - dependencies and the global renderer
import * as THREE from 'three';
// import { GUI } from 'three/examples/jsm/libs/dat.gui.module';

let gRenderer = new THREE.WebGLRenderer({ antialias: true });
gRenderer.setSize(window.innerWidth, window.innerHeight);

export {gRenderer, THREE};
