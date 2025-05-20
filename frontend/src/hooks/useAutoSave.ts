import { useCallback, useRef, useState } from 'react';
import type { Stroke } from '../types/whiteboard';
import { saveBoardState } from '../services/boardService';

export const useAutoSave = (boardId: string, strokes: Stroke[]) => {
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const flushSave = useCallback((snapshot?: Stroke[]) => {
        const toSave = snapshot ?? strokes;
        if (!boardId) return;

        if (saveTimeout.current) {
            clearTimeout(saveTimeout.current);
            saveTimeout.current = null;
        }

        (async () => {
            try {
                setIsSaving(true);
                await saveBoardState(boardId, toSave);
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 1000);
            } catch (err) {
                console.error('[FlushSave] Failed to save board state:', err);
            } finally {
                setIsSaving(false);
            }
        })();
    }, [boardId, strokes]);

    return {
        isSaving,
        isSaved,
        flushSave
    };
};
