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
	server.sockets[generateRandomKey()] = socket
	fmt.Println(server.onConnect)
	server.onConnect(socket)
	defer conn.Close()

	fmt.Println("Client connected", r.URL.Query().Get("teste"))

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Read error:", err)
			break
		}

		var response JsonResponse
		err = json.Unmarshal(message, &response)

		if err != nil {
			fmt.Println(err)
			socket.Emit("disconnect", err.Error())
			break
		}

		listener := socket.events[response.Event]

		if listener == nil {
			continue
		}

		listener(response.Data)
	}

	fmt.Println("Client disconnected")
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

func (server Server) Emit() {

}

func (server *Server) Serve() {
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		handleWS(w, r, server)
	})
}
