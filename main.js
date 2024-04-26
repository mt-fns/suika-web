const colliderScalingFactor = 2.5;
const spriteScalingFactor = 0.5

let fruits = [];
let fruitSprites = [];
let initialDiameter = 30;
let dropped = false;

function randomFruit(x, y) {
    let randomValue = Math.random() * 4;
    let randomInt = Math.floor(randomValue);
    spawnFruits(x, y, randomInt);
}

// spawn fruit given position and order
// x: int
// y: int
// type: int
function spawnFruits(x, y, type) {
    let fruit = new fruits.Sprite();
    fruit.addAni('default', fruitSprites[type]);
    fruit.ani.scale = spriteScalingFactor;
    fruit.name = 'type' + type;
	fruit.diameter = fruit.ani.width / colliderScalingFactor;
    console.log(type, fruit.diameter);
    console.log(fruit.ani);
    fruit.y = y;
    fruit.x = x;
}

function collisionDetector(fruit1, fruit2) {
    // current fruit order
    let fruitType = +fruit1.name[fruit1.name.length - 1];

    if ((fruit1.name == fruit2.name) & (fruitType <= 8)) {
        // new position for fruit
        let x = (fruit1.x + fruit2.x)/2;
        let y = (fruit1.y + fruit2.y)/2;
        let newFruitType = fruitType + 1;

        spawnFruits(x, y, newFruitType);
        fruit1.remove();
        fruit2.remove();
        console.log("collision detected");
    }
}

function preload() {
    for (let i = 0; i < 11; i++) {
        fruitSprites[i] = loadImage("public/" + i + ".png");
    }
}

function setup() {
	new Canvas();

    fruits = new Group();
    world.gravity.y = 10;

    let floor = new Sprite();
	floor.y = 650;
	floor.w = 400;
	floor.h = 5;
	floor.collider = 'static';
    floor.color = '#f6d581';
    floor.stroke = '#f6d581';
    floor.strokeWeight = 10;

    let wall_left = new Sprite();
    wall_left.h = 500;
    wall_left.w = 5;
    wall_left.y = 400;
    wall_left.x = 520;
    wall_left.collider = 'static';
    wall_left.color = '#f6d581';
    wall_left.stroke = '#f6d581';
    wall_left.strokeWeight = 10;

    let wall_right = new Sprite();
    wall_right.h = 500;
    wall_right.w = 5;
    wall_right.y = 400;
    wall_right.x = 520 + floor.w;
    wall_right.collider = 'static';
    wall_right.color = '#f6d581';
    wall_right.stroke = '#f6d581';
    wall_right.strokeWeight = 10;
}

function draw() {
    background('#f7f2c8');  

    if (dropped) {
        randomFruit(mouse.x, mouse.y); 
    }

    fruits.forEach(fruit => {
        fruit.collides(fruits, collisionDetector);
    });
}

function mouseClicked() {
    randomFruit(mouse.x, mouse.y);
}
