import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { useSearchParams } from 'react-router-dom';
import CanvasHUD from './CanvasHUD';
import CanvasStage from './CanvasStage';
import { useWhiteboardContext } from '../context/WhiteboardContext';
import { useDrawingHandlers } from '../hooks/useDrawingHandlers';
import { useZoomAndPan } from '../hooks/useZoomAndPan';
import { useLiveCursorSync } from '../hooks/useLiveCursorSync';
import { useSyncBoard } from '../hooks/useSyncBoard';
import { useExportHandler } from '../hooks/useExportHandler';
import { startReplay } from '../lib/replay';

const WhiteboardCanvas = () => {
  const stageRef = useRef<Konva.Stage>(null);
  const [searchParams] = useSearchParams();
  const boardId = searchParams.get('id') ?? 'default-board';

  const {
    tool, color, strokeWidth,
    strokes, setStrokes,
    addStroke,
    scale, setScale,
    position, setPosition,
    isSaving, isSaved,
    flushSave
  } = useWhiteboardContext();

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useDrawingHandlers({
    tool,
    color,
    strokeWidth,
    strokes,
    addStroke,
    setStrokes,
    flushSave
  });

  const { handleWheel } = useZoomAndPan({
    scale,
    setScale,
    position,
    setPosition
  });

  const { liveCursors, userColors } = useLiveCursorSync(stageRef);
  useSyncBoard({ boardId, setStrokes });
  useExportHandler(stageRef, boardId);

  const handleWrappedMouseMove = (e: any) => {
    const result = handleMouseMove(e);
    if (result?.pan) {
      const { dx, dy } = result.pan;
      setPosition(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
    }
  };

  const clearCanvas = () => {
    setStrokes([])
  }

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail?.strokes) return;

      startReplay(detail.strokes, addStroke, clearCanvas);
    };

    document.addEventListener('replay-canvas', handler);
    return () => document.removeEventListener('replay-canvas', handler);
  }, [addStroke, clearCanvas]);

  return (
    <>
      <CanvasHUD isSaving={isSaving} isSaved={isSaved} />
      <CanvasStage
        stageRef={stageRef}
        strokes={strokes}
        liveCursors={liveCursors}
        userColors={userColors}
        scale={scale}
        position={position}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleWrappedMouseMove}
        handleMouseUp={handleMouseUp}
        handleWheel={handleWheel}
      />
    </>
  );
};

export default WhiteboardCanvas;
