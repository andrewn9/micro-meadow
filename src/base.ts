import { Vec2, World, BodyDef, FixtureDef, Body } from 'planck';
import * as PIXI from 'pixi.js';

// function assert(condition: any, msg?: string): asserts condition {
//     if (!condition) {
//         throw new Error(msg);
//     }
// }

export const app = new PIXI.Application({ antialias: true, resizeTo: window });
document.body.appendChild(app.view as HTMLCanvasElement);

const world = new World({
    gravity: Vec2(0, -1),
    allowSleep: true,
});

// pixels per meter
let scale = 20;

const stage = new PIXI.Container();
app.stage.addChild(stage);

stage.position.x = app.screen.width/2;
stage.position.y = app.screen.height/2;
// stage.pivot.x = stage.width/2;
// stage.pivot.y = stage.height/2;

const tracker: Map<Body, PIXI.Sprite> = new Map();

interface EntityDef extends BodyDef {
    sprite?: PIXI.Sprite,
}

export function createObject(def: EntityDef, fixture?: FixtureDef) {
    const body = world.createBody(def);

    if (fixture) {
        body.createFixture(fixture);
    }

    if (def.sprite) {
        const sprite = def.sprite;
        tracker.set(body, sprite);
        sprite.anchor.set(0.5);

        stage.addChild(sprite);
    }

    return body;
}

setInterval(()=>{
    world.step(1/60);
}, 1/60);

app.ticker.add((dt) => {
    dt /= 30;
    tracker.forEach((sprite, body) => {
        sprite.x = body.getPosition().x * scale;
        sprite.y = -body.getPosition().y * scale;
        sprite.rotation = -body.getAngle();
    });
});