import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

function main() {
    const canvas = document.querySelector('#canvas');
    const view1Elem = document.querySelector('#view1');
    const view2Elem = document.querySelector('#view2');

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    const fov = 75,
        aspect = canvas.clientWidth / canvas.clientHeight,
        near = 0.1,
        far = 1000;

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 2, 3);
    camera.lookAt(0, 0, 0)

    const controls = new OrbitControls(camera, view1Elem);
    controls.update();

    const camera2 = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera2.position.set(0, 2, -3);
    camera2.lookAt(0, 0, 0);

    const controls2 = new OrbitControls(camera2, view2Elem);
    controls2.update();

    const scene = new THREE.Scene();

    const cube = createCube(1, '#6D0044');
    cube.position.set(0, 0.5, 0);

    const grid = new THREE.GridHelper(10);
    
    scene.add(cube);
    scene.add(grid);

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    function render(time) {
        time *= 0.001;  // convert time to seconds

        resizeRendererToDisplaySize(renderer);

        renderer.setScissorTest(true)

        {
            const aspect = setScissorForElement(view1Elem, canvas, renderer);

            camera.aspect = aspect;
            camera.updateProjectionMatrix();

            renderer.render(scene, camera);
        }

        {
            const aspect = setScissorForElement(view2Elem, canvas, renderer);

            camera2.aspect = aspect;
            camera2.updateProjectionMatrix();

            renderer.render(scene, camera2);
        }

        cube.rotation.y = time;
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

main();