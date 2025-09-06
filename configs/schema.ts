import { integer, pgTable, varchar, json } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
});

export const HistoryTable = pgTable("historyTable", {
  recordId: varchar().notNull().primaryKey(),
  content: json(),
  userEmail: varchar("user_email"),   
  aiAgentType: varchar(),
  createdAt: varchar(),
  metaData:varchar()
});
