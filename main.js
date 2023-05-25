import * as THREE from 'three';

function createCube(dimension, color) {
    const geometry = new THREE.BoxGeometry(dimension, dimension, dimension);
    const material = new THREE.MeshBasicMaterial({ color: color });
    return new THREE.Mesh(geometry, material);
}

function main() {
    const canvas = document.querySelector('#canvas');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    const fov = 75, 
          aspect = canvas.clientWidth / canvas.clientHeight, 
          near = 0.1, 
          far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 2, 3);
    camera.lookAt(0,0,0)

    const scene = new THREE.Scene();

    const cube = createCube(1, '#6D0044');
    cube.position.set(0, 0.5, 0);
    const grid = new THREE.GridHelper(10);
    scene.add(cube);
    scene.add(grid);
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    function render(time) {
        time *= 0.001;  // convert time to seconds
       
        cube.rotation.y = time;
       
        renderer.render(scene, camera);
       
        requestAnimationFrame(render);
    }
      requestAnimationFrame(render);
}

main();