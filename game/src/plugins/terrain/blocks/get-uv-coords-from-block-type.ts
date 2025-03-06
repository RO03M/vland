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
        default:
            return [0, 0];
    }
}