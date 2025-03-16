export class MouseController {
    public wheel = 0;

    private wheelEndTimeout: NodeJS.Timeout | undefined;

    constructor() {
        document.addEventListener("wheel", (event) => {
            console.log(event.deltaY / 100);
            this.wheel = event.deltaY / 100;

            clearTimeout(this.wheelEndTimeout);
            this.wheelEndTimeout = setTimeout(() => {
                this.wheel = 0;
            }, 100);
        });
    }
}