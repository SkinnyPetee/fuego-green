import { pgTable, unique, varchar, timestamp, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	email: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	id: uuid().defaultRandom().primaryKey().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const otps = pgTable("otps", {
	email: varchar({ length: 255 }).notNull(),
	otp: varchar({ length: 6 }).notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	sentAt: timestamp("sent_at", { mode: 'string' }).defaultNow().notNull(),
	id: uuid().defaultRandom().primaryKey().notNull(),
});
