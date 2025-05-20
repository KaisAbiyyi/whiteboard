import type { Stroke } from '../types/whiteboard';


export const startReplay = (
    strokes: Stroke[],
    addStroke: (stroke: Stroke) => void,
    clear: () => void,
    delayMs = 50
) => {
    const sorted = [...strokes]; // Pastikan urut jika perlu
    let currentIndex = 0;
    let lastTimestamp = 0;

    clear(); // Kosongkan canvas sebelum replay

    const step = (timestamp: number) => {
        if (!lastTimestamp) lastTimestamp = timestamp;

        const elapsed = timestamp - lastTimestamp;

        if (elapsed >= delayMs) {
            if (currentIndex < sorted.length) {
                addStroke(sorted[currentIndex]);
                currentIndex++;
                lastTimestamp = timestamp;
            }
        }

        if (currentIndex < sorted.length) {
            requestAnimationFrame(step);
        } else {
            console.log('[Replay] Selesai');
        }
    };

    requestAnimationFrame(step);
};