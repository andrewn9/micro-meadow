import { Vec2, World, BodyDef, FixtureDef, Body } from 'planck';
import { Renderer } from './renderer';
import * as PIXI from 'pixi.js';

// function assert(condition: any, msg?: string): asserts condition {
//     if (!condition) {
//         throw new Error(msg);
//     }
// }

export const renderer = new Renderer(document.getElementById("viewport") as HTMLElement);
export const app = renderer.app;

export const world = new World({
    gravity: Vec2(0, -10),
    allowSleep: true,
});

export interface EntityDef extends BodyDef {
    sprite?: PIXI.Sprite,
    visible?: Boolean
}

export function createObject(def: EntityDef, fixture?: FixtureDef) {
    const body = world.createBody(def);

    if (fixture) {
        body.createFixture(fixture);
    }

    if (def.visible) {
        def.sprite?.anchor.set(0.5);
        renderer.add(body, def);
    }

    return body;
}

// setInterval(()=> {
//     world.step(1 / 60);
// }, 1 / 60);

var lastTime = performance.now();
function gameLoop(currentTime: number) {
    var deltaTime = (currentTime - lastTime) / 1000;
    world.step(deltaTime);
    lastTime = currentTime;
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

renderer.start(world);