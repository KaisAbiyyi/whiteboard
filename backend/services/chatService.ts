import { db } from '../db/client';
import { chatMessages } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

export const saveChatMessage = async (boardId: string, senderId: string, content: string) => {
    await db.insert(chatMessages).values({
        boardId,
        senderId,
        content,
    });
};

export const getChatMessagesByBoardId = async (boardId: string) => {
    const result = await db
        .select({
            id: chatMessages.id,
            content: chatMessages.content,
            senderId: chatMessages.senderId,
            sentAt: chatMessages.sentAt,
        })
        .from(chatMessages)
        .where(eq(chatMessages.boardId, boardId))
        .orderBy(desc(chatMessages.sentAt));

    return result;
};
