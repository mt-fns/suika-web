// TODO: make responsive
// fix line path rendering
// add sounds + change sprites

const colliderScalingFactor = 2.5;
const spriteScalingFactor = 0.5;

let fruits = [];
let fruitSprites = [];
let floor;
let wallLeft;
let wallRight;
let linePath;
let scoreBoard;
let score = 0;

let dropped = true;
let currentFruit;

function dropFruit() {
    let type = currentFruit.name;
    currentFruit.collider = 'dynamic';
    updateScore(type);
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

// spawn fruit given position and order
// x: int
// y: int
// type: int
function spawnFruits(x, y, type, updateCurrent) {
    let fruit = new fruits.Sprite();

    fruit.addAni('default', fruitSprites[type]);
    fruit.ani.scale = spriteScalingFactor;

    fruit.name = 'type' + type;
	fruit.diameter = fruit.ani.width / colliderScalingFactor;
    fruit.y = y;
    fruit.x = x;

    if (updateCurrent) {
        fruit.collider = 'none';
        currentFruit = fruit;
    }
}

function createScoreBoard() {
    scoreBoard = new Sprite();
    scoreBoard.text = 'Score: 0';
    scoreBoard.color = '#f7f2c8';
    scoreBoard.stroke = '#f7f2c8';
    scoreBoard.textColor = '#000000';
    scoreBoard.collider = 'none';
    scoreBoard.textSize = 40;
    scoreBoard.y = currentFruit.y;
}

function updateScore(type) {
    // get last character of string then turn to int
    let fruitType = +type[type.length - 1];
    let addScore = (fruitType + 1) * 2;
    console.log(fruitType);
    score += addScore;
    scoreBoard.text = 'Score: ' + score;
}

function collisionDetector(fruit1, fruit2) {
    // current fruit order
    let fruitType = +fruit1.name[fruit1.name.length - 1];

    if ((fruit1 == currentFruit) | (fruit2 == currentFruit)) {
        return;
    }

    if ((fruit1.name == fruit2.name) & (fruitType <= 8)) {
        // new position for fruit
        let x = (fruit1.x + fruit2.x)/2;
        let y = (fruit1.y + fruit2.y)/2;
        let newFruitType = fruitType + 1;

        spawnFruits(x, y, newFruitType, false);
        fruit1.remove();
        fruit2.remove();
    }
}

function setupField() {
    floor = new Sprite();
	floor.y = 750;
	floor.w = 500;
	floor.h = 5;
	floor.collider = 'static';
    floor.color = '#f6d581';
    floor.stroke = '#f6d581';
    floor.strokeWeight = 10;

    wallLeft = new Sprite();
    wallLeft.h = 500;
    wallLeft.w = 5;
    wallLeft.y = 500;
    wallLeft.x = 470;
    wallLeft.collider = 'static';
    wallLeft.color = '#f6d581';
    wallLeft.stroke = '#f6d581';
    wallLeft.strokeWeight = 10;

    wallRight = new Sprite();
    wallRight.h = 500;
    wallRight.w = 5;
    wallRight.y = 500;
    wallRight.x = 470 + floor.w;
    wallRight.collider = 'static';
    wallRight.color = '#f6d581';
    wallRight.stroke = '#f6d581';
    wallRight.strokeWeight = 10;

    linePath = new Sprite();
    linePath.h = 500;
    linePath.w = 2;
    linePath.y = wallRight.y - currentFruit.diameter;
    linePath.x = currentFruit.x;
    linePath.collider = 'none';
    linePath.color = '#FFFFFF';
    linePath.stroke = '#FFFFFF';

    createScoreBoard();
}

function followMouse() {
    if (mouse.x > wallRight.x) {
        let newCoords = wallRight.x - (wallRight.width + wallRight.strokeWeight);
        currentFruit.x = newCoords;
        linePath.x = newCoords;
    }
    else if (mouse.x < wallLeft.x) {
        let newCoords = wallLeft.x + (wallLeft.width + wallLeft.strokeWeight);
        currentFruit.x = newCoords;
        linePath.x = newCoords;
    }
    else {
        currentFruit.x = mouse.x;
        currentFruit.y = 200;
        
        linePath.x = mouse.x;
        linePath.y = wallRight.y - currentFruit.diameter;
    }
}

function preload() {
    for (let i = 0; i < 11; i++) {
        fruitSprites[i] = loadImage('public/' + i + '.png');
    }
}

function setup() {
	new Canvas();

    fruits = new Group();
    world.gravity.y = 15;
    randomFruit(650, 75);

    setupField();
}

function draw() {
    background('#f7f2c8');  

    if (dropped) {
        randomFruit(mouse.x, mouse.y); 
    }
    followMouse();

    fruits.forEach(fruit => {
        fruit.collides(fruits, collisionDetector);
    });
}

function mouseClicked() {
    dropFruit();
    randomFruit(mouse.x, mouse.y);
}
