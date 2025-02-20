import { Camera, Scene } from "three";
import { KeyboardControl } from "./keyboard-control";

export interface UpdateMethodOptions {
    scene: Scene;
    camera: Camera;
    keyboardControl: KeyboardControl;
}

export interface Entity {
    start: (options: UpdateMethodOptions) => void;
    update: (options: UpdateMethodOptions) => void;
}