import { safe } from "../utils/safe";

type SocketListener = (...data: any[]) => void;

export class SocketClient {
    private webSocket: WebSocket;

    private events = new Map<string, SocketListener[]>();

    constructor(url: string) {
        this.webSocket = new WebSocket(url);
        this.webSocket.onopen = (event) => {
            // console.log(event);
            // const connectListeners = this.events.get("connect") ?? [];
            // for (const listener of connectListeners) {
            //     listener();
            // }
            // this.emit("ping", "ping");
        }
        this.webSocket.onmessage = (event) => {
            const parsed = safe(() => JSON.parse(event.data));

            if (parsed.error) {
                return;
            }

            for (const [key, data] of Object.entries(parsed.data)) {
                const listeners = this.events.get(key);

                if (listeners === undefined) {
                    continue;
                }

                for (const listener of listeners) {
                    if (Array.isArray(data)) {
                        listener(...data);
                        continue;
                    }

                    listener(data);
                }
            }
        }
    }

    public emit(event: string, ...args: any[]) {
        const data = JSON.stringify({ event, data: args });
        this.webSocket.send(data);
    }

    public on(event: string, listener: SocketListener) {
        const listeners = this.events.get(event) ?? [];
        
        listeners.push(listener)
        this.events.set(event, listeners);
    }

    public off(event: string) {
        this.events.delete(event);
    }
}