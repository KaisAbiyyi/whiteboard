import Konva from 'konva';
import { type FC, type RefObject } from 'react';
import { Layer, Line, Stage } from 'react-konva';
import type { Point, Stroke } from '../types/whiteboard';
import CanvasCursorOverlay from './CanvasCursorOverlay';

type CanvasStageProps = {
    stageRef: RefObject<Konva.Stage | null>;
    strokes: Stroke[];
    liveCursors: Record<string, Point>;
    userColors: Record<string, string>;
    scale: number;
    position: { x: number; y: number };
    handleMouseDown: (e: any) => void;
    handleMouseMove: (e: any) => void;
    handleMouseUp: (e: any) => void;
    handleWheel: (e: any) => void;
};

const CanvasStage: FC<CanvasStageProps> = ({
    stageRef,
    strokes,
    liveCursors,
    userColors,
    scale,
    position,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel
}) => {
    return (
        <Stage
            ref={stageRef}
            width={window.innerWidth}
            height={window.innerHeight}
            scaleX={scale}
            scaleY={scale}
            x={position.x}
            y={position.y}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
        >
            <Layer>
               <CanvasCursorOverlay liveCursors={liveCursors} userColors={userColors}/>

                {strokes.map((stroke, i) => (
                    <Line
                        key={i}
                        points={stroke.points.flatMap(p => [p.x, p.y])}
                        stroke={stroke.color}
                        strokeWidth={stroke.width}
                        lineCap="round"
                        lineJoin="round"
                    />
                ))}
            </Layer>
        </Stage>
    );
};

export default CanvasStage;
