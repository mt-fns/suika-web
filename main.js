// TODO: make responsive + add score system


const colliderScalingFactor = 2.5;
const spriteScalingFactor = 0.5

let fruits = [];
let fruitSprites = [];
let floor;
let wall_left;
let wall_right;
let dropped = true;
let currentFruit;

function dropFruit() {
    currentFruit.collider = 'dynamic';
    dropped = true;
}

function randomFruit(x, y) {
    if (dropped) {
        let randomValue = Math.random() * 5;
        let randomInt = Math.floor(randomValue);
        spawnFruits(x, y, randomInt, true);
        console.log(currentFruit.name);
        dropped = false;
    }
}

// spawn fruit given position and order
// x: int
// y: int
// type: int
function spawnFruits(x, y, type, updateCurrent) {
    let fruit = new fruits.Sprite();

    fruit.addAni("default", fruitSprites[type]);
    fruit.ani.scale = spriteScalingFactor;

    fruit.name = "type" + type;
	fruit.diameter = fruit.ani.width / colliderScalingFactor;
    fruit.y = y;
    fruit.x = x;

    if (updateCurrent) {
        fruit.collider = "none";
        currentFruit = fruit;
    }
}

function collisionDetector(fruit1, fruit2) {
    // current fruit order
    let fruitType = +fruit1.name[fruit1.name.length - 1];

    if ((fruit1 == currentFruit) | (fruit2 == currentFruit)) {
        console.log("unallowed collision detected");
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
        console.log("collision detected");
    }
}

function setupField() {
    floor = new Sprite();
	floor.y = 650;
	floor.w = 500;
	floor.h = 5;
	floor.collider = 'static';
    floor.color = '#f6d581';
    floor.stroke = '#f6d581';
    floor.strokeWeight = 10;

    wall_left = new Sprite();
    wall_left.h = 500;
    wall_left.w = 5;
    wall_left.y = 400;
    wall_left.x = 470;
    wall_left.collider = 'static';
    wall_left.color = '#f6d581';
    wall_left.stroke = '#f6d581';
    wall_left.strokeWeight = 10;

    wall_right = new Sprite();
    wall_right.h = 500;
    wall_right.w = 5;
    wall_right.y = 400;
    wall_right.x = 470 + floor.w;
    wall_right.collider = 'static';
    wall_right.color = '#f6d581';
    wall_right.stroke = '#f6d581';
    wall_right.strokeWeight = 10;
}

function followMouse() {
    if (mouse.x > wall_right.x) {
        currentFruit.x = wall_right.x - (wall_right.width + wall_right.strokeWeight);
    }
    else if (mouse.x < wall_left.x) {
        currentFruit.x = wall_left.x + (wall_left.width + wall_left.strokeWeight);
    }
    else {
        currentFruit.x = mouse.x;
        currentFruit.y = 75;
    }
}

function drawLine() {
    
}

function preload() {
    for (let i = 0; i < 11; i++) {
        fruitSprites[i] = loadImage("public/" + i + ".png");
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
