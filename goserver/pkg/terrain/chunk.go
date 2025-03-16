package terrain

import (
	"github.com/aldernero/go-noise/opensimplex"
)

const CHUNK_SIZE = 8

type ChunkMap = [CHUNK_SIZE][CHUNK_SIZE]BlockType

type Chunk struct {
}

func GenerateChunkMap(chunkX int, chunkY int) ChunkMap {
	var chunkMap ChunkMap
	var simplex = opensimplex.NewOpenSimplex2(1)
	for x := range CHUNK_SIZE {
		for y := range CHUNK_SIZE {
			var xCoord = float64(x)/float64(CHUNK_SIZE) + float64(chunkX)
			var yCoord = float64(y)/float64(CHUNK_SIZE) + float64(chunkY)
			var noise = simplex.Noise2D(xCoord, yCoord)

			if noise >= 0 {
				chunkMap[x][y] = BlockType(DIRT)
			} else {
				chunkMap[x][y] = BlockType(GRASS)
			}
		}
	}

	return chunkMap
}
