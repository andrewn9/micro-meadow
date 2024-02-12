import { Vec2, World, BodyDef, FixtureDef, Body } from 'planck';
import * as PIXI from 'pixi.js';

import { reset } from './inputs';

export const world = new World({
    gravity: new Vec2(0, -26),
});

const app = new PIXI.Application({ antialias: true, backgroundColor: "#888" });
document.body.appendChild(app.view as HTMLCanvasElement);

interface EntityDef extends BodyDef {
    sprite?: SpriteDef,
}

interface SpriteDef {
    source: PIXI.SpriteSource,
    width?: number,
    height?: number,
}

export const map: [EntityDef, FixtureDef | undefined][] = [];

const tracker: Body[] = [];

export const camera = {
    zoom: 20,
    x: 0,
    y: 0,
}

const connections: {[index: string]: (()=>any)[]} = {};

/**
 * Creates new game object
 * @param def Entity definition
 * @param fixture Fixture definition
 * @returns PlanckJs body
 */
export function createObject(def: EntityDef, fixture?: FixtureDef): Body {
    const body = world.createBody(def);
    
    if (def.sprite) {
        const sprite = PIXI.Sprite.from(def.sprite.source);
        if (def.sprite.width) sprite.width = def.sprite.width;
        if (def.sprite.height) sprite.height = def.sprite.height;
    
        sprite.anchor.set(0.5, 0.5);
        app.stage.addChild(sprite);

        tracker.push(body);
        body.setUserData(sprite);
    }
    if (fixture) {
        body.createFixture(fixture);
    }
    map.push([def, fixture]);

    return body;
}

/**
 * 
 * @param source Any sprite source, usually path to image
 * @param width Resizes image width in pixels
 * @param height Resizes image height in pixels
 * @returns A PIXI sprite
 */
export function createSprite(source: PIXI.SpriteSource, width?: number, height?: number): PIXI.Sprite {
    const sprite = PIXI.Sprite.from(source);
    if (width) sprite.width = width;
    if (height) sprite.height = height;

    sprite.anchor.set(0.5, 0.5);
    app.stage.addChild(sprite);

    return sprite;
}

/**
 * Attach a callback to an event
 * @param event Event name
 * @param callback 
 */
export function connect(event: string, callback: ()=>any) {
    if (!connections[event]) connections[event] = [];
    connections[event].push(callback);
}

/**
 * Remove a callback from an event
 * @param event Event name
 * @param callback 
 */
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

const fixedTimeStep = 0.016;
let acc = performance.now();
function physics() {
    requestAnimationFrame(physics);
    if (performance.now()-acc > 100) acc = performance.now() - 100;
    while (performance.now()-acc > fixedTimeStep*1000) {
        fire("before");
        reset();
        world.step(fixedTimeStep);
        acc += fixedTimeStep*1000;
    }
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
            sprite.x = (pos.x - camera.x) * camera.zoom + app.screen.width/2;
            sprite.y = (pos.y - camera.y) * -camera.zoom + app.screen.height/2;
    
            sprite.rotation = -body.getAngle();
        }
    }
}

app.ticker.add(update);