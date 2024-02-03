import './game.css';

import * as Inputs from './inputs';
import { createObject, createSprite, connect } from './base'

import { Box, Edge, Vec2 } from 'planck';

createObject({
    type: "static",
    sprite: createSprite("player.png", 600, 60),
    position: new Vec2(0, -5),
},{
    shape: new Box(15, 1.5),
});

for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        createObject({
            type: "dynamic",
            sprite: createSprite("player.png", 40, 40),
            position: new Vec2(i-2, j+3),
        },{
            shape: new Box(1, 1),
            density: 2,
        });
    }
}

const player = createObject({
    type: "dynamic",
    sprite: createSprite("player.png", 40, 40),
    position: new Vec2(0, 10),
},{
    shape: new Box(1, 1),
    density: 10,
    friction: 0.7
});

connect("before", ()=>{
    const pos = player.getWorldCenter();
    let dx = 0;
    if (Inputs.getKeyDown("d")) dx++;
    if (Inputs.getKeyDown("a")) dx--;

    if (dx !== 0) {
        player.applyLinearImpulse(new Vec2(dx*5, 0), pos);
    }

    if (Inputs.getKeyPressed(" ")) {
        player.applyLinearImpulse(new Vec2(0, 350), pos);
    }
});