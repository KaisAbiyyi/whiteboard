import api from '../lib/api';

export type ChatMessage = {
    id: string;
    senderId: string;
    content: string;
    sentAt: string;
};

export const getChatMessages = async (boardId: string): Promise<ChatMessage[]> => {
    const res = await api.get(`/chat/${boardId}`);
    return res.data.messages || [];
};

export const sendChatMessageViaAPI = async (boardId: string, content: string): Promise<void> => {
    await api.post('/chat', { boardId, content });
};
