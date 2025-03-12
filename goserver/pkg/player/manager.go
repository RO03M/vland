package player

type PlayerManager struct {
	Players map[string]Player
}

func NewPlayerManager() PlayerManager {
	return PlayerManager{
		Players: make(map[string]Player),
	}
}

func (p PlayerManager) NewPlayer(id string, username string) Player {
	var player = Player{
		Id:       id,
		Username: username,
	}

	p.Players[player.Id] = player

	return player
}

func (pm PlayerManager) PlayersSlice() []Player {
	var players = []Player{}

	for _, player := range pm.Players {
		players = append(players, player)
	}

	return players
}

func (p PlayerManager) PlayerExists(username string) bool {
	_, exists := p.Players[username]

	return exists
}
