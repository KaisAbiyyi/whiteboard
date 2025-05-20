import { useCallback } from 'react';
import type { Stroke } from '../types/whiteboard';
import { getCurrentUserId } from '../lib/session';
import { sendAllStrokes } from '../lib/ws';

type StrokeHistoryProps = {
    strokes: Stroke[];
    setStrokes: React.Dispatch<React.SetStateAction<Stroke[]>>;
    redoStack: Stroke[];
    setRedoStack: React.Dispatch<React.SetStateAction<Stroke[]>>;
    flushSave: (snapshot?: Stroke[]) => void;
};

export const useStrokeHistory = ({
    strokes,
    setStrokes,
    redoStack,
    setRedoStack,
    flushSave
}: StrokeHistoryProps) => {
    const addStroke = useCallback((newStroke: Stroke) => {
        setStrokes(prev => [...prev, newStroke]);
        setRedoStack([]);
    }, [setStrokes, setRedoStack]);

    const undo = useCallback(() => {
        const currentUserId = getCurrentUserId();
        if (!currentUserId || strokes.length === 0) return;

        const idx = [...strokes].reverse().findIndex(s => s.userId === currentUserId);
        if (idx === -1) return;

        const indexFromEnd = strokes.length - 1 - idx;
        const updatedStrokes = [...strokes];
        const [removedStroke] = updatedStrokes.splice(indexFromEnd, 1);

        setStrokes(updatedStrokes);
        setRedoStack([removedStroke, ...redoStack]);
        flushSave(updatedStrokes);
        sendAllStrokes(updatedStrokes);
    }, [strokes, redoStack, setRedoStack, setStrokes, flushSave]);

    const redo = useCallback(() => {
        const currentUserId = getCurrentUserId();
        if (!currentUserId || redoStack.length === 0) return;

        const idx = redoStack.findIndex(s => s.userId === currentUserId);
        if (idx === -1) return;

        const updatedRedo = [...redoStack];
        const [strokeToRestore] = updatedRedo.splice(idx, 1);
        const updatedStrokes = [...strokes, strokeToRestore];

        setRedoStack(updatedRedo);
        setStrokes(updatedStrokes);
        flushSave(updatedStrokes);
        sendAllStrokes(updatedStrokes);
    }, [redoStack, strokes, setRedoStack, setStrokes, flushSave]);

    const clear = useCallback(() => {
        const currentUserId = getCurrentUserId();
        if (!currentUserId) return;

        setStrokes(prev => {
            const updated = prev.filter(s => s.userId !== currentUserId);
            flushSave(updated);
            sendAllStrokes(updated);
            return updated;
        });

        setRedoStack(prev => prev.filter(s => s.userId !== currentUserId));
    }, [setStrokes, setRedoStack, flushSave]);

    return {
        addStroke,
        undo,
        redo,
        clear
    };
};
