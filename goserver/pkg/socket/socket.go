package socket

import "github.com/gorilla/websocket"

type SocketListener func(message interface{})

type Socket struct {
	connection *websocket.Conn
	events     map[string]SocketListener
}

func NewSocket(connection *websocket.Conn) Socket {
	return Socket{
		connection: connection,
		events:     make(map[string]SocketListener),
	}
}

// value should be an interface in the future
func (socket Socket) Emit(event string, value string) {
	socket.connection.WriteJSON(map[string]interface{}{
		event: value,
	})
}

func (socket *Socket) On(event string, listener func(message interface{})) {
	socket.events[event] = listener
}
