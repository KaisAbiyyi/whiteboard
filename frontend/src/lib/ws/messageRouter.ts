import type { Stroke } from '../../types/whiteboard';
import { getRegisteredHandlers } from './handlers';

type CursorPayload = {
    x: number;
    y: number;
};
type ChatPayload = {
    boardId: string;
    content: string;
    sentAt?: string;
};

type Message =
    | { type: 'stroke'; from: string; payload: Stroke }
    | { type: 'cursor'; from: string; payload: CursorPayload }
    | { type: 'sync'; from: string; payload: Stroke[] }
    | { type: 'chat'; from: string; payload: ChatPayload }
    | { type: 'connected'; userId: string };

export const handleIncomingMessage = (raw: string) => {
    try {
        const data: Message = JSON.parse(raw);
        const { strokeHandler, cursorHandler, syncHandler, chatHandler } = getRegisteredHandlers();
        switch (data.type) {
            case 'connected':
                break;

            case 'stroke':
                strokeHandler?.(data.from, data.payload);
                break;

            case 'cursor':
                cursorHandler?.(data.from, data.payload);
                break;

            case 'sync':
                syncHandler?.(data.from, data.payload);
                break;

            case 'chat':
                chatHandler?.(data.from, data.payload);
                break;

            default:
                console.warn('[WebSocket] Unknown message type:', (data as any).type);
        }
    } catch (error) {
        console.error('[WebSocket] Failed to parse message:', error);
    }
};
