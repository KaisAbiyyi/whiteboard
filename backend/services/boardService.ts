import { db } from '../db/client';
import { boards, boardStates } from '../db/schema';
import { desc, eq } from 'drizzle-orm';

export const getBoardsByUserId = async (userId: string) => {
    const result = await db
        .select({
            id: boards.id,
            name: boards.name,
            createdAt: boards.createdAt,
        })
        .from(boards)
        .where(eq(boards.ownerId, userId)).orderBy(desc(boards.createdAt));

    return result;
};

export const createBoardForUser = async (userId: string, name: string) => {
    const [created] = await db
        .insert(boards)
        .values({
            name,
            ownerId: userId,
        })
        .returning({ id: boards.id });

    return created.id;
};

export const updateBoardNameById = async (boardId: string, name: string) => {
    await db
        .update(boards)
        .set({ name })
        .where(eq(boards.id, boardId));
};

export const deleteBoardById = async (boardId: string) => {
    await db
        .delete(boards)
        .where(eq(boards.id, boardId));
};

export const getBoardById = async (id: string) => {
    const result = await db
        .select({
            id: boards.id,
            name: boards.name,
            createdAt: boards.createdAt,
            ownerId: boards.ownerId,
        })
        .from(boards)
        .where(eq(boards.id, id))
        .limit(1);

    return result[0] ?? null;
};

export const saveBoardState = async (boardId: string, data: unknown) => {
    await db
        .insert(boardStates)
        .values({
            boardId,
            data,
        });
};

export const getLatestBoardState = async (boardId: string) => {
    const [latest] = await db
        .select({ data: boardStates.data })
        .from(boardStates)
        .where(eq(boardStates.boardId, boardId))
        .orderBy(desc(boardStates.createdAt))
        .limit(1);

    return latest?.data ?? null;
};

export const getAllBoardStates = async (boardId: string) => {
    const results = await db
        .select({ data: boardStates.data, createdAt: boardStates.createdAt })
        .from(boardStates)
        .where(eq(boardStates.boardId, boardId))
        .orderBy(boardStates.createdAt); // ascending by default

    return results;
};