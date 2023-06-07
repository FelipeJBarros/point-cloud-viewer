import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let canvas, renderer, scene, camera, control, viewObserver;
let cam2, cam3, cam4;

function init() {
    canvas = document.querySelector("#canvas");
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
    camera.position.set(0, 2, 3);
    camera.lookAt(0, 0, 0);

    cam2 = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
    cam2.position.set(0, 2, 3);
    cam2.lookAt(0, 0, 0);

    cam3 = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
    cam3.position.set(0, 2, 3);
    cam3.lookAt(0, 0, 0);

    cam4 = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
    cam4.position.set(0, 2, 3);
    cam4.lookAt(0, 0, 0);

    let view = document.querySelector('#main-screen.view');
    control = new OrbitControls(camera, view);
    control.update();
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

    {
        try {
            let view = Array.from(document.getElementsByClassName('view 2'))[0];
            const aspect = setScissorForElement(view, canvas, renderer);
    
            cam2.aspect = aspect;
            cam2.updateProjectionMatrix();
    
            renderer.render(scene, cam2);
        } catch(error) {
            console.log("Ainda não foi criado")
        }
    }

    {   
        try {
            let view = Array.from(document.getElementsByClassName('view 3'))[0];
            const aspect = setScissorForElement(view, canvas, renderer);
    
            cam3.aspect = aspect;
            cam3.updateProjectionMatrix();
    
            renderer.render(scene, cam3);
        } catch(error) {
            console.log("Ainda não foi criado")
        }
    }

    {
        try {
            let view = Array.from(document.getElementsByClassName('view 4'))[0];
            const aspect = setScissorForElement(view, canvas, renderer);
    
            cam4.aspect = aspect;
            cam4.updateProjectionMatrix();
    
            renderer.render(scene, cam4);
        } catch(error) {
            console.log("Ainda não foi criado")
        }
    }
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

init();
setupScene();
render();

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
    mutations.forEach(function (mutation) {
        console.log(mutation);
    });
}
// ---------------

// const observer = new MutationObserver(handleMutationObserver);

// const CAMERA_DEFAULT_SETTINGS = {
//     fov: 75,
//     aspect: 2,
//     near: 0.1,
//     far: 1000
// }

// function setScissorForElement(elem, canvas, renderer) {
//     const canvasRect = canvas.getBoundingClientRect();
//     const elemRect = elem.getBoundingClientRect();

//     const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
//     const left = Math.max(0, elemRect.left - canvasRect.left);
//     const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
//     const top = Math.max(0, elemRect.top - canvasRect.top);

//     const width = Math.min(canvasRect.width, right - left);
//     const height = Math.min(canvasRect.height, bottom - top);

//     const positiveYUpBottom = canvasRect.height - bottom;
//     renderer.setScissor(left, positiveYUpBottom, width, height);
//     renderer.setViewport(left, positiveYUpBottom, width, height);

//     return width / height;
// }

// function handleMutationObserver(mutations) {
//     views = Array.from(document.getElementsByClassName('view'));
//     updateCameras();
//     mutations.forEach(function (mutation) {
//         console.log(mutation);
//     });

//     console.log({c: controls})
// }

// const fov = 75,
//     aspect = 2,
//     near = 0.1,
//     far = 1000;

// const cameras = [];
// const controls = [];
// let views = Array.from(document.getElementsByClassName('view'));

// function updateCameras() {
//     views.forEach(viewElm => {
//         const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
//         console.log(viewElm)
//         camera.position.set(0, 2, 3);
//         camera.lookAt(0, 0, 0);

//         const control = new OrbitControls(camera, viewElm);
//         control.update();

//         cameras.push(camera);
//         controls.push(control);
//     });
// }

// function main() {
//     const canvas = document.querySelector('#canvas');
//     const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

//     updateCameras();

//     const scene = new THREE.Scene();

//     const cube = createCube(1, '#6D0044');
//     cube.position.set(0, 0.5, 0);

//     const grid = new THREE.GridHelper(10);

//     const sceneElements = [cube, grid];
//     sceneElements.forEach(item => scene.add(item));

//     renderer.setSize(canvas.clientWidth, canvas.clientHeight);

//     function render(time) {
//         time *= 0.001;  // convert time to seconds

//         resizeRendererToDisplaySize(renderer);

//         renderer.setScissorTest(true);

//         views.forEach((viewElm, viewIndex) => {
//             const aspect = setScissorForElement(viewElm, canvas, renderer);
//             const currentCamera = cameras[viewIndex];

//             currentCamera.aspect = aspect;
//             currentCamera.updateProjectionMatrix();

//             renderer.render(scene, currentCamera);
//         })

//         cube.rotation.y = time;
//         requestAnimationFrame(render);
//     }
//     requestAnimationFrame(render);
// }

// main();

// window.addEventListener('load', () => {
//     const target = document.querySelector("#screens");
//     observer.observe(target, { childList: true });
// });
// window.addEventListener('unload', () => observer.disconnect());