/* ==ELEMENTS AND VARIABLES== */
/* I feel like this is a very bad way of doing this but I don't know any better */
/* I feel like this is better than querying stuff every single time I call a function */

/* Containers */
const screen = document.getElementById("screen");
const colorPicker = document.getElementById("colorPicker");
const helpScreen = document.getElementById("helpScreen");
const saveCanvas = document.getElementById("saveCanvas");

/* Ranges */
const gridSizeRange = document.getElementById("gridSizeRange");
const redSlider = document.getElementById("redSlider");
const greenSlider = document.getElementById("greenSlider");
const blueSlider = document.getElementById("blueSlider");

/* Labels */
const gridSizeLabel = document.getElementById("gridSizeLabel");
const redLabel = document.getElementById("redLabel");
const greenLabel = document.getElementById("greenLabel");
const blueLabel = document.getElementById("blueLabel");

/* Buttons */
const singleButton = document.getElementById("singleButton");
const rainbowButton = document.getElementById("rainbowButton");
const eraserButton = document.getElementById("eraserButton");
const resetButton = document.getElementById("resetButton");
const helpButton = document.getElementById("helpButton");
const helpCloseButton = document.getElementById("helpCloseButton");
const saveButton = document.getElementById("saveButton");

/* CheckBoxes */
const gridCheck = document.getElementById("gridCheck");
const colorCheck = document.getElementById("colorCheck");
const dropperCheck = document.getElementById("dropperCheck");
const clickCheck = document.getElementById("clickCheck");

/* Global vars, very cool */
let mode;
let drawBool = {
    checked: false
}

/* ==FUNCTIONS== */

/* Ranges */
gridSizeRange.oninput = function() {gridSizeLabel.textContent = `Size: ${this.value}x${this.value}`}; 
gridSizeRange.onchange = () => resetGrid();
redSlider.oninput = () => updateColor();
greenSlider.oninput = () => updateColor();
blueSlider.oninput = () => updateColor();

/* Buttons */
singleButton.onclick = () => setMode(0);
rainbowButton.onclick = () => setMode(1);
eraserButton.onclick = () => setMode(2);
helpButton.onclick = () => helpScreen.classList.remove("hidden");
helpCloseButton.onclick = () => helpScreen.classList.add("hidden");
saveButton.onclick = () => saveImage();

/* CheckBoxes */
colorCheck.onclick = () => toggleColorpicker();
dropperCheck.onchange = () => toggleScreenMode(dropperCheck,"dropperMode");
clickCheck.onclick = () => toggleScreenMode(clickCheck,"clickMode");
gridCheck.onchange = () => toggleScreenMode(gridCheck,"grid");
resetButton.onclick = () => resetGrid();


/* Color picker functions */

function toggleColorpicker () {
    colorPicker.classList.toggle("minimized");
    colorCheck.classList.toggle("active");
}

function updateColor(rgb = null) {
    if (rgb != null) {
        redSlider.value = rgb[0];
        greenSlider.value = rgb[1];
        blueSlider.value = rgb[2];
    }

    const redValue = redSlider.value;
    const greenValue = greenSlider.value;
    const blueValue = blueSlider.value;

    redLabel.textContent = `Red: ${redValue}`;
    greenLabel.textContent = `Green: ${greenValue}`;
    blueLabel.textContent = `Blue: ${blueValue}`;

    const template = `rgb(${redValue},${greenValue},${blueValue})`;

    document.documentElement.style.setProperty("--current-color",template)
};

/* Drawing Functions */
function setMode(val) {
    mode = val;
    const modeButtons = document.querySelectorAll(".mode"); 
    for (let i = 0; i < modeButtons.length; i++){
        if (i === val){
            modeButtons[i].classList.add("active");
        }
        else {
            modeButtons[i].classList.remove("active");
        };
    }
}

function draw(obj) {
    if (drawBool.checked) {
        let color;
        switch(mode){
            case 1:
                color = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
                break;
            case 2:
                color = "rgb(255,255,255)";
                break;
            default:
                color = getComputedStyle(document.documentElement).getPropertyValue('--current-color');
                break;
        };
        obj.style.setProperty("background-color",color)
    };
};

function hoverMode(obj) {
    if(!screen.classList.contains("dropperMode")) {
        if (!screen.classList.contains("clickMode") && drawBool.checked === false) toggleScreenMode(drawBool,"drawing",true);
        draw(obj);
    };
};

function clickMode(obj) {
    if (screen.classList.contains("dropperMode")) {
        let newColor = obj.style.getPropertyValue("background-color");
        if (newColor != "") {
            /* String Operations to turn "rgb(r, g, b)" into an array of ["r","g","b"] */
            newColor = newColor.slice(4,-1);
            newColor = newColor.replaceAll(" ","");
            newColor = newColor.split(",");
            /* Update the current color with the array */
            updateColor(newColor);
            /* Exit color dropper mode */
            toggleScreenMode(dropperCheck,"dropperMode",true)
        };
    }
    else if (screen.classList.contains("clickMode")) {
        toggleScreenMode(drawBool,"drawing",true)
        draw(obj)
    } 
};

/* Grid control functions */
function createGrid () {
    let coorX = 0;
    let coorY = 0;

    for (coorY; coorY < gridSizeRange.value; coorY++) {
        coorX = 0;
        for (coorX; coorX < gridSizeRange.value; coorX++) {
            /* Create a new pixel div with the ID of coorX-coorY, append div to screen. */
            let pixDiv = document.createElement("div");
            pixDiv.id = `${coorX}-${coorY}`;
            pixDiv.className = "pixel";
            pixDiv.setAttribute("onmouseover","hoverMode(this)");
            pixDiv.setAttribute("onclick","clickMode(this)");
            screen.appendChild(pixDiv);
            /* Change grid template to accomodate all new divs */
            screen.style.setProperty("grid-template-rows",`repeat(${gridSizeRange.value},1fr)`);
            screen.style.setProperty("grid-template-columns",`repeat(${gridSizeRange.value},1fr)`);
        };
    };
};

function resetGrid () {
    const userConfirm = confirm("Are you sure you want to reset the grid?");
    if (userConfirm) {
        const pixels = document.querySelectorAll(".pixel");
        pixels.forEach(function(pixel){
            pixel.remove()
        });
        createGrid(gridSizeRange.value);
    };
};

/* SAVE FUNCTIONS */
/* Canvas: Or I knew damn well giving each pixel a unique ID would pay off */

function fillCanvas () {
    const pixels = document.querySelectorAll(".pixel");
    const pixelSize = 450/gridSizeRange.value;
    const ctx = saveCanvas.getContext("2d");
    pixels.forEach(function(pixel){
        let coords = pixel.id;
        coords = coords.split("-");
        let color = pixel.style.getPropertyValue("background-color");
        if (color === "") color = "#ffffff";
        ctx.fillStyle = color;
        ctx.fillRect(coords[0]*pixelSize,coords[1]*pixelSize,pixelSize+1,pixelSize+1);
    });
}

function createLink () {
    let dataUrl = saveCanvas.toDataURL()
    let a = document.createElement("a");
    a.href = dataUrl;
    a.download = "painting.png";
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

function saveImage () {
    fillCanvas();
    createLink();
}

/* MISC FUNCTIONS */

/* Controls if checkValue is checked, adds or removes classVal class to the screen element accordingly */
/* Can also toggle checkValue if toggleVal is true */ 
function toggleScreenMode(checkValue,classVal,toggleVal = false) {
    if (toggleVal) checkValue.checked = !checkValue.checked;
    if (checkValue.checked) {
        screen.classList.add(classVal);
    }
    else {
        screen.classList.remove(classVal);
    }
};

/* Keyboard Shortcuts */
document.addEventListener("keydown", function(event) {
    switch(event.key) {
        case "1": setMode(0); break;
        case "2": setMode(1); break;
        case "3": setMode(2); break;
        case "p": toggleColorpicker(); break;
        case "d": toggleScreenMode(dropperCheck,"dropperMode",true); break;
        case "g": toggleScreenMode(gridCheck,"grid",true); break;
        case "c": toggleScreenMode(clickCheck,"clickMode",true); break;
        default : break;
    }
});

/* Initializer, this seems to be necessary because Firefox likes to keep the old values for some reason. */
function init () {
    /* Uncheck all checkboxes */
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(function(checkbox){
        checkbox.checked = false
    });
    /* Set all ranges to 0 */
    const ranges = document.querySelectorAll("input[type='range");
    ranges.forEach(function(range){
        range.value = 0
    });
    /* Set defaults */
    gridSizeLabel.textContent = `Size: 16x16`;
    gridSizeRange.value = 16;
    toggleScreenMode(clickCheck,"clickMode",true)
    setMode(0)
    /* Create initial grid */
    createGrid();
};

/* SCRIPT BODY */
init()