import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const observer = new MutationObserver(handleMutationObserver);

const CAMERA_DEFAULT_SETTINGS = {
    fov: 75,
    aspect: 2,
    near: 0.1,
    far: 1000
}

function createCube(dimension, color) {
    const geometry = new THREE.BoxGeometry(dimension, dimension, dimension);
    const material = new THREE.MeshBasicMaterial({ color: color });
    return new THREE.Mesh(geometry, material);
}

function setScissorForElement(elem, canvas, renderer) {
    const canvasRect = canvas.getBoundingClientRect();
    const elemRect = elem.getBoundingClientRect();

    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
    const left = Math.max(0, elemRect.left - canvasRect.left);
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
    const top = Math.max(0, elemRect.top - canvasRect.top);

    const width = Math.min(canvasRect.width, right - left);
    const height = Math.min(canvasRect.height, bottom - top);

    const positiveYUpBottom = canvasRect.height - bottom;
    renderer.setScissor(left, positiveYUpBottom, width, height);
    renderer.setViewport(left, positiveYUpBottom, width, height);

    return width / height;
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

function handleMutationObserver(mutations) {
    views = [...Array.from(document.getElementsByClassName('view'))];
    updateCameras();
    mutations.forEach(function (mutation) {
        console.log(mutation);
    });
}

const fov = 75,
    aspect = 2,
    near = 0.1,
    far = 1000;

const cameras = [];
const controls = [];
let views = Array.from(document.getElementsByClassName('view'));

function updateCameras() {
    views.forEach(viewElm => {
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        console.log(viewElm)
        camera.position.set(0, 2, 3);
        camera.lookAt(0, 0, 0);

        const control = new OrbitControls(camera, viewElm);
        control.update();

        cameras.push(camera);
        controls.push(control);
    });
}

function main() {
    const canvas = document.querySelector('#canvas');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    updateCameras();

    const scene = new THREE.Scene();

    const cube = createCube(1, '#6D0044');
    cube.position.set(0, 0.5, 0);

    const grid = new THREE.GridHelper(10);

    const sceneElements = [cube, grid];
    sceneElements.forEach(item => scene.add(item));

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    function render(time) {
        time *= 0.001;  // convert time to seconds

        resizeRendererToDisplaySize(renderer);

        renderer.setScissorTest(true);

        views.forEach((viewElm, viewIndex) => {
            const aspect = setScissorForElement(viewElm, canvas, renderer);
            const currentCamera = cameras[viewIndex];

            currentCamera.aspect = aspect;
            currentCamera.updateProjectionMatrix();

            renderer.render(scene, currentCamera);
        })

        cube.rotation.y = time;
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

main();

window.addEventListener('load', () => {
    const target = document.querySelector("#screens");
    observer.observe(target, { childList: true });
});
window.addEventListener('unload', () => observer.disconnect());