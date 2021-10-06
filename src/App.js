import './App.css';
import {useEffect, useRef} from 'react';
import {gRenderer} from './Globals.js';
import {Page1, Page2, Page3} from './Page.js';

// local globals
let currPage = 0;
const NUM_PAGES = 3;
let pages = [];

// React entrypoint
function App() {
  const mountRef = useRef(null);

  pages[0] = new Page1();
  pages[1] = new Page2();
  pages[2] = new Page3();

  useEffect(() => {
    mountRef.current.appendChild(gRenderer.domElement);
    window.addEventListener("resize", onWindowResize(pages[currPage].camera), false);

    // updates global page counter onclick of next button
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
      currentRef.removeChild(gRenderer.domElement);
    }
  });

  return (
    <div>
      <div className="THREE" ref={mountRef}></div>
      <button id="button" href="#"> > </button>
    </div>
  );
}

const onWindowResize = (camera) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  gRenderer.setSize( window.innerWidth, window.innerHeight );
}

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

// control logic for rendering pages
const render = (time) => {
  time *= 0.001;
  resizeRendererToDisplaySize(gRenderer);

  for (const page of pages) {
    page.animate(time);
    if (page.isCurrent(currPage)) {
      page.render();
    }
  }

  requestAnimationFrame(render);
};

export default App;
