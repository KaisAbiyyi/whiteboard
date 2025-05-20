import { useRef, useCallback } from 'react';
import type Konva from 'konva';
import type { Stroke } from '../types/whiteboard';
import keycloak from '../lib/keycloak';
import { sendStroke } from '../lib/ws';

type Point = { x: number; y: number };

type Params = {
    tool: string;
    color: string;
    strokeWidth: number;
    strokes: Stroke[];
    addStroke: (stroke: Stroke) => void;
    setStrokes: React.Dispatch<React.SetStateAction<Stroke[]>>;
    flushSave: (snapshot?: Stroke[]) => void;
};

export const useDrawingHandlers = ({
    tool,
    color,
    strokeWidth,
    strokes,
    addStroke,
    setStrokes,
    flushSave
}: Params) => {
    const isMiddleDragging = useRef(false);
    const lastDragPos = useRef<Point | null>(null);
    const isDrawing = useRef(false);
    const currentStrokeRef = useRef<number | null>(null);
    const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
        if (e.evt.button === 1) {
            isMiddleDragging.current = true;
            lastDragPos.current = { x: e.evt.clientX, y: e.evt.clientY };
            return;
        }

        const pos = e.target.getStage()?.getRelativePointerPosition();
        if (!pos || tool !== 'brush') return;

        isDrawing.current = true;
        addStroke({
            points: [pos],
            color,
            width: strokeWidth,
            userId: keycloak.tokenParsed?.sub ?? 'unknown',
        });

        currentStrokeRef.current = strokes.length;

        if (saveTimeout.current) {
            clearTimeout(saveTimeout.current);
            saveTimeout.current = null;
        }
    }, [tool, color, strokeWidth, strokes.length, addStroke]);

    const handleMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
        if (isMiddleDragging.current && lastDragPos.current) {
            const dx = e.evt.clientX - lastDragPos.current.x;
            const dy = e.evt.clientY - lastDragPos.current.y;

            lastDragPos.current = { x: e.evt.clientX, y: e.evt.clientY };
            return { pan: { dx, dy } };
        }

        if (!isDrawing.current) return null;

        const pos = e.target.getStage()?.getRelativePointerPosition();
        if (!pos) return null;

        setStrokes(prev => {
            if (prev.length === 0) return prev;

            const last = prev[prev.length - 1];
            const updatedLast = {
                ...last,
                points: [...last.points, pos],
            };

            return [...prev.slice(0, -1), updatedLast];
        });

        return null;
    }, [setStrokes]);

    const handleMouseUp = useCallback(() => {
        if (isDrawing.current && currentStrokeRef.current !== null) {
            const completedStroke = strokes[strokes.length - 1];
            if (completedStroke) {
                sendStroke(completedStroke);
            }

            flushSave([...strokes]);
            currentStrokeRef.current = null;
        }

        isDrawing.current = false;
        isMiddleDragging.current = false;
        lastDragPos.current = null;
    }, [strokes, flushSave]);

    return {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        isMiddleDragging,
    };
};
