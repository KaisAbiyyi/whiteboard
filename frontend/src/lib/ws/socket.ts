import { handleIncomingMessage } from "./messageRouter";

let socket: WebSocket | null = null;

export const connectSocket = (token: string, boardId: string): WebSocket => {
    socket = new WebSocket(`ws://localhost:3001?token=${token}&boardId=${boardId}`);

    socket.onopen = () => {
        console.log('[WebSocket] connected');
    };

    socket.onclose = () => {
        console.log('[WebSocket] connection closed');
    };

    socket.onerror = (error) => {
        console.error('[WebSocket] connection error:', error);
    };

    socket.onmessage = (e) => {
        handleIncomingMessage(e.data);
    };

    return socket;
};

export const getSocket = (): WebSocket | null => socket;
