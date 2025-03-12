package main

import (
	"fmt"
	"net/http"
	"vland-server/pkg/player"
	"vland-server/pkg/socket"
	"vland-server/pkg/util"
)

func main() {
	playerManager := player.NewPlayerManager()
	server := socket.NewWebSocketServer()
	server.OnConnect(func(socket socket.Socket) {
		var username = socket.Query.Get("username")

		if username == "" {
			socket.Disconnect()
			fmt.Println("Invalid socket conneection", socket.Id)
			return
		}

		if playerManager.PlayerExists(username) {
			socket.Disconnect()
			fmt.Printf("Player %s already exists\n", username)
			return
		}

		fmt.Println("Client connected", socket.Id)

		socket.Emit("initial_players", util.Keys((playerManager.Players)))
		playerManager.NewPlayer(socket.Id, username)

		socket.Broadcast().Emit("newplayer", map[string]interface{}{
			"id": socket.Id,
		})

		socket.On("walk", func(message interface{}) {
			switch value := message.(type) {
			case []interface{}:
				socket.Broadcast().Emit("walk", value[0])
			}
		})

		socket.On("disconnect", func(message interface{}) {
			fmt.Println("Client disconnected ", socket.Id)
			delete(playerManager.Players, socket.Id)
			server.Emit("player_disconnected", socket.Id)
		})
	})
	server.Serve()

	fmt.Println("WebSocket server started on ws://localhost:8080/ws")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		fmt.Println("Server error:", err)
	}
}
