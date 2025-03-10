package socket

type Broadcast struct {
	socket Socket
}

func (broadcast Broadcast) Emit(event string, args ...interface{}) {
	for _, socket := range broadcast.socket.Server.sockets {
		if broadcast.socket.Id == socket.Id {
			continue
		}

		socket.Emit(event, args...)
	}
}
