import { db } from '../db/client'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'

export async function syncUser(user: { id: string, name: string, email: string }) {
    const found = await db.select().from(users).where(eq(users.id, user.id)).limit(1)

    if (found.length === 0) {
        await db.insert(users).values({
            id: user.id,
            name: user.name,
            email: user.email,
        })
    }
}
