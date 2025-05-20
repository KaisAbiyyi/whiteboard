import { type FC } from 'react';
import { Circle, Group, Text } from 'react-konva';
import type { Point } from '../types/whiteboard';

type Props = {
    liveCursors: Record<string, Point>;
    userColors: Record<string, string>;
};

const CanvasCursorOverlay: FC<Props> = ({ liveCursors, userColors }) => {
    return (
        <>
            {Object.entries(liveCursors).map(([userId, pos]) => (
                <Group key={userId}>
                    <Circle
                        x={pos.x}
                        y={pos.y}
                        radius={5}
                        fill={userColors[userId] || 'gray'}
                    />
                    <Text
                        text={userId.slice(0, 4)}
                        x={pos.x + 8}
                        y={pos.y}
                        fontSize={12}
                        fill={userColors[userId] || 'black'}
                    />
                </Group>
            ))}
        </>
    );
};

export default CanvasCursorOverlay;
