export function degreesToRadians(degrees: number) {
    return degrees * (Math.PI / 180);
}

export function radiansToDegress(radians: number) {
    return radians * 180 / Math.PI
}

export function clamp(value: number, min: number, max: number) {
    const minCheck = value < min ? min : value;
    return minCheck > max ? max : minCheck;
}