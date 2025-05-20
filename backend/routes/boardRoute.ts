import { RequestHandler, Router } from 'express';
import { z } from 'zod';
import {
    createBoardForUser,
    deleteBoardById,
    getAllBoardStates,
    getBoardById,
    getBoardsByUserId,
    getLatestBoardState,
    saveBoardState,
    updateBoardNameById
} from '../services/boardService';
import { verifyToken } from '../utils/verifyToken';

const router = Router();
export type Point = { x: number; y: number };
export type Stroke = {
    points: Point[];
    color: string;
    width: number;
    userId: string;
};

const getBoardsHandler: RequestHandler = async (req, res) => {
    try {
        const auth = req.headers.authorization;
        if (!auth?.startsWith('Bearer ')) {
            console.warn('[GET BOARDS] Missing or malformed token');
            res.status(401).send('No token');
            return;
        }

        const token = auth.split(' ')[1];
        const payload = verifyToken(token) as any;

        const boards = await getBoardsByUserId(payload.sub);
        res.status(200).json({ boards });
        return;
    } catch (err) {
        console.error('[GET BOARDS] Error:', err);
        res.status(400).json({ error: 'Failed to retrieve boards' });
        return;
    }
};

const createBoardHandler: RequestHandler = async (req, res) => {
    try {
        const auth = req.headers.authorization;
        if (!auth?.startsWith('Bearer ')) {
            console.warn('[CREATE BOARD] Missing or malformed token');
            res.status(401).send('No token');
            return;
        }

        const token = auth.split(' ')[1];
        const payload = verifyToken(token) as any;

        const body = z.object({
            name: z.string().min(1).max(100),
        }).parse(req.body);

        const id = await createBoardForUser(payload.sub, body.name);
        res.status(201).json({ id });
        return;
    } catch (err) {
        console.error('[CREATE BOARD] Error:', err);
        res.status(400).json({ error: 'Failed to create board' });
        return;
    }
};

const updateBoardHandler: RequestHandler = async (req, res) => {
    try {
        const auth = req.headers.authorization;
        if (!auth?.startsWith('Bearer ')) {
            console.warn('[UPDATE BOARD] Missing or malformed token');
            res.status(401).send('No token');
            return;
        }

        const token = auth.split(' ')[1];
        verifyToken(token);

        const params = z.object({
            id: z.string().uuid(),
        }).parse(req.params);

        const body = z.object({
            name: z.string().min(1).max(100),
        }).parse(req.body);

        await updateBoardNameById(params.id, body.name);
        res.status(200).json({ message: 'Board updated' });
        return;
    } catch (err) {
        console.error('[UPDATE BOARD] Error:', err);
        res.status(400).json({ error: 'Failed to update board' });
        return;
    }
};

const deleteBoardHandler: RequestHandler = async (req, res) => {
    try {
        const auth = req.headers.authorization;
        if (!auth?.startsWith('Bearer ')) {
            console.warn('[DELETE BOARD] Missing or malformed token');
            res.status(401).send('No token');
            return;
        }

        const token = auth.split(' ')[1];
        verifyToken(token);

        const params = z.object({
            id: z.string().uuid(),
        }).parse(req.params);

        await deleteBoardById(params.id);
        res.status(200).json({ message: 'Board deleted' });
        return;
    } catch (err) {
        console.error('[DELETE BOARD] Error:', err);
        res.status(400).json({ error: 'Failed to delete board' });
        return;
    }
};

const getBoardByIdHandler: RequestHandler = async (req, res) => {
    try {
        const auth = req.headers.authorization;
        if (!auth?.startsWith('Bearer ')) {
            console.warn('[GET BOARD BY ID] Missing or malformed token');
            res.status(401).send('No token');
            return;
        }

        const token = auth.split(' ')[1];
        verifyToken(token);
        const params = z.object({
            id: z.string().uuid(),
        }).parse(req.params);

        const board = await getBoardById(params.id);

        if (!board) {
            res.status(404).json({ error: 'Board not found' });
            return;
        }

        res.status(200).json({ board });
        return;
    } catch (err) {
        console.error('[GET BOARD BY ID] Error:', err);
        res.status(400).json({ error: 'Failed to retrieve board' });
        return;
    }
};

const getBoardStateHandler: RequestHandler = async (req, res) => {
    try {
        const auth = req.headers.authorization;
        if (!auth?.startsWith('Bearer ')) {
            console.warn('[GET BOARD STATE] Missing or malformed token');
            res.status(401).send('No token');
            return;
        }

        const token = auth.split(' ')[1];
        verifyToken(token);
        const params = z.object({
            id: z.string().uuid(),
        }).parse(req.params);

        const data = await getLatestBoardState(params.id);
        res.status(200).json({ data });
        return;
    } catch (err) {
        console.error('[GET BOARD STATE] Error:', err);
        res.status(400).json({ error: 'Failed to retrieve board state' });
        return;
    }
};
const getAllBoardStateHandler: RequestHandler = async (req, res) => {
    try {
        const auth = req.headers.authorization;
        if (!auth?.startsWith('Bearer ')) {
            console.warn('[GET BOARD STATE] Missing or malformed token');
            res.status(401).send('No token');
            return;
        }

        const token = auth.split(' ')[1];
        verifyToken(token);
        const params = z.object({
            id: z.string().uuid(),
        }).parse(req.params);

        const data = await getAllBoardStates(params.id);
        res.status(200).json({ data });
        return;
    } catch (err) {
        console.error('[GET BOARD STATE] Error:', err);
        res.status(400).json({ error: 'Failed to retrieve board state' });
        return;
    }
};

const saveBoardStateHandler: RequestHandler = async (req, res) => {
    try {
        const auth = req.headers.authorization;
        if (!auth?.startsWith('Bearer ')) {
            console.warn('[SAVE BOARD STATE] Missing or malformed token');
            res.status(401).send('No token');
            return;
        }

        const token = auth.split(' ')[1];
        const payload = verifyToken(token) as any;

        const body = z.object({
            boardId: z.string().uuid(),
            data: z.array(z.any()),
        }).parse(req.body);

        await saveBoardState(body.boardId, body.data);

        res.status(201).json({ message: 'Board state saved' });
        return;
    } catch (err) {
        console.error('[SAVE BOARD STATE] Error:', err);
        res.status(400).json({ error: 'Failed to save board state' });
        return;
    }
};



router.get('/boards', getBoardsHandler);
router.post('/boards', createBoardHandler);
router.get('/boards/:id', getBoardByIdHandler);
router.patch('/boards/:id', updateBoardHandler);
router.delete('/boards/:id', deleteBoardHandler);
router.post('/board-state', saveBoardStateHandler);
router.get('/board-state/:id', getBoardStateHandler);
router.get('/board-state/:id/all', getAllBoardStateHandler);


export default router;
