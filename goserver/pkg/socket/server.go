package socket

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

type SocketCallback func(socket Socket)
type Server struct {
	sockets   map[string]Socket
	onConnect SocketCallback
}

type JsonResponse struct {
	Event string      `json:"event"`
	Data  interface{} `json:"data"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func handleWS(w http.ResponseWriter, r *http.Request, server *Server) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("WebSocket upgrade error:", err)
		return
	}

	socket := NewSocket(server, conn)
	socket.Query = r.URL.Query()
	server.sockets[socket.Id] = socket

	server.onConnect(socket)
	socket.Emit("connect", socket.Id)
	defer conn.Close()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Read error:", err)
			socket.Disconnect()
			break
		}

		var response JsonResponse
		err = json.Unmarshal(message, &response)

		if err != nil {
			fmt.Println(err)
			socket.Disconnect()
			break
		}

		listener := socket.events[response.Event]

		if listener == nil {
			continue
		}

		listener(response.Data)
	}
}

func NewWebSocketServer() *Server {
	server := new(Server)
	server.sockets = make(map[string]Socket)
	return server
}

func (server *Server) OnConnect(callback SocketCallback) {
	// server.connections[randomKey] =
	server.onConnect = callback
}

func (server Server) Emit(event string, args ...interface{}) {
	for _, socket := range server.sockets {
		socket.Emit(event, args...)
	}
}

func (server *Server) Serve() {
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		handleWS(w, r, server)
	})
}
