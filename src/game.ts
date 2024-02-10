import './game.css';

import * as Inputs from './inputs';
import { createObject, createSprite, connect, camera, world } from './base'

import { Box, Contact, Manifold, Vec2 } from 'planck';

function assert(condition: any, msg?: string): asserts condition {
    if (!condition) {
        throw new Error(msg);
    }
}

createObject({
    type: "static",
    sprite: createSprite("player.png", 600, 60),
    position: new Vec2(0, -5),
},{
    shape: new Box(15, 1.5),
    friction: 0.5,
});

createObject({
    type: "static",
    sprite: createSprite("player.png", 600, 60),
    position: new Vec2(27, 2.5),
    angle: Math.PI/6,
},{
    shape: new Box(15, 1.5),
    friction: 0.5,
});

createObject({
    type: "static",
    sprite: createSprite("player.png", 200, 400),
    position: new Vec2(-15, 2.5),
},{
    shape: new Box(5, 10),
    friction: 0.5,
});

createObject({
    type: "dynamic",
    sprite: createSprite("player.png", 40, 40),
    position: new Vec2(0, 11),
},{
    shape: new Box(1, 1),
    density: 2,
    friction: 0.5,
});

// for (let i = 0; i < 5; i++) {
//     for (let j = 0; j < 5; j++) {
//         createObject({
//             type: "dynamic",
//             sprite: createSprite("player.png", 40, 40),
//             position: new Vec2(i-2, j+3),
//         },{
//             shape: new Box(1, 1),
//             density: 2,
//         });
//     }
// }

const player = createObject({
    type: "dynamic",
    sprite: createSprite("player.png", 40, 40),
    position: new Vec2(0, 10),
    allowSleep: false,
    // fixedRotation: true,
},{
    shape: new Box(1, 1),
    density: 10,
    friction: 1.5,
});

const contacts: Contact[] = [];

connect("before", ()=>{
    let grounded = null;
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts.pop();
        assert(contact);

        const fixtureA = contact.getFixtureA();
        const fixtureB = contact.getFixtureB();
        if (!fixtureA && !fixtureB) continue;
        if (fixtureA.getBody() !== player && fixtureB.getBody() !== player) continue;

        const manifold = contact.getWorldManifold(null);
        if (manifold && Math.acos(manifold.normal.y) < Math.PI/4) {
            grounded = manifold.normal;
            break;
        }
    }

    const pos = player.getWorldCenter();
    let dx = 0;
    if (Inputs.getKeyDown("d")) dx++;
    if (Inputs.getKeyDown("a")) dx--;

    let speed = 30;

    if (dx !== 0) {
        if (player.getLinearVelocity().x*dx > 0) {
            const damping = Math.sqrt(1-player.getLinearVelocity().x*dx*0.125) || 0;
            speed *= damping;
        }
        if (grounded) {
            player.applyLinearImpulse(new Vec2(dx*grounded.y*speed, -grounded.x*speed), pos);
            // player.applyLinearImpulse(new Vec2(dx*speed, 0), pos);
        } else {
            speed *= 0.5
            player.applyLinearImpulse(new Vec2(dx*speed, 0), pos);
        }
    }

    if (Inputs.getKeyPressed(" ") && grounded) {
        player.applyLinearImpulse(new Vec2(0, 500), pos);
    }

    camera.x += (pos.x-camera.x) * 0.1;
    camera.y += (pos.y-camera.y) * 0.1;
});

world.on("pre-solve", (contact) => {
    contacts.push(contact);

    const fixtureA = contact.getFixtureA();
    const fixtureB = contact.getFixtureB();
    if (!fixtureA && !fixtureB) return;
    if (fixtureA.getBody() !== player && fixtureB.getBody() !== player) return;

    const manifold = contact.getWorldManifold(null);

    assert(manifold);
    const y = manifold.normal.y;
    const friction = 1-Math.sqrt(1-9*y*y);
    if (!Number.isNaN(friction)) {
        contact.setFriction(friction);
    }

    // console.log(worldManifold?.normal);
});