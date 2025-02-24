import { Game } from "./game";

export abstract class Plugin {
    public abstract build(game: Game): void;
}