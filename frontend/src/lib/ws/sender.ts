import { getSocket } from './socket';
import type { Stroke } from '../../types/whiteboard';
import keycloak from '../keycloak';

type CursorPayload = {
    x: number;
    y: number;
};
type ChatPayload = {
    boardId: string;
    content: string;
    sentAt?: string;
};

export const sendStroke = (payload: Stroke) => {
    const socket = getSocket();
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.warn('[WebSocket] Cannot send stroke: socket not connected');
        return;
    }

    if (!payload || !Array.isArray(payload.points) || payload.points.length === 0) {
        console.error('[WebSocket] Invalid stroke payload:', payload);
        return;
    }

    const valid = payload.points.every(p => typeof p.x === 'number' && typeof p.y === 'number');
    if (!valid) {
        console.error('[WebSocket] Stroke contains invalid points:', payload);
        return;
    }

    const message = {
        type: 'stroke',
        from: keycloak.tokenParsed?.sub || 'anonymous',
        payload: {
            ...payload,
            userId: keycloak.tokenParsed?.sub ?? 'anonymous'
        }
    };


    socket.send(JSON.stringify(message));
};

export const sendCursor = (payload: CursorPayload) => {
    const socket = getSocket();
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.warn('[WebSocket] Cannot send cursor: socket not connected');
        return;
    }

    const message = {
        type: 'cursor',
        from: keycloak.tokenParsed?.sub || 'anonymous',
        payload
    };
    socket.send(JSON.stringify(message));
};

export const sendAllStrokes = (strokes: Stroke[]) => {
    const socket = getSocket();
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.warn('[WebSocket] Cannot send full strokes: socket not connected');
        return;
    }

    const message = {
        type: 'sync',
        from: keycloak.tokenParsed?.sub || 'anonymous',
        payload: strokes
    };


    socket.send(JSON.stringify(message));
};


export const sendChatMessageViaSocket = (payload: ChatPayload) => {
    const socket = getSocket();
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.warn('[WebSocket] Cannot send chat message: socket not connected');
        return;
    }

    if (!payload.boardId || !payload.content.trim()) {
        console.error('[WebSocket] Invalid chat payload:', payload);
        return;
    }

    const message = {
        type: 'chat',
        from: keycloak.tokenParsed?.sub || 'anonymous',
        payload: {
            ...payload,
            sentAt: payload.sentAt ?? new Date().toISOString()
        }
    };
    socket.send(JSON.stringify(message));
};
