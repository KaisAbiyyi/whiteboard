import { useEffect, useState } from 'react';
import keycloak from '../lib/keycloak';
import { getSocket, sendChatMessageViaSocket } from '../lib/ws';
import { getChatMessages, sendChatMessageViaAPI, type ChatMessage } from '../services/chatService';


export const useChatMessages = (boardId: string) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        if (!boardId) return;
        getChatMessages(boardId)
            .then((msgs) => setMessages(msgs.reverse()))
            .catch(() => console.warn('[Chat] Failed to load messages'));
    }, [boardId]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const socket = getSocket();
            if (!socket) {
                console.warn('[WS Listener] No socket found');
                return;
            }

            const handleMessage = (e: MessageEvent) => {

                try {
                    const data = JSON.parse(e.data);

                    if (data.type === 'chat' && data.payload?.content && data.payload?.sentAt) {
                        const newMsg: ChatMessage = {
                            id: crypto.randomUUID(),
                            senderId: data.from,
                            content: data.payload.content,
                            sentAt: data.payload.sentAt,
                        };
                        setMessages((prev) => [...prev, newMsg]);
                    }
                } catch (err) {
                    console.error('[Chat] Invalid incoming WebSocket message', err);
                }
            };

            socket.addEventListener('message', handleMessage);
            return () => socket.removeEventListener('message', handleMessage);
        }, 300);

        return () => clearTimeout(timeout);
    }, []);
    const sendMessage = (content: string) => {
        const senderId = keycloak.tokenParsed?.sub;
        const payload = {
            boardId,
            content,
            sentAt: new Date().toISOString(),
        };

        if (getSocket()?.readyState === WebSocket.OPEN && senderId) {
            sendChatMessageViaSocket(payload);
        }

        sendChatMessageViaAPI(boardId, content)
            .catch(err => console.error('[Chat] Failed to save message to DB:', err));
    };

    return {
        messages,
        sendMessage,
    };
};
