import { OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { KeyboardControl } from "./keyboard-control";
import { Entity } from "./entity";
import { Plugin } from "./plugin";

export enum SystemMode {
    START,
    UPDATE
}

type SystemFunction = (game: Game) => void;

const viewSize = 15; // Adjust based on your game's scale
const aspectRatio = window.innerWidth / window.innerHeight;

export class Game {
    private connected = false;

    public updateSystems: SystemFunction[] = [];
    public startSystems: SystemFunction[] = [];
    public plugins: Plugin[] = [];

    public entities: Entity[] = [];
    public static readonly keyboardControl = new KeyboardControl();
    public scene = new Scene();
    public camera = new PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 100);
    // public camera = new OrthographicCamera(
    //     (-aspectRatio * viewSize) / 2, // left
    //     (aspectRatio * viewSize) / 2,  // right
    //     viewSize / 2,  // top
    //     -viewSize / 2, // bottom
    //     0.1, // near
    //     100 // far
    // );
    public renderer = new WebGLRenderer();

    constructor() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    public run() {
        this.start();
        this.renderer.setAnimationLoop(() => this.update());
    }

    public start() {
        // this.camera.position.z = 10;
        // for (const entity of this.entities) {
        //     entity.start({
        //         camera: this.camera,
        //         keyboardControl: Game.keyboardControl,
        //         scene: this.scene
        //     });
        // }
        for (const system of this.startSystems) {
            system(this);
        }
    }

    public update() {
        // for (const entity of this.entities) {
        //     entity.update({
        //         camera: this.camera,
        //         keyboardControl: this.keyboardControl,
        //         scene: this.scene
        //     });
        // }
        for (const system of this.updateSystems) {
            system(this);
        }
        this.renderer.render(this.scene, this.camera);
    }

    public addSystem(systemMode: SystemMode, system: SystemFunction) {
        switch (systemMode) {
            case SystemMode.START:
                this.startSystems.push(system);
                break;
            case SystemMode.UPDATE:
                this.updateSystems.push(system);
                break;
        }

        return this;
    }

    public addPlugin(plugin: Plugin) {
        this.plugins.push(plugin);
        plugin.build(this);
        return this;
    }
}