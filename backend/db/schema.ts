import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    jsonb,
    text,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: uuid('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 150 }).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow(),
})

export const boards = pgTable('boards', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
})

export const boardUsers = pgTable('board_users', {
    id: uuid('id').primaryKey().defaultRandom(),
    boardId: uuid('board_id').references(() => boards.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 20 }).default('editor'),
})

export const boardStates = pgTable('board_states', {
    id: uuid('id').primaryKey().defaultRandom(),
    boardId: uuid('board_id').references(() => boards.id, { onDelete: 'cascade' }),
    data: jsonb('data').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
})

export const chatMessages = pgTable('chat_messages', {
    id: uuid('id').primaryKey().defaultRandom(),
    boardId: uuid('board_id').references(() => boards.id, { onDelete: 'cascade' }),
    senderId: uuid('sender_id').references(() => users.id),
    content: text('content').notNull(),
    sentAt: timestamp('sent_at').defaultNow(),
})
