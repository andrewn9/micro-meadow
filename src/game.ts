import './style.css';
import { Engine, Events, Render, Runner, Bodies, Composite, Body, Vector, Pair, Pairs } from 'matter-js';
import * as Inputs from './inputs'

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
});

render.options.showCollisions=true;
render.options.showVelocity=true;
render.options.showDebug=true;

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 450, 80, 80, {});
var boxB = Bodies.rectangle(400, 500, 80, 80, {});
var ground = Bodies.rectangle(400, 600, 800, 85, { isStatic: true});

// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB, ground]);

// run the renderer
Render.run(render);

const runner = Runner.create({
    isFixed: true,
});

Runner.run(runner, engine);

var grounded = false;
let pairs : Pair[];

Events.on(runner, "beforeTick", () => {
    // grounded = false;
    // if (pairs) {
    //     for (var i = 0; i < pairs.length; i++) {
    //         var pair = pairs[i];
    //         if (pair.bodyA === boxA) {
    //             console.log();
    //             if (Math.atan2(pair.collision.normal.y, pair.collision.normal.x) <= -3/2) {
    //                 grounded = true;
    //             }
    //         }
    //     }
    //     pairs = [];
    // }

    // let speed = (grounded)?0.01:0.01;
    // if (grounded) {
    //     if (Inputs.getKeyPressed(' ')) {
    //         Body.applyForce(boxA, boxA.position, Vector.create(0,-0.25));
    //     }
    // }
    // if (Inputs.getKeyDown('ArrowLeft')) {
    //     Body.applyForce(boxA, boxA.position, Vector.create(-speed, 0));
    // }
    // if (Inputs.getKeyDown('ArrowRight')) {
    //     Body.applyForce(boxA, boxA.position, Vector.create(speed,0));
    // }
    
    // console.log(grounded);
});

Events.on(engine, "collisionActive", function (event) {
    pairs = event.pairs;
});