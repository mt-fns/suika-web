let fruits = [];
let fruitSprites = [];
// let fruitDiameters = [];
let walls = [];
let initialDiameter = 30;

function randomFruit() {

}

// spawn fruit given position and order
// x: int
// y: int
// type: int
function spawnFruits(x, y) {
    let fruit = new fruits.Sprite();
    fruit.addAni('default', fruitSprites[0]);
    fruit.ani.scale = 0.5;
    fruit.name = 'type0';
	fruit.diameter = initialDiameter;
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

        let fruit = new fruits.Sprite();
        fruit.name = 'type' + newFruitType;
        fruit.addAni('default', fruitSprites[newFruitType]);
        fruit.ani.scale = 0.5;
        fruit.diameter = fruit1.diameter * 1.25;
        fruit.y = y;
        fruit.x = x;

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

    fruits.forEach(fruit => {
        fruit.collides(fruits, collisionDetector);
    });
}

function mouseClicked() {
   spawnFruits(mouse.x, mouse.y); 
}
