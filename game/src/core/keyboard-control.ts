export class KeyboardControl {
    private keyMap = new Map<string, boolean>();

    constructor() {
        document.addEventListener("keydown", (event) => {
            this.keyMap.set(event.code, true);
        });
        document.addEventListener("keyup", (event) => {
            this.keyMap.set(event.code, false);
        });
    }

    public isPressed(code: string) {
        return this.keyMap.get(code) ?? false;
    }
}