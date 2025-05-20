import { useCallback } from 'react';

type Params = {
    scale: number;
    setScale: (scale: number) => void;
    position: { x: number; y: number };
    setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
};

export const useZoomAndPan = ({
    scale,
    setScale,
    position,
    setPosition
}: Params) => {
    const MIN_SCALE = 0.2;
    const MAX_SCALE = 2;
    const SCALE_BY = 1.05;

    const handleWheel = useCallback((e: any) => {
        e.evt.preventDefault();
        const stage = e.target.getStage();
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        if (e.evt.ctrlKey) {
            const direction = e.evt.deltaY > 0 ? -1 : 1;
            let newScale = direction > 0 ? scale * SCALE_BY : scale / SCALE_BY;
            newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

            const mousePointTo = {
                x: (pointer.x - position.x) / scale,
                y: (pointer.y - position.y) / scale,
            };

            const newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };

            setScale(newScale);
            setPosition(newPos);
        } else if (e.evt.shiftKey) {
            setPosition((prev) => ({
                ...prev,
                x: prev.x - e.evt.deltaY,
            }));
        } else {
            setPosition((prev) => ({
                x: prev.x - e.evt.deltaX,
                y: prev.y - e.evt.deltaY,
            }));
        }
    }, [scale, position, setScale, setPosition]);

    const zoomIn = () => {
        const newScale = Math.min(MAX_SCALE, scale * SCALE_BY);
        setScale(newScale);
    };

    const zoomOut = () => {
        const newScale = Math.max(MIN_SCALE, scale / SCALE_BY);
        setScale(newScale);
    };

    const resetZoom = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    return {
        handleWheel,
        zoomIn,
        zoomOut,
        resetZoom,
        scale,
        scalePercentage: Math.round(scale * 100),
        isZoomInDisabled: scale >= MAX_SCALE,
        isZoomOutDisabled: scale <= MIN_SCALE
    };
};
