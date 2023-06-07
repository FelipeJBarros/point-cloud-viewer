import { addTestCube } from "../../main";

const btn = document.querySelector("#add-btn");
const addCubeBtn = document.querySelector("#add-cube-btn")

let hasCubeTest = false;
const MAX_CAM_NUMBER = 4;
let camNumber = 2

btn.addEventListener("click", () => {
    if(camNumber > MAX_CAM_NUMBER) return;
    const newView = document.createElement('div');
    newView.classList.add("view");
    newView.classList.add(String(camNumber));

    document.querySelector('#screens').appendChild(newView);
    camNumber++;
})

addCubeBtn.addEventListener('click', () => {
    if(hasCubeTest) return;
    
    addTestCube();
})