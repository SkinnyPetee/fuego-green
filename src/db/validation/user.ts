import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "../schema";
import { z } from "zod";

// Auto-generate schemas with extra Zod validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.email("Invalid email address")                              
});

export const selectUserSchema = createSelectSchema(users);

// TS types inferred from Zod
export type InsertUserInput = z.infer<typeof insertUserSchema>;
export type SelectUserOutput = z.infer<typeof selectUserSchema>;

// Update schema (all optional)
export const updateUserSchema = insertUserSchema.partial();
