import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userRouter from './routes/syncUserRoute'
import boardRouter from './routes/boardRoute'
import chatRouter from './routes/chatRoute'

dotenv.config()

const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: false
}))
app.use(express.json())

app.use('/api', userRouter)
app.use('/api', boardRouter)
app.use('/api', chatRouter)

app.listen(3000, () => {
    console.log('Backend running on http://localhost:3000')
})

import './ws/server'