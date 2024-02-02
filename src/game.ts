import './style.css';
import { Engine, Render, Bodies, Composite} from 'matter-js';

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine
});

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB, ground]);

// run the renderer
Render.run(render);

let time: number|undefined;
let dt: number = 17, lastdt: number = dt;


function loop(t: number) {
    requestAnimationFrame(loop);

    if (time) {
        dt = t-time;
    }
    dt = Math.min(dt, 100);
    time = t;

    Engine.update(engine, dt, dt/lastdt);
    lastdt = dt;
}

requestAnimationFrame(loop);