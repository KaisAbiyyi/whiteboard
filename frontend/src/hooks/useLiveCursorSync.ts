import type Konva from 'konva';
import { useEffect, useState } from 'react';
import keycloak from '../lib/keycloak';
import { generateRandomColor } from '../lib/utils';
import { getSocket, onCursorReceived, sendCursor } from '../lib/ws';

type CursorMap = Record<string, { x: number; y: number }>;
type ColorMap = Record<string, string>;

export const useLiveCursorSync = (stageRef: React.RefObject<Konva.Stage | null>) => {
    const [liveCursors, setLiveCursors] = useState<CursorMap>({});
    const [userColors, setUserColors] = useState<ColorMap>({});

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage || !keycloak.tokenParsed?.sub) return;

        const handleMouseMove = () => {
            const socket = getSocket();
            if (!socket || socket.readyState !== WebSocket.OPEN) return;

            const pointer = stage.getRelativePointerPosition();
            if (!pointer) return;

            sendCursor({ x: pointer.x, y: pointer.y });
        };

        const container = stage.getContent();
        container.addEventListener('mousemove', handleMouseMove);

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
        };
    }, [stageRef]);

    useEffect(() => {
        onCursorReceived((from, payload) => {
            if (from === keycloak.tokenParsed?.sub) return;

            setUserColors(prev => {
                if (prev[from]) return prev;
                return {
                    ...prev,
                    [from]: generateRandomColor()
                };
            });

            setLiveCursors(prev => ({
                ...prev,
                [from]: payload
            }));
        });
    }, []);

    return {
        liveCursors,
        userColors
    };
};
