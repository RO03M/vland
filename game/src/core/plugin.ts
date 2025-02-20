import { Game } from "./game";

export abstract class Plugin {
    abstract build(game: Game): void;
}