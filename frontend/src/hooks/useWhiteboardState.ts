import { useRef, useState } from 'react';
import type { Stroke, Tool } from '../types/whiteboard';
import { useStrokeHistory } from './useStrokeHistory';
import { useAutoSave } from './useAutoSave';

export const useWhiteboardState = (boardId: string) => {
    const [tool, setTool] = useState<Tool>('brush');
    const [color, setColor] = useState('#000000');
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const [redoStack, setRedoStack] = useState<Stroke[]>([]);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const isDrawing = useRef(false);

    const { isSaving, isSaved, flushSave } = useAutoSave(boardId, strokes);
    const { addStroke, undo, redo, clear } = useStrokeHistory({
        strokes,
        setStrokes,
        redoStack,
        setRedoStack,
        flushSave
    });

    return {
        tool, setTool,
        color, setColor,
        strokeWidth, setStrokeWidth,
        scale, setScale,
        position, setPosition,
        strokes, setStrokes,
        redoStack,
        isDrawing,
        isSaving, isSaved,
        addStroke,
        undo, redo, clear,
        flushSave
    };
};
