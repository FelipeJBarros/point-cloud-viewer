import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let canvas, renderer, scene, camera, control, viewObserver;
let extraCameras = [];

function init() {
    canvas = document.querySelector("#canvas");
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
    camera.position.set(0, 2, 3);
    camera.lookAt(0, 0, 0);

    let view = document.querySelector('#main-screen.view');
    control = new OrbitControls(camera, view);
}

function setupScene() {
    let gridHelper = new THREE.GridHelper(10);

    scene.add(gridHelper);
    scene.background = new THREE.Color("#1A120B");

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
}

function render() {
    requestAnimationFrame(render);

    resizeRendererToDisplaySize(renderer);
    renderer.setScissorTest(true);

    {
        let view = document.querySelector('#main-screen.view');
        const aspect = setScissorForElement(view, canvas, renderer);

        camera.aspect = aspect;
        camera.updateProjectionMatrix();

        renderer.render(scene, camera);
    }

    extraCameras.forEach(cameraObject => {
        let aspect = setScissorForElement(cameraObject.domElement, canvas, renderer);

        cameraObject.camera.aspect = aspect;
        cameraObject.camera.updateProjectionMatrix();

        renderer.render(scene, cameraObject.camera);
    })
}

window.addEventListener('load', () => {
    init();
    setupScene();
    setupViewsObserver();
    render();
});

window.addEventListener('unload', () => {
    if(!viewObserver) return;
    viewObserver.disconnect();
});

// utils ---------------
export function addTestCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: "#6D0044" });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0.5, 0);
    scene.add(cube);
}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) renderer.setSize(width, height, false);
    return needResize;
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

function setupViewsObserver() {
    const target = document.querySelector("#screens");
    viewObserver = new MutationObserver(handleMutationObserver);
    viewObserver.observe(target, { childList: true });
}

function handleMutationObserver(mutations) {
    if(mutations[0].target === document.querySelector('#screens')) {
        addNewCamera(mutations[0].addedNodes[0]);
    }
}

function addNewCamera(domElement) {
    const newCamera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
    const newControl = new OrbitControls(newCamera, domElement);

    newCamera.position.set(0, 2, 3);
    newCamera.lookAt(0, 0, 0);

    extraCameras.push({
        camera: newCamera,
        control: newControl,
        domElement: domElement
    });

    render();
}