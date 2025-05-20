import { WebSocketServer, WebSocket } from 'ws';
import { verifyToken } from '../utils/verifyToken';

interface AuthedWebSocket extends WebSocket {
    userId: string;
    boardId: string;
}

const wss = new WebSocketServer({ port: 3001 });
const boards: Record<string, Set<AuthedWebSocket>> = {};

const broadcastToBoard = (
    boardId: string,
    message: Record<string, any>,
    excludeSocket?: AuthedWebSocket
) => {
    const clients = boards[boardId];
    if (!clients) return;

    const data = JSON.stringify(message);
    clients.forEach(client => {
        if (client.readyState === client.OPEN && client !== excludeSocket) {
            client.send(data);
        }
    });
};

wss.on('connection', (socket, req) => {
    const ws = socket as AuthedWebSocket;

    const url = new URL(req.url!, `ws://${req.headers.host}`);
    const token = url.searchParams.get('token');
    const boardId = url.searchParams.get('boardId');
    if (!token || !boardId) return ws.close();

    try {
        const payload = verifyToken(token);
        ws.userId = payload.sub as string;
        ws.boardId = boardId;

        if (!boards[boardId]) boards[boardId] = new Set();
        boards[boardId].add(ws);

        ws.send(JSON.stringify({ type: 'connected', userId: ws.userId }));

        ws.on('message', (msg) => {
            try {
                const { type, payload } = JSON.parse(msg.toString());

                const broadcastTypes = ['stroke', 'cursor', 'sync', 'chat'];

                if (broadcastTypes.includes(type)) {
                    broadcastToBoard(ws.boardId, {
                        type,
                        from: ws.userId,
                        payload
                    });
                } else {
                    console.warn('[WebSocket] Unknown message type:', type);
                }
            } catch (err) {
                console.error('[WebSocket] Failed to process message:', err);
            }
        });

        ws.on('close', () => {
            boards[boardId]?.delete(ws);
        });

    } catch (err) {
        console.warn('[WebSocket] Invalid token');
        ws.close();
    }
});
