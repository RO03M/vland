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
			var noise = simplex.Noise2D(float64(chunkX*CHUNK_SIZE+x), float64(chunkY*CHUNK_SIZE+y))

			if noise >= -0.5 {
				chunkMap[x][y] = BlockType(DIRT)
			} else {
				chunkMap[x][y] = BlockType(GRASS)
			}
		}
	}

	return chunkMap
}
