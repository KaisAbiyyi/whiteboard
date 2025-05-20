import { RequestHandler, Router } from 'express'
import { z } from 'zod'
import { syncUser } from '../services/userService'
import { verifyToken } from '../utils/verifyToken'

const router = Router()

const syncUserHandler: RequestHandler = async (req, res) => {
    try {

        const auth = req.headers.authorization

        if (!auth?.startsWith('Bearer ')) {
            console.warn('[SYNC] Missing or malformed token')
            res.status(401).send('No token')
            return
        }

        const token = auth.split(' ')[1]
        const payload = verifyToken(token) as any


        const body = z.object({
            id: z.string(),
            name: z.string(),
            email: z.string().email(),
        }).parse(req.body)


        if (body.id !== payload.sub) {
            res.status(403).send('Invalid token-user match')
            return
        }

        await syncUser(body)

        res.status(200).send({ status: 'ok' })
    } catch (err) {
        res.status(400).json({ error: 'Invalid request', detail: err })
    }
}

router.post('/sync-user', syncUserHandler)

export default router
