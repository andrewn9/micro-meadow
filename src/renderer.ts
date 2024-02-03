import * as pixi from 'pixi.js';
import * as planck from 'planck';
import { EntityDef } from './base';
import { Application, Container } from 'pixi.js';
import { World, Body } from 'planck';

const pixelsPerM = 32;

type Callbacks = {
    preRender: (() => void)[];
    postRender: (() => void)[];
};

export class Renderer {
    /** The PIXI.js application instance. */
    public app: Application;
    
    private world!: World;
    private main!: Container;
    private bodies: Map<Body, EntityDef> = new Map();

    private callbacks: Callbacks = {
        preRender: [],
        postRender: [],
    };
    
    /**
     * Creates a new Renderer instance.
     * @param {HTMLElement} element - The HTML element to attach the PIXI.js application and stage to.
     */
    constructor(element: HTMLElement) {
        this.app = new Application({ resizeTo: element });
        element.appendChild(this.app.view as HTMLCanvasElement);

        this.main = new Container() 
        this.app.stage.addChild(this.main);

        this.main.position.x = this.app.screen.width/2;
        this.main.position.y = this.app.screen.height/2;

        this.draw = this.draw.bind(this);
    }

    /**
     * Starts the renderer with the provided Planck.js world.
     * @param {World} world - The Planck.js world to render.
     */
    start(world: World) {
        this.world = world;
        console.log(this.world);
        this.app.ticker.add(this.draw);
    }

    /**
     * Adds a Planck.js body and its corresponding entity definition to the renderer.
     * @param {Body} body - The Planck.js body to add.
     * @param {EntityDef} def - The entity definition corresponding to the body.
     */
    add(body: Body, def: EntityDef) {
        this.bodies.set(body, def);
        let sprite = def.sprite;
        if (sprite) {
            sprite.anchor.set(0.5);
        }
    }

    /**
     * The main rendering function that updates the positions and appearance of entities.
     */
    draw() {

        // TODO:    Find a way to represent the appearance of the entity
        //          Entities are made up of fixtures, with their own positions, rotations, and sprites

        this.bodies.forEach((def, body) => {
            let sprite = def.sprite;
            if (sprite) {
                this.main.addChild(sprite);
                sprite.x = body.getPosition().x * pixelsPerM;
                sprite.y = -body.getPosition().y * pixelsPerM;
                sprite.rotation = -body.getAngle();
            }
        });
    }

    /**
     * Registers a callback for a specific renderer event.
     * @param {keyof typeof Renderer.prototype.callbacks} eventType - The type of event to register the callback for: preRender, postRender
     * @param {() => void} callback - The callback function to be executed when the event occurs.
     */
    on(eventType: keyof typeof Renderer.prototype.callbacks, callback: () => void) {
        if (this.callbacks.hasOwnProperty(eventType)) {
            this.callbacks[eventType].push(callback);
        }
    }

    /**
     * Stops the renderer and removes the rendering loop.
     */
    end() {
        this.app.ticker.remove(this.draw);
    }
}
