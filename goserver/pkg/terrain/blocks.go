package terrain

type BlockType int

const (
	AIR           = iota
	GRASS         = iota
	DIRT          = iota
	STONE         = iota
	SAND          = iota
	WATER_DEEP    = iota
	WATER_MID     = iota
	WATER_SHALLOW = iota
)
