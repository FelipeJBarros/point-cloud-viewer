const btn = document.querySelector("#add-btn");

btn.addEventListener("click", () => {
    const newView = document.createElement('div');
    newView.classList.add("view");

    document.querySelector('#screens').appendChild(newView);
})