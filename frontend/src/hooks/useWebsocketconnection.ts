import { useEffect, useState } from 'react';
import keycloak from '../lib/keycloak';
import { isValidStroke } from '../lib/validators';
import type { Stroke } from '../types/whiteboard';
import { connectSocket, getSocket, onStrokeReceived } from '../lib/ws';

export const useWebSocketConnection = (
    boardId: string,
    onValidStroke: (stroke: Stroke) => void
) => {
    const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

    useEffect(() => {
        if (!keycloak.authenticated || !keycloak.tokenParsed?.sub || !keycloak.token) {
            console.warn('[WebSocketHook] User not authenticated, skipping WebSocket connection');
            return;
        }

        let socketCleanup: WebSocket | null = null;

        const connect = async () => {
            try {
                await keycloak.updateToken(30);
                const token = keycloak.token!;
                socketCleanup = connectSocket(token, boardId);
                setStatus('connected');

                const socket = getSocket();
                socket?.addEventListener('close', () => setStatus('error'));
                socket?.addEventListener('error', () => setStatus('error'));

                onStrokeReceived((from, payload) => {
                    if (from === keycloak.tokenParsed?.sub) return;
                    if (!isValidStroke(payload)) {
                        console.warn('[WebSocketHook] Invalid stroke from', from, payload);
                        return;
                    }
                    onValidStroke(payload);
                });
            } catch (err) {
                console.error('[WebSocketHook] Token update or connection failed:', err);
                setStatus('error');
            }
        };

        connect();

        return () => {
            socketCleanup?.close();
        };
    }, [boardId, onValidStroke]);

    return { status };
};
