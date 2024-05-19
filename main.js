// TODO: make responsive
// fix colliders/change gravity value
// fix set height for current fruit spawning + follow mouse
// add next fruit
// add cloud + fix path rendering
// add sounds + change sprites
// add game over screen

// check if fruit overlaps with the line twice
//
// CSS design:
// Cut canvas height, anchor bottom, top
// Use flex boxes
//
// Responsive design:
// make canvas a set width/height based on the size of the field
// make positioning relative to the max width/height of the canvas
// center position of canvas
//
// Alternative:
// Scale everything using window resized
// When window resized, calle setup field again
// Use aspect ratio to determine scaling
// Utilize colliderScaling/spriteScaling


// Used for resizing
let scalingFactor = 1;

const colliderScalingFactor = 2.5;
const spriteScalingFactor = 0.5;
const baseWidth = 1440;
const baseHeight = 779;
const aspectRatio = baseWidth / baseHeight;
const coordinateScaling = 1;

let canvas;
let canvasSize = {canvasWidth: 0, canvasHeight: 0}

let fruits = [];
let fruitSprites = [];

let floor;
let wallLeft;
let wallRight;
let gameOverLine;
let linePath;
let score = 0;

let dropped = true;
let currentFruit;
let nextFruitType;
let previousFruit;

// scale width and height of canvas respecting the original aspect ratio
function scaleCanvas() {
    if ((windowWidth / windowHeight) > aspectRatio) {
        canvasSize.canvasWidth = windowHeight * aspectRatio;
        canvasSize.canvasHeight = windowHeight;
    }

    canvasSize.canvasWidth = windowWidth;
    canvasSize.canvasHeight = windowWidth / aspectRatio;
}

function dropFruit() {
    let type = currentFruit.name;
    currentFruit.collider = 'dynamic';
    updateScore(type);
    previousFruit = currentFruit;
    currentFruit = null;
    dropped = true;
}

function randomFruit(x, y) {
    if (dropped) {
        let randomValue = Math.random() * 5;
        // random fruit type
        let randomInt = Math.floor(randomValue);

        spawnFruits(x, y, randomInt, true);
        dropped = false;
    }
}

function nextFruit() {
    let randomValue = Math.random() * 5;

    // random fruit type
    let randomInt = Math.floor(randomValue);
    nextFruitType = randomInt;

    let imgName = 'public/' + nextFruitType + '.png';
    $('#next-fruit-sprite').attr('src', imgName);
}


// spawn fruit given position and order
// x: int
// y: int
// type: int
function spawnFruits(x, y, type, updateCurrent) {
    let fruit = new fruits.Sprite();

    fruit.addAni('default', fruitSprites[type]);
    fruit.ani.scale = spriteScalingFactor / scalingFactor;
    fruit.name = 'type' + type;

    // how may times the fruit has collided wit the game over line
    fruit.collidedWithUpperBound = 0;

    // used to detect fruits when crossing the game over line
    fruit.state = 'non-collide';

	fruit.diameter = fruit.ani.width / (colliderScalingFactor * scalingFactor);
    fruit.y = y;
    fruit.x = x;

    if (updateCurrent) {
        fruit.collider = 'none';
        currentFruit = fruit;
    }
}

function updateScore(type) {
    // get last character of string then turn to int
    let fruitType = +type[type.length - 1];
    let addScore = (fruitType + 1) * 2;
    score += addScore;

    let scoreText = 'Score: ' + score;
    $('#score').text(scoreText);
}

function collisionDetector(object1, object2) {
    // if current fruit has been dropped and collided, spawn a new
    // current fruit
    if ((object1 == previousFruit) | (object2 == previousFruit)) {
        // spawn in new current fruit and generate new next fruit
        if (dropped) {
            spawnFruits(mouse.x, 0.1 * canvas.h, nextFruitType, true);
            nextFruit();
            dropped = false;
        }
    }

    if (object1.name != 'bounds') {
        object1.state = 'collided';
    }
    if (object2.name != 'bounds') {
        object2.state = 'collided';
    }

    // collision between fruit and any of the walls detected
    if ((object1.name === 'bounds') | (object2.name === 'bounds')) {
        return;
    }

    // collision between fruits
    // collided fruit type
    let fruitType = +object1.name[object1.name.length - 1];

    if ((object1 == currentFruit) | (object2 == currentFruit)) {
        return;
    }

    if ((object1.name == object2.name) & (fruitType < (fruitSprites.length))) {
        // new position for fruit
        let x = (object1.x + object2.x)/2;
        let y = (object1.y + object2.y)/2;
        let newFruitType = fruitType + 1;

        spawnFruits(x, y, newFruitType, false);
        object1.remove();
        object2.remove();
    }
}

function createTrajectoryLine() {
    
    linePath = new Sprite();
    linePath.h = (500 / scalingFactor) - floor.strokeWeight;
    linePath.w = 2 / scalingFactor;
    linePath.y = wallRight.y - floor.strokeWeight;
    linePath.x = currentFruit.x;
    linePath.collider = 'none';
    linePath.color = '#FFFFFF';
    linePath.stroke = '#FFFFFF';
    linePath.opacity = 0.4;
}

function setupField() {
    let title = new Sprite();
    title.text = 'Untitled Circles Game (NOT Suika)';
    title.y = canvas.h * 0.5;
    title.collider = 'none';
    title.w = 0;
    title.h = 0;

    floor = new Sprite();
	floor.y = canvas.h - (canvas.h * 0.05);
	floor.w = 500 / scalingFactor;
	floor.h = 5 / scalingFactor;
	floor.collider = 'static';
    floor.color = '#f6d581';
    floor.stroke = '#f6d581';
    floor.strokeWeight = 10 / scalingFactor;
    floor.name = 'bounds';

    gameOverLine = new Sprite();
    gameOverLine.name = 'over';
    gameOverLine.w = floor.w;
    // 500/scalingFactor = wallRight.h originally
    gameOverLine.y = floor.y - (500 / scalingFactor);
    gameOverLine.collider = 'none';
    gameOverLine.h = floor.h
    gameOverLine.color = 'red';
    gameOverLine.stroke = 'red';


    wallLeft = new Sprite();
    wallLeft.h = 530 / scalingFactor;
    wallLeft.w = 5 / scalingFactor;
    wallLeft.y = floor.y - (wallLeft.h * 0.5);
    wallLeft.x = canvas.w * 0.5 + floor.w * 0.5;
    wallLeft.collider = 'static';
    wallLeft.color = '#f6d581';
    wallLeft.stroke = '#f6d581';
    wallLeft.strokeWeight = 10 / scalingFactor;
    wallLeft.name = 'bounds';

    wallRight = new Sprite();
    wallRight.h = 530 / scalingFactor;
    wallRight.w = 5 / scalingFactor;
    wallRight.y = floor.y - (wallRight.h * 0.5);
    wallRight.x = canvas.w * 0.5 - floor.w * 0.5;
    wallRight.collider = 'static';
    wallRight.color = '#f6d581';
    wallRight.stroke = '#f6d581';
    wallRight.strokeWeight = 10 / scalingFactor;
    wallRight.name = 'bounds';

   
    createTrajectoryLine();
    // createScoreBoard();
}

// make trajectory line follow mouse position
function lineFollowMouse() {
    if (mouse.x < wallRight.x) {
        let newCoords = wallRight.x + (wallRight.width + wallRight.strokeWeight);
        linePath.x = newCoords;
    }
    else if (mouse.x > wallLeft.x) {
        let newCoords = wallLeft.x - (wallLeft.width + wallLeft.strokeWeight);
        linePath.x = newCoords;
    }
    else {
        linePath.x = mouse.x;
        linePath.y = wallRight.y - floor.strokeWeight;
    }
}

// make current fruit follow mouse position
function currentFruitFollowMouse() {
    if (mouse.x < (wallRight.x + currentFruit.width)) {
        let newCoords = wallRight.x + (wallRight.width + wallRight.strokeWeight + currentFruit.width * 0.5);
        currentFruit.x = newCoords;
        linePath.x = newCoords;
    }
    else if (mouse.x > (wallLeft.x - currentFruit.width)) {
        let newCoords = wallLeft.x - (wallLeft.width + wallLeft.strokeWeight + currentFruit.width * 0.5);
        currentFruit.x = newCoords;
        linePath.x = newCoords;

    }
    else {
        currentFruit.x = mouse.x;
        currentFruit.y = 0.1 * canvas.h;
        linePath.x = mouse.x;
        linePath.y = wallRight.y - floor.strokeWeight;
    }
}

function detectGameOver(fruit) {
    // if fruit collides with upper bound and has been
    // dropped previously, game over
    if (fruit.y <= gameOverLine.y) {
        if (fruit.state == 'collided') {
            if(!alert('Game Over!')){
                window.location.reload();
                canvas.clear();
            }

        }
    }
}


// preload assets
function preload() {
    for (let i = 0; i < 11; i++) {
        fruitSprites[i] = loadImage('public/' + i + '.png');
    }
}

function setup() {
    scaleCanvas();

    let canvasWidth = canvasSize.canvasWidth / 2;
    let canvasHeight = canvasSize.canvasHeight - 0.2 * canvasSize.canvasHeight;

    canvas = new Canvas(canvasWidth, canvasHeight);
    $('.p5Canvas').appendTo('#canvas-parent');

    scalingFactor = baseHeight / canvasSize.canvasHeight;

    fruits = new Group();
    world.gravity.y = 30 / scalingFactor;

    textFont('Verdana');
    textStyle(BOLD);
    textSize(20 / scalingFactor);

    randomFruit(canvas.w * 0.5, 0.1 * canvas.h);
    nextFruit();

    setupField();
}

function draw() {
    background('#f7f2c8'); 

    lineFollowMouse();
    
    if (currentFruit != null) {
        currentFruitFollowMouse();
    }

    fruits.forEach(fruit => {
        fruit.collides(fruits, collisionDetector);
        fruit.collides(wallLeft, collisionDetector);
        fruit.collides(floor, collisionDetector);
        fruit.collides(wallRight, collisionDetector);

        detectGameOver(fruit);
    });
}


function mouseClicked() {
    if (currentFruit != null) {
        dropFruit();
    }
}
