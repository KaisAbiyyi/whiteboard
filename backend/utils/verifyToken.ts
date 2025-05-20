import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config()


const publicKey = process.env.KEYCLOAK_PUBLIC_KEY!.replace(/\\n/g, '\n')

export function verifyToken(token: string) {
    return jwt.verify(token, publicKey, { algorithms: ['RS256'] })
}
