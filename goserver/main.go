package main

import (
	"fmt"
	"net/http"
	"vland-server/pkg/socket"
)

func main() {
	server := socket.NewWebSocketServer()
	server.OnConnect(func(socket socket.Socket) {
		socket.Emit("welcome", "Welcome")
		socket.On("fofo", func(message interface{}) {
			fmt.Printf("%s", message)
			socket.Broadcast().Emit("teste", message)
		})
		socket.On("ping", func(message interface{}) {
			socket.Emit("pong", "pong")
		})
	})
	server.Serve()
	// http.HandleFunc("/ws", handleWS)

	fmt.Println("WebSocket server started on ws://localhost:8080/ws")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		fmt.Println("Server error:", err)
	}
}
