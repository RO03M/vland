export class SocketClient {
    private webSocket: WebSocket;

    constructor(url: string) {
        this.webSocket = new WebSocket(url);
        this.webSocket.onopen = () => {
            console.log("connected");
            this.emit("ping", "ping");
        }
        this.webSocket.onmessage = function(event) {
            console.log("event", event)
        }
    }

    public emit(event: string, ...args: any[]) {
        const data = JSON.stringify({ event, data: args });
        this.webSocket.send(data);
    }
}