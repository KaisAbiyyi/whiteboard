import type { Stroke } from '../../types/whiteboard';

type CursorPayload = {
    x: number;
    y: number;
};

type ChatPayload = {
    boardId: string;
    content: string;
    sentAt?: string;
};

type StrokeHandler = (from: string, payload: Stroke) => void;
type CursorHandler = (from: string, payload: CursorPayload) => void;
type SyncHandler = (from: string, payload: Stroke[]) => void;
type ChatHandler = (from: string, payload: ChatPayload) => void;

let strokeHandler: StrokeHandler | null = null;
let cursorHandler: CursorHandler | null = null;
let syncHandler: SyncHandler | null = null;
let chatHandler: ChatHandler | null = null;

export const onStrokeReceived = (handler: StrokeHandler) => {
    strokeHandler = handler;
};

export const onCursorReceived = (handler: CursorHandler) => {
    cursorHandler = handler;
};

export const onSyncReceived = (handler: SyncHandler) => {
    syncHandler = handler;
};

export const onChatReceived = (handler: ChatHandler) => {
    chatHandler = handler;
};

export const getRegisteredHandlers = () => ({
    strokeHandler,
    cursorHandler,
    syncHandler,
    chatHandler,
});
