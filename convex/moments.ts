import { zid } from "convex-helpers/server/zod4";
import { z } from "zod";
import { requireEventMember } from "./lib/authorization";
import { authenticatedMutation, authenticatedQuery } from "./lib/functions";
import {
  createMomentArgs,
  listMomentsArgs,
  listUnassignedMomentsArgs,
  momentDocument,
} from "./lib/validators";

export const listByEvent = authenticatedQuery({
  args: listMomentsArgs,
  returns: z.array(momentDocument),
  handler: async (ctx, { eventId, limit }) => {
    await requireEventMember(ctx, eventId, ctx.userId);

    return await ctx.db
      .query("moments")
      .withIndex("by_eventId_and_takenAt", (q) => q.eq("eventId", eventId))
      .order("desc")
      .take(limit);
  },
});

export const listUnassigned = authenticatedQuery({
  args: listUnassignedMomentsArgs,
  returns: z.array(momentDocument),
  handler: async (ctx, { limit }) => {
    return await ctx.db
      .query("moments")
      .withIndex("by_userId_and_eventId_and_takenAt", (q) =>
        q.eq("userId", ctx.userId).eq("eventId", undefined),
      )
      .order("desc")
      .take(limit);
  },
});

export const create = authenticatedMutation({
  args: createMomentArgs,
  returns: zid("moments"),
  handler: async (ctx, args) => {
    if (args.eventId !== undefined) {
      await requireEventMember(ctx, args.eventId, ctx.userId);
    }

    return await ctx.db.insert("moments", {
      userId: ctx.userId,
      eventId: args.eventId,
      r2Key: args.r2Key,
      contentType: args.contentType,
      byteSize: args.byteSize,
      takenAt: args.takenAt,
      message: args.message,
    });
  },
});
