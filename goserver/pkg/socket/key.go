package socket

import (
	"crypto/rand"
	"encoding/hex"
)

func generateRandomKey() string {
	bytes := make([]byte, 8)
	rand.Read(bytes)

	return hex.EncodeToString(bytes)
}
