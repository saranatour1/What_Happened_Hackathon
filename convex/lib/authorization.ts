import { ConvexError } from "convex/values";
import type { Id } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";

export async function requireEventMember(
  ctx: Pick<QueryCtx, "db">,
  eventId: Id<"events">,
  userId: Id<"users">,
) {
  const membership = await ctx.db
    .query("eventMembers")
    .withIndex("by_eventId_and_userId", (q) =>
      q.eq("eventId", eventId).eq("userId", userId),
    )
    .unique();
  if (membership === null) {
    throw new ConvexError({
      code: "EVENT_NOT_FOUND",
      message: "The event was not found",
    });
  }

  const event = await ctx.db.get("events", eventId);
  if (event === null) {
    throw new ConvexError({
      code: "EVENT_NOT_FOUND",
      message: "The event was not found",
    });
  }

  return { event, membership };
}
