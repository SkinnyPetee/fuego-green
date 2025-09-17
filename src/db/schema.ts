import {
  pgTable,
  varchar,
  timestamp,
  integer,
  uuid,
  boolean,
  pgEnum,
  text,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  accountVerified: boolean("account_verified").notNull().default(false),
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

// Define enum
export const accountTypeEnum = pgEnum("accountType", [
  "individual",
  "business",
]);

export const organizationTypeEnum = pgEnum("organizationType", [
  "corporation",
  "llc",
  "partnership",
  "sole proprietorship",
  "non-profit",
  "other",
]);

export const titleEnum = pgEnum("title", [
  "mr",
  "ms",
  "mrs",
  "dr",
  "prof",
  "other",
]);

export const contactMediumEnum = pgEnum("contactMedium", ["email", "phone"]);

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    accountType: accountTypeEnum("accountType").notNull(),
    organizationName: text("organizationName"),
    organizationType: organizationTypeEnum("organizationType"),
    title: titleEnum("title").notNull(),
    firstName: text("firstName").notNull(),
    lastName: text("lastName").notNull(),
    address: text("address").notNull(),
    phoneNumber: varchar("phone_number", { length: 10 }).notNull(),
    contactMedium: contactMediumEnum("contactMedium").notNull(),
    userId: uuid("user_id")
      .notNull()
      .unique() // Ensures one-to-one relationship
      .references(() => users.id, { onDelete: "cascade" }), // Foreign key to users.id
  },
  (table) => [
    // Use array syntax instead of object
    check(
      "org_name_required_if_business",
      sql`(${table.accountType} = 'individual') OR (${table.accountType} = 'business' AND ${table.organizationName} IS NOT NULL)`,
    ),
    check(
      "org_type_required_if_business",
      sql`(${table.accountType} = 'individual') OR (${table.accountType} = 'business' AND ${table.organizationType} IS NOT NULL)`,
    ),
    check("phone_format", sql`${table.phoneNumber} ~ '^[0-9]{10}$'`),
  ],
);

// 🔹 Types for OTP table
export type Register = InferSelectModel<typeof accounts>; // row type
export type NewRegister = InferInsertModel<typeof accounts>; // insert type
