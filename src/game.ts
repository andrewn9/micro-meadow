import './game.css';

import * as Inputs from './inputs';
import { world, createObject, renderer } from './base';

import * as PIXI from 'pixi.js';
import { Box, Edge, Vec2 } from 'planck';

createObject({
    sprite: PIXI.Sprite.from("grass.png"),
    type: "static",
    position: new Vec2(0, 0),
    angle: Math.PI*0.1,
    visible: true
},{
    shape: new Edge(Vec2(-5, 0), Vec2(5, 0))
});

for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 5; j++) {
        createObject({
            sprite: PIXI.Sprite.from("zombie.png"),
            type: "dynamic",
            position: new Vec2(j-2, i+2),
            visible: true,
        },{
            shape: new Box(1, 1),
            density: 1.0,
            friction: 0.4,
        });
    }
}

const player = createObject({
    sprite: PIXI.Sprite.from("player.png"),
    type: "dynamic",
    position: new Vec2(0, 6),
    fixedRotation: true,
    allowSleep: false,
    visible: true,
}, {
    shape: new Box(1, 1),
    density: 1.0,
    friction: 0.5,
});

createObject({
    sprite: PIXI.Sprite.from("rock.png"),
    type: "static",
    position: new Vec2(0, 0),
    angle: Math.PI*0.1,
    visible: true
},{
    shape: new Edge(Vec2(-5, 0), Vec2(5, 0))
});

world.on('pre-solve', () => {
    if (Inputs.getKeyDown("W")) {
        player.applyForce(new Vec2(0, 5), player.getWorldCenter());
    }
    if (Inputs.getKeyDown("A")) {
        player.applyForce(new Vec2(-5, 0), player.getWorldCenter());
    }
    if (Inputs.getKeyDown("D")) {
        player.applyForce(new Vec2(5, 0), player.getWorldCenter());
    }}
)