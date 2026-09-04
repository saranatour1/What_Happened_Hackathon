import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // App users table (Auth v2). Username identity lives in the username
  // component; we mirror username here for simple UI display.
  users: defineTable({
    username: v.string(),
  }),
  numbers: defineTable({
    value: v.number(),
  }),
});
