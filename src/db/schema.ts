import {
  pgTable,
  varchar,
  timestamp,
  integer,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`),
});

// 🔹 Types from Drizzle
export type User = InferSelectModel<typeof users>; // row type
export type NewUser = InferInsertModel<typeof users>; // insert type

export const otps = pgTable("otps", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull(),
  otp: varchar("otp", { length: 6 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  attempts: integer("attempts").default(0).notNull(), // Add this
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 🔹 Types for OTP table
export type Otp = InferSelectModel<typeof otps>; // row type
export type NewOtp = InferInsertModel<typeof otps>; // insert type
