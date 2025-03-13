package main

import (
	"fmt"
	"net/http"
	"reflect"
	"vland-server/pkg/player"
	"vland-server/pkg/socket"
	"vland-server/pkg/terrain"
	"vland-server/pkg/util"

	"github.com/aldernero/go-noise/opensimplex"
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

		socket.On("generate_chunk", func(message interface{}) {

			if reflect.TypeOf(message).Kind() != reflect.Slice {
				return
			}

			slice, ok := message.([]interface{})
			if !ok || len(slice) == 0 {
				return
			}

			var coords map[string]interface{}
			coords, ok = slice[0].(map[string]interface{})
			if !ok {
				return
			}

			var x, y = coords["x"].(float64), coords["y"].(float64)

			var chunkMap = terrain.GenerateChunkMap(int(x), int(y))

			socket.Emit("chunk_map", chunkMap)
		})

		socket.On("disconnect", func(message interface{}) {
			fmt.Println("Client disconnected ", socket.Id)
			delete(playerManager.Players, socket.Id)
			server.Emit("player_disconnected", socket.Id)
		})
	})
	server.Serve()

	fmt.Println("WebSocket server started on ws://localhost:8080/ws")
	http.HandleFunc("GET /noise/{seed}", func(w http.ResponseWriter, r *http.Request) {
		var simplex = opensimplex.NewOpenSimplex2(1)
		// simplex.Init(1)
		for x := -5.0; x < 5; x += 1 {
			for y := -5.0; y < 5; y += 1 {
				var foo = simplex.Noise2DImproveX(x, y)
				fmt.Printf("%f %f %f\n", x, y, foo)
			}
		}
		// simplexnoise.Q()
		// var noise = simplexnoise.Noise2(2, 3)
		// fmt.Println(noise)
	})

	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		fmt.Println("Server error:", err)
	}
}
