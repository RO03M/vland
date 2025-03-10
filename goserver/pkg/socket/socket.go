package socket

import "github.com/gorilla/websocket"

type SocketListener func(message interface{})

type Socket struct {
	Id         string
	Server     *Server
	connection *websocket.Conn
	events     map[string]SocketListener
}

func NewSocket(server *Server, connection *websocket.Conn) Socket {
	return Socket{
		Id:         generateRandomKey(),
		Server:     server,
		connection: connection,
		events:     make(map[string]SocketListener),
	}
}

// value should be an interface in the future
func (socket Socket) Emit(event string, args ...interface{}) {
	socket.connection.WriteJSON(map[string]interface{}{
		event: args,
	})
}

func (socket *Socket) On(event string, listener func(message interface{})) {
	socket.events[event] = listener
}

func (socket Socket) Broadcast() Broadcast {
	return Broadcast{
		socket: socket,
	}
}
