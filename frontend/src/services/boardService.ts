import api from '../lib/api';

export type Board = {
    id: string;
    name: string;
    createdAt: string;
};

export const getBoards = async (): Promise<Board[]> => {
    const res = await api.get('/boards');
    return res.data.boards || [];
};

export const createBoard = async (name: string): Promise<string> => {
    const res = await api.post('/boards', { name });
    return res.data.id;
};

export const getBoardById = async (id: string): Promise<Board> => {
    const res = await api.get(`/boards/${id}`);
    return res.data.board;
};


export const updateBoard = async (id: string, name: string): Promise<void> => {
    await api.patch(`/boards/${id}`, { name });
};

export const deleteBoard = async (id: string): Promise<void> => {
    await api.delete(`/boards/${id}`);
};

export const getBoardState = async (boardId: string): Promise<any[] | null> => {
    const res = await api.get(`/board-state/${boardId}`);
    return res.data.data ?? null;
};
export const getAllBoardState = async (boardId: string): Promise<any[] | null> => {
    const res = await api.get(`/board-state/${boardId}/all`);
    return res.data.data ?? null;
};

export const saveBoardState = async (boardId: string, data: unknown): Promise<void> => {
    await api.post('/board-state', {
        boardId,
        data,
    });
};

