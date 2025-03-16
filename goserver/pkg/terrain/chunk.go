package terrain

import (
	"github.com/aquilax/go-perlin"
)

const CHUNK_SIZE = 8

type ChunkMap = [CHUNK_SIZE][CHUNK_SIZE]BlockType

type Chunk struct {
}

var noiseGenerator = perlin.NewPerlin(20, 2, 3, 10)

func GenerateChunkMap(chunkX int, chunkY int) ChunkMap {
	var chunkMap ChunkMap
	// var simplex = opensimplex.NewOpenSimplex2(1)
	for x := range CHUNK_SIZE {
		for y := range CHUNK_SIZE {
			var xCoord = float64(x)/float64(CHUNK_SIZE) + float64(chunkX)
			var yCoord = float64(y)/float64(CHUNK_SIZE) + float64(chunkY)
			// var noise = simplex.Noise2D(xCoord, yCoord)
			var noise = noiseGenerator.Noise2D(xCoord, yCoord)

			var blockType BlockType

			if noise <= -0.7 {
				blockType = BlockType(WATER_DEEP)
			} else if noise <= -0.4 {
				blockType = BlockType(WATER_MID)
			} else if noise <= -0.1 {
				blockType = BlockType(WATER_SHALLOW)
			} else if noise <= 0 {
				blockType = BlockType(SAND)
			} else if noise <= 0.9 {
				blockType = BlockType(GRASS)
			} else {
				blockType = BlockType(STONE)
			}

			chunkMap[x][y] = blockType
		}
	}

	return chunkMap
}
