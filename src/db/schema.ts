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
    accountType: accountTypeEnum("account_type").notNull(),
    organizationName: text("organization_name"),
    organizationType: organizationTypeEnum("organization_type"),
    title: titleEnum("title").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    address: text("address").notNull(),
    phoneNumber: varchar("phone_number", { length: 10 }).notNull().unique(),
    contactMedium: contactMediumEnum("contact_medium").notNull(),
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

export const businessSizeEnum = pgEnum("businessSize", [
  "small",
  "medium",
  "large",
  "enterprise",
]);

export const businesses = pgTable(
  "businesses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessName: text("business_name").notNull(),
    pan: varchar("pan", { length: 10 }).notNull(),
    phone: varchar("phone", { length: 10 }).notNull(),
    businessEmail: varchar("email", { length: 255 }).notNull(),
    registrationNumber: text("registration_number").notNull(),
    businessAddress: text("business_address").notNull(),
    businessSize: businessSizeEnum("business_size").notNull(),
    tan: varchar("tan", { length: 10 }).notNull(),
    gstin: varchar("gstin", { length: 15 }).notNull(),
    primary: boolean("primary").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
  },
  (table) => [
    // Add CHECK constraint for minimum length
    check("business_name_min_length", sql`length(${table.businessName}) >= 2`),
    check("pan_length", sql`length(${table.pan}) = 10`),
    check("phone_length", sql`length(${table.pan}) = 10`),
    check(
      "business_address_min_length",
      sql`length(${table.businessAddress}) >= 2`,
    ),
    check("tan_length", sql`length(${table.tan}) = 10`),
    check("gstin_length", sql`length(${table.gstin}) = 15`),
  ],
);

export type Businesseses = InferSelectModel<typeof businesses>; // row type
export type NewBusinesses = InferInsertModel<typeof businesses>; // insert type
