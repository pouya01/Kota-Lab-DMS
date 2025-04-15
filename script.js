const canvas = document.getElementById('squareCanvas');
const ctx = canvas.getContext('2d');

// Square properties
const size = 400; // Square size in pixels (reduced from 600 to 400)
const gridSize = 200; // Represents -100 to 100 on each side

// Circle properties
const circleRadius = size / 70; // Circle size = 1/70 of the square
let circleX = size / 2; // Initial x position (center)
let circleY = size / 2; // Initial y position (center)
let isDragging = false; // To track if the circle is being dragged (mouse or touch)

// Movement properties
const step = size / gridSize; // Step size for movement
let path = []; // Array to track the path

// Update canvas size in the HTML file
canvas.width = size;
canvas.height = size;

// Draw the square and grid
function drawSquare() {
    ctx.clearRect(0, 0, size, size);

    // Draw grid
    ctx.strokeStyle = 'white';
    for (let i = 0; i <= gridSize; i++) {
        const pos = i * step;
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, size);
        ctx.stroke();
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(size, pos);
        ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size / 2, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size, size / 2);
    ctx.stroke();
}

// Draw the path
function drawPath() {
    ctx.strokeStyle = 'pink';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < path.length - 1; i++) {
        const [x1, y1] = path[i];
        const [x2, y2] = path[i + 1];
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
    }
    ctx.stroke();
}

// Draw the circle
function drawCircle() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
    ctx.fill();
}

// Update coordinates log
function updateCoordinates() {
    const x = Math.round((circleX - size / 2) / step); // Convert to -100 to 100
    const y = -Math.round((circleY - size / 2) / step); // Negative for canvas to Cartesian
    const logDiv = document.getElementById('coordinates');
    logDiv.innerHTML = `<p>Initial Position: (${x}, ${y})</p><p>Path: ${JSON.stringify(path.map(([px, py]) => [
        Math.round((px - size / 2) / step),
        -Math.round((py - size / 2) / step)
    ]))}</p><p>Final Position: (${x}, ${y})</p>`;
}

// Check if a point is inside the circle
function isInsideCircle(x, y) {
    const distance = Math.sqrt((x - circleX) ** 2 + (y - circleY) ** 2);
    return distance <= circleRadius;
}

// Start dragging (mouse or touch)
function startDragging(x, y) {
    if (isInsideCircle(x, y)) {
        isDragging = true;
        path.push([circleX, circleY]); // Log initial position to path
    }
}

// Dragging the circle (mouse or touch)
function dragCircle(x, y) {
    if (isDragging) {
        if (
            x >= circleRadius && x <= size - circleRadius &&
            y >= circleRadius && y <= size - circleRadius
        ) {
            circleX = x;
            circleY = y;
            path.push([circleX, circleY]); // Log path point
        }

        drawSquare();
        drawPath();
        drawCircle();
        updateCoordinates();
    }
}

// Stop dragging (mouse or touch)
function stopDragging() {
    isDragging = false;
}

// Mouse event listeners
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    startDragging(mouseX, mouseY);
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        dragCircle(mouseX, mouseY);
    }
});

canvas.addEventListener('mouseup', stopDragging);

// Touch event listeners
canvas.addEventListener('touchstart', (e) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    startDragging(touchX, touchY);
});

canvas.addEventListener('touchmove', (e) => {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        dragCircle(touchX, touchY);
    }
});

canvas.addEventListener('touchend', stopDragging);

// Initial draw
drawSquare();
drawCircle();
updateCoordinates();
