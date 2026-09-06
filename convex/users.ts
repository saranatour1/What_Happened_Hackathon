import { internalMutation } from "./_generated/server";
import { authenticatedMutation, authenticatedQuery } from "./lib/functions";
import {
  addEventTypeArgs,
  DEFAULT_EVENT_TYPES,
  eventTypeName,
  updateProfileArgs,
  userDocument,
} from "./lib/validators";
import { ConvexError, v } from "convex/values";
import { z } from "zod";

/**
 * Create the user row for a new password account and return its id.
 */
export const createUser = internalMutation({
  args: {
    provider: v.literal("password"),
    providerAccountId: v.string(),
    profile: v.object({ username: v.string() }),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      username: args.profile.username,
      customEventTypes: [...DEFAULT_EVENT_TYPES],
    });
  },
});

export const current = authenticatedQuery({
  args: z.object({}),
  returns: userDocument,
  handler: async (ctx) => ctx.user,
});

export const updateProfile = authenticatedMutation({
  args: updateProfileArgs,
  returns: userDocument,
  handler: async (ctx, updates) => {
    await ctx.db.patch("users", ctx.userId, updates);
    return { ...ctx.user, ...updates };
  },
});

export const listEventTypes = authenticatedQuery({
  args: z.object({}),
  returns: z.array(eventTypeName),
  handler: async (ctx) => ctx.user.customEventTypes,
});

export const addEventType = authenticatedMutation({
  args: addEventTypeArgs,
  returns: z.array(eventTypeName),
  handler: async (ctx, { name }) => {
    const currentEventTypes = ctx.user.customEventTypes;
    const existing = currentEventTypes.find(
      (eventType: string) =>
        eventType.toLocaleLowerCase() === name.toLocaleLowerCase(),
    );
    if (existing !== undefined) {
      return currentEventTypes;
    }
    if (currentEventTypes.length >= 32) {
      throw new ConvexError({
        code: "EVENT_TYPE_LIMIT",
        message: "You can save up to 32 event types",
      });
    }

    const customEventTypes = [...currentEventTypes, name];
    await ctx.db.patch("users", ctx.userId, { customEventTypes });
    return customEventTypes;
  },
});
