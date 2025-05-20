import type { Stroke } from "../types/whiteboard";

export const isValidStroke = (stroke: any): stroke is Stroke => {
    console.log('[Validator] Checking stroke validity:', stroke);

    if (!stroke) {
        console.log('[Validator] Failed: stroke is null or undefined');
        return false;
    }

    if (!Array.isArray(stroke.points)) {
        console.log('[Validator] Failed: points is not an array');
        return false;
    }

    if (stroke.points.length === 0) {
        console.log('[Validator] Failed: points array is empty');
        return false;
    }

    const validPoints = stroke.points.every(
        (p: any) => p && typeof p.x === 'number' && typeof p.y === 'number'
    );
    if (!validPoints) {
        console.log('[Validator] Failed: some points have invalid coordinates');
        return false;
    }

    if (typeof stroke.color !== 'string') {
        console.log('[Validator] Failed: color is not a string');
        return false;
    }

    if (typeof stroke.width !== 'number') {
        console.log('[Validator] Failed: width is not a number');
        return false;
    }

    return true;
};