import { Router, RequestHandler } from 'express';
import { verifyToken } from '../utils/verifyToken';
import { saveChatMessage, getChatMessagesByBoardId } from '../services/chatService';
import { z } from 'zod';

const router = Router();

const getChatMessagesHandler: RequestHandler = async (req, res) => {
    try {
        const auth = req.headers.authorization;
        if (!auth?.startsWith('Bearer ')) {
            console.warn('[GET CHAT] Missing or malformed token');
            res.status(401).send('No token');
            return;
        }

        const token = auth.split(' ')[1];
        verifyToken(token);

        const params = z.object({
            boardId: z.string().uuid(),
        }).parse(req.params);

        const messages = await getChatMessagesByBoardId(params.boardId);
        res.status(200).json({ messages });
        return;
    } catch (err) {
        console.error('[GET CHAT] Error:', err);
        res.status(400).json({ error: 'Failed to retrieve chat messages' });
        return;
    }
};

const postChatMessageHandler: RequestHandler = async (req, res) => {
    try {
        const auth = req.headers.authorization;
        if (!auth?.startsWith('Bearer ')) {
            console.warn('[POST CHAT] Missing or malformed token');
            res.status(401).send('No token');
            return;
        }

        const token = auth.split(' ')[1];
        const payload = verifyToken(token) as any;

        const body = z.object({
            boardId: z.string().uuid(),
            content: z.string().min(1).max(500),
        }).parse(req.body);

        await saveChatMessage(body.boardId, payload.sub, body.content);
        res.status(201).json({ message: 'Chat sent' });
        return;
    } catch (err) {
        console.error('[POST CHAT] Error:', err);
        res.status(400).json({ error: 'Failed to send chat message' });
        return;
    }
};

router.get('/chat/:boardId', getChatMessagesHandler);
router.post('/chat', postChatMessageHandler);

export default router;
