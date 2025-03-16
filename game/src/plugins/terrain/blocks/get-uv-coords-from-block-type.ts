import { BlockType } from "./block-type";

interface Options {
    isLeveled?: boolean;
}

export function getUvCoordsFromBlockType(type: BlockType, options: Options = {}): [number, number] {
    const { isLeveled = false } = options;

    switch (type) {
        case BlockType.AIR:
            return [0, 0];
        case BlockType.GRASS:
            return [1, 32 - +isLeveled];
        case BlockType.DIRT:
            return [2, 32 - +isLeveled];
        case BlockType.STONE:
            return [3, 32 - +isLeveled];
        case BlockType.SAND:
            return [4, 32 - +isLeveled];
        case BlockType.WATER_DEEP:
            return [5, 32];
        case BlockType.WATER_MID:
            return [5, 31];
        case BlockType.WATER_SHALLOW:
            return [6, 32];
        default:
            return [0, 0];
    }
}