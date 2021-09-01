/* ==ELEMENTS AND VARIABLES== */
/* I feel like this is a very bad way of doing this but I don't know any better */
/* I feel like this is better than querying stuff every single time I call a function */
const screen = document.getElementsByClassName("screen")[0];
const pixelSlider = document.getElementById("pixelSlider");
const pixelLabel = document.getElementById("pixelLabel");
const showGrid = document.getElementById("showGrid");
const resetButton = document.getElementById("resetButton");
const singleButton = document.getElementById("singleButton");
const rainbowButton = document.getElementById("rainbowButton");
const eraserButton = document.getElementById("eraserButton");
const colorPreview = document.getElementById("colorPreview");
const colorPicker = document.getElementById("colorPicker");
const redSlider = document.getElementById("redSlider");
const redLabel = document.getElementById("redLabel");
const greenSlider = document.getElementById("greenSlider");
const greenLabel = document.getElementById("greenLabel");
const blueSlider = document.getElementById("blueSlider");
const blueLabel = document.getElementById("blueLabel");
const dropperTool = document.getElementById("dropperTool");
const clickCheck = document.getElementById("clickMode");

/* Global vars, very cool */
let mode;
let drawBool = true;

/* ==FUNCTIONS== */
/* Show or hide the color picker */
colorPreview.onclick = function() {
    colorPicker.classList.toggle("hidden");
};

/* Toggle click mode */
clickCheck.onclick = function() {
    screen.classList.toggle("clickMode");
    if (screen.classList.contains("clickMode")) {
        drawBool = false;
    }
    else {
        drawBool = true;
    }
};

/* Changes the pixelLabel text on slider input */
pixelSlider.oninput = function() {
    pixelLabel.textContent = `Size: ${this.value}x${this.value}`;
}; 

/* Resets and rebuilds the grid on slider change, not on input, for performance reasons */
pixelSlider.onchange = function() {
    resetGrid();
    createGrid(this.value);
};

/* Toggles grid borders */
showGrid.onchange = function() {
    gridBorderToggle(showGrid.checked);
};

/* Resets the grid */
resetButton.onclick = function() {
    resetGrid();
    createGrid(pixelSlider.value);
};

/* Color picker tools */
redSlider.oninput = function() {
    updateColor();
};
greenSlider.oninput = function() {
    updateColor();
};
blueSlider.oninput = function() {
    updateColor();
};
dropperTool.onchange = function() {
    screen.classList.toggle("dropperTool")
}

/* Mode changers */
singleButton.onclick = function() {
    mode = 0;
};
rainbowButton.onclick = function() {
    mode = 1;
};
eraserButton.onclick = function() {
    mode = 2;
};

/* Color picker functions */
function updateColor(rgb = null) {

    console.log(rgb)

    if (rgb != null) {
        redSlider.value = rgb[0];
        greenSlider.value = rgb[1];
        blueSlider.value = rgb[2];
    }

    let redValue = redSlider.value;
    let greenValue = greenSlider.value;
    let blueValue = blueSlider.value;

    redLabel.textContent = `Red: ${redValue}`;
    greenLabel.textContent = `Green: ${greenValue}`;
    blueLabel.textContent = `Blue: ${blueValue}`;

    const template = `rgb(${redValue},${greenValue},${blueValue})`;

    document.documentElement.style.setProperty("--current-color",template)
};

/* Grid control functions */
function draw(obj) {
    if (drawBool) {
        switch(mode){
            case 1:
                color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`;
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
    let color;
    if(!screen.classList.contains("dropperTool")) {
        draw(obj);
    };
};

function clickMode(obj) {
    if (screen.classList.contains("dropperTool")) {
        let newColor = obj.style.getPropertyValue("background-color");
        if (newColor != "") {
            /* String Operations to turn "rgb(r, g, b)" into an array of ["r","g","b"] */
            newColor = newColor.slice(4,-1);
            newColor = newColor.replaceAll(" ","");
            newColor = newColor.split(",");
            /* Update the current color with the array */
            updateColor(newColor);
            /* Exit color dropper mode */
            screen.classList.remove("dropperTool");
            dropperTool.checked = false;
        };
    }
    else if (screen.classList.contains("clickMode")) {
        drawBool = !drawBool;
        draw(obj)
    } 
};

function gridBorderToggle (checkbox) {
    if (checkbox) {
        screen.style.setProperty("gap","1px")
        console.log(checkbox)
    }
    else {
        screen.style.setProperty("gap","0px")
        console.log(checkbox)
    }
};

function resetGrid () {
    let pixels = document.querySelectorAll(".pixel");
    pixels.forEach(function(pixel){
        pixel.remove()
    })
};

function createGrid (resolution) {
    let coorX = 0;
    let coorY = 0;

    for (coorY; coorY < resolution; coorY++) {
        coorX = 0;
        for (coorX; coorX < resolution; coorX++) {
            /* Create a new pixel div with the ID of coorX-coorY, append div to screen. */
            let pixDiv = document.createElement("div");
            pixDiv.id = `${coorX}-${coorY}`;
            pixDiv.className = "pixel";
            pixDiv.setAttribute("onmouseover","hoverMode(this)");
            pixDiv.setAttribute("onclick","clickMode(this)");
            screen.appendChild(pixDiv);
            /* Change grid template to accomodate all new divs */
            screen.style.setProperty("grid-template-rows",`repeat(${resolution},1fr)`);
            screen.style.setProperty("grid-template-columns",`repeat(${resolution},1fr)`);
        };
    };
};

/* Initializer, these are necessary because Firefox likes to keep the old values for some reason */
function init () {
    let checkboxes = document.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(function(checkbox){
        checkbox.checked = false
    });
    let ranges = document.querySelectorAll("input[type='range");
    ranges.forEach(function(range){
        range.value = 0
    });
    pixelLabel.textContent = `Size: 16x16`;
    createGrid(16);
    pixelSlider.value = 16;
    mode = 0;
};

init()