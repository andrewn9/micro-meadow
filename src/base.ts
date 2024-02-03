import { Vec2, World, BodyDef, FixtureDef, Body } from 'planck';
import * as PIXI from 'pixi.js';

import { reset } from './inputs';

const world = new World({
    gravity: new Vec2(0, -10),
});

const app = new PIXI.Application({ antialias: true, backgroundColor: "#888" });
document.body.appendChild(app.view as HTMLCanvasElement);

interface EntityDef extends BodyDef {
    sprite?: PIXI.Sprite | PIXI.Sprite[],
}

const tracker: Body[] = [];

const camera = {
    zoom: 20,
    x: -app.screen.width/2,
    y: -app.screen.height/2,
}

const connections: {[index: string]: (()=>any)[]} = {};

export function createObject(def: EntityDef, fixture?: FixtureDef): Body {
    const body = world.createBody(def);
    
    if (def.sprite) {
        tracker.push(body);
        body.setUserData(def.sprite);
    }
    if (fixture) {
        body.createFixture(fixture);
    }

    return body;
}

export function createSprite(source: PIXI.SpriteSource, width?: number, height?: number): PIXI.Sprite {
    const sprite = PIXI.Sprite.from(source);
    if (width) sprite.width = width;
    if (height) sprite.height = height;

    sprite.anchor.set(0.5, 0.5);
    app.stage.addChild(sprite);

    return sprite;
}

export function connect(event: string, callback: ()=>any) {
    if (!connections[event]) connections[event] = [];
    connections[event].push(callback);
}

export function disconnect(event: string, callback: ()=>any) {
    if (!connections[event]) return;
    const index = connections[event].indexOf(callback);
    if (index != -1) {
        connections[event].splice(index, 1);
    }
}

function fire(event: string) {
    for (let i = 0; i < connections[event].length; i++) {
        connections[event][i]();
    }
}

let acc = performance.now();
function physics() {
    requestAnimationFrame(physics);
    if (performance.now()-acc > 0.016) {
        fire("before");
        world.step(0.016);
        acc += 0.016;
    }
    reset();
}

requestAnimationFrame(physics);

function update() {
    for (let i = 0; i < tracker.length; i++) {
        const body = tracker[i];
        if ((body.getUserData() as any).constructor === Array) {
            const sprites = (body.getUserData() as PIXI.Sprite[]);
            for (let i = 0; i < sprites.length; i++) {
                const sprite = sprites[i];
        
                const pos = body.getPosition();
                sprite.x = pos.x * camera.zoom - camera.x;
                sprite.y = -pos.y * camera.zoom - camera.y;
        
                sprite.rotation = -body.getAngle();
            }
        } else {
            const sprite = body.getUserData() as PIXI.Sprite;
    
            const pos = body.getPosition();
            sprite.x = pos.x * camera.zoom - camera.x;
            sprite.y = -pos.y * camera.zoom - camera.y;
    
            sprite.rotation = -body.getAngle();
        }
    }
}

app.ticker.add(update);