import './game.css';

import * as Inputs from './inputs';
import { createObject, app } from './base';

import * as PIXI from 'pixi.js';
import { Box, Edge, Vec2 } from 'planck';

createObject({
    sprite: PIXI.Sprite.from("grass.png"),
    type: "static",
    position: new Vec2(0, -10),
    angle: Math.PI*0.1,
},{
    shape: new Edge(Vec2(-50, 0), Vec2(50, 0))
});

for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 5; j++) {
        createObject({
            sprite: PIXI.Sprite.from("zombie.png"),
            type: "dynamic",
            position: new Vec2(j-2, i+2),
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
    allowSleep: false
}, {
    shape: new Box(1, 1),
    density: 1.0,
    friction: 0.5,
});

app.ticker.add(() => {
    if (Inputs.getKeyDown("A")) {
        player.applyForceToCenter(new Vec2(-100, 0));
    }
    if (Inputs.getKeyDown("D")) {
        player.applyForceToCenter(new Vec2(100, 0));
    }
})