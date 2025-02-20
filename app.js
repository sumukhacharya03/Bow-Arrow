const canvas = document.getElementById("simulationCanvas");
const ctx = canvas.getContext("2d");

// Bow properties
const bow = {
    x: 50,
    y: canvas.height / 2,
    radius: 50,
    color: "brown"
};

// Arrow properties
let arrow = {
    x: bow.x + 10,
    y: bow.y,
    width: 40,
    height: 5,
    color: "gray",
    speed: 0,
    launched: false,
    stuck: false,
    pulledBack: false
};

// Target properties
const target = {
    x: canvas.width - 100,
    y: canvas.height / 2,
    radius: 40,
    layers: [
        { radius: 40, color: "black" },
        { radius: 30, color: "blue" },
        { radius: 20, color: "red" },
        { radius: 10, color: "yellow" }
    ]
};

// Function to get a random target layer index
function getRandomLayerIndex() {
    return Math.floor(Math.random() * target.layers.length);
}

let hitIndex = getRandomLayerIndex(); // Start with a random layer

// Draw bow as an arc
function drawBow() {
    ctx.beginPath();
    ctx.arc(bow.x, bow.y, bow.radius, Math.PI / 2, -Math.PI / 2, true);
    ctx.strokeStyle = bow.color;
    ctx.lineWidth = 8;
    ctx.stroke();
}

// Draw bowstring
function drawString() {
    ctx.beginPath();
    ctx.moveTo(bow.x, bow.y - bow.radius);
    ctx.lineTo(arrow.pulledBack ? bow.x - 30 : bow.x, arrow.y);
    ctx.lineTo(bow.x, bow.y + bow.radius);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Draw target with layers
function drawTarget() {
    target.layers.forEach(layer => {
        ctx.beginPath();
        ctx.arc(target.x, target.y, layer.radius, 0, Math.PI * 2);
        ctx.fillStyle = layer.color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
    });
}

// Draw arrow
function drawArrow() {
    ctx.fillStyle = arrow.color;
    ctx.fillRect(arrow.x, arrow.y - arrow.height / 2, arrow.width, arrow.height);
    ctx.beginPath();
    ctx.moveTo(arrow.x + arrow.width, arrow.y);
    ctx.lineTo(arrow.x + arrow.width + 10, arrow.y - 2);
    ctx.lineTo(arrow.x + arrow.width + 10, arrow.y + 2);
    ctx.closePath();
    ctx.fill();
}

// Update arrow position
function updateArrow() {
    if (arrow.pulledBack && !arrow.launched) {
        arrow.x = bow.x - 30;
    }
    if (arrow.launched && !arrow.stuck) {
        arrow.x += arrow.speed;
        
        // Ensure arrow hits a random layer
        let targetLayer = target.layers[hitIndex];
        if (arrow.x + arrow.width >= target.x - targetLayer.radius) {
            arrow.x = target.x - targetLayer.radius - arrow.width; // Stick arrow at the selected layer
            arrow.launched = false;
            arrow.stuck = true;
            hitIndex = getRandomLayerIndex(); // Get a new random layer for the next shot
        }
    }
}

// Reset arrow
function resetArrow() {
    arrow.x = bow.x + 10;
    arrow.y = bow.y;
    arrow.speed = 0;
    arrow.launched = false;
    arrow.stuck = false;
    arrow.pulledBack = false;
}

// Pull back the arrow
function pullBackArrow() {
    if (!arrow.launched && !arrow.stuck) {
        arrow.pulledBack = true;
    }
}

// Shoot arrow
function shootArrow() {
    if (arrow.pulledBack && !arrow.launched && !arrow.stuck) {
        arrow.pulledBack = false;
        arrow.speed = 5;
        arrow.launched = true;
    }
}

// Button event listeners
document.getElementById("shootButton").addEventListener("mousedown", pullBackArrow);
document.getElementById("shootButton").addEventListener("mouseup", shootArrow);
document.getElementById("resetButton").addEventListener("click", resetArrow);

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBow();
    drawString();
    drawTarget(); // Draw target first to keep arrow visible
    drawArrow();
    updateArrow();

    requestAnimationFrame(gameLoop);
}

gameLoop();
