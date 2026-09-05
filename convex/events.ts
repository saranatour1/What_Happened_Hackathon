import { zid } from "convex-helpers/server/zod4";
import { ConvexError } from "convex/values";
import { z } from "zod";
import type { Doc } from "./_generated/dataModel";
import { requireEventMember } from "./lib/authorization";
import { authenticatedMutation, authenticatedQuery } from "./lib/functions";
import {
  addEventMemberArgs,
  createEventArgs,
  eventDocument,
  listEventMembersArgs,
  listEventsArgs,
  MAX_EVENT_MEMBERS,
  userSummary,
} from "./lib/validators";

export const list = authenticatedQuery({
  args: listEventsArgs,
  returns: z.array(eventDocument),
  handler: async (ctx, { type, limit }) => {
    const memberships =
      type === undefined
        ? await ctx.db
            .query("eventMembers")
            .withIndex("by_userId_and_eventStartsAt", (q) =>
              q.eq("userId", ctx.userId),
            )
            .order("desc")
            .take(limit)
        : await ctx.db
            .query("eventMembers")
            .withIndex("by_userId_and_eventType_and_eventStartsAt", (q) =>
              q.eq("userId", ctx.userId).eq("eventType", type),
            )
            .order("desc")
            .take(limit);

    const events = await Promise.all(
      memberships.map(({ eventId }) => ctx.db.get("events", eventId)),
    );
    return events.filter((event): event is Doc<"events"> => event !== null);
  },
});

export const listMembers = authenticatedQuery({
  args: listEventMembersArgs,
  returns: z.array(userSummary),
  handler: async (ctx, { eventId, limit }) => {
    await requireEventMember(ctx, eventId, ctx.userId);
    const memberships = await ctx.db
      .query("eventMembers")
      .withIndex("by_eventId_and_userId", (q) => q.eq("eventId", eventId))
      .take(limit);
    const users = await Promise.all(
      memberships.map(({ userId }) => ctx.db.get("users", userId)),
    );
    return users
      .filter((user): user is Doc<"users"> => user !== null)
      .map((user) => ({
        _id: user._id,
        username: user.username,
        ...(user.name === undefined ? {} : { name: user.name }),
        ...(user.image === undefined ? {} : { image: user.image }),
      }));
  },
});

export const create = authenticatedMutation({
  args: createEventArgs,
  returns: zid("events"),
  handler: async (ctx, args) => {
    const canonicalType = ctx.user.customEventTypes.find(
      (eventType: string) =>
        eventType.toLocaleLowerCase() === args.type.toLocaleLowerCase(),
    );
    if (canonicalType === undefined) {
      throw new ConvexError({
        code: "INVALID_EVENT_TYPE",
        message: `"${args.type}" is not one of your event types`,
      });
    }

    if (args.parentEventId !== undefined) {
      const { event: parent } = await requireEventMember(
        ctx,
        args.parentEventId,
        ctx.userId,
      );
      if (parent.parentEventId !== undefined) {
        throw new ConvexError({
          code: "NESTING_LIMIT",
          message: "Events can only be nested one level deep",
        });
      }
    }

    const memberUserIds = [
      ...new Set(args.memberUserIds.filter((userId) => userId !== ctx.userId)),
    ];
    const members = await Promise.all(
      memberUserIds.map((userId) => ctx.db.get("users", userId)),
    );
    if (members.some((member) => member === null)) {
      throw new ConvexError({
        code: "MEMBER_NOT_FOUND",
        message: "One or more selected users were not found",
      });
    }

    const eventId = await ctx.db.insert("events", {
      ownerUserId: ctx.userId,
      title: args.title,
      type: canonicalType,
      parentEventId: args.parentEventId,
      startsAt: args.startsAt,
      endsAt: args.endsAt,
      timezone: args.timezone,
      notes: args.notes,
    });
    await ctx.db.insert("eventMembers", {
      eventId,
      userId: ctx.userId,
      addedByUserId: ctx.userId,
      role: "owner",
      eventStartsAt: args.startsAt,
      eventType: canonicalType,
    });
    for (const userId of memberUserIds) {
      await ctx.db.insert("eventMembers", {
        eventId,
        userId,
        addedByUserId: ctx.userId,
        role: "member",
        eventStartsAt: args.startsAt,
        eventType: canonicalType,
      });
    }
    return eventId;
  },
});

export const addMember = authenticatedMutation({
  args: addEventMemberArgs,
  returns: zid("eventMembers"),
  handler: async (ctx, { eventId, userId }) => {
    const event = await ctx.db.get("events", eventId);
    if (event === null || event.ownerUserId !== ctx.userId) {
      throw new ConvexError({
        code: "EVENT_NOT_FOUND",
        message: "The event was not found",
      });
    }

    const user = await ctx.db.get("users", userId);
    if (user === null) {
      throw new ConvexError({
        code: "MEMBER_NOT_FOUND",
        message: "The selected user was not found",
      });
    }

    const existing = await ctx.db
      .query("eventMembers")
      .withIndex("by_eventId_and_userId", (q) =>
        q.eq("eventId", eventId).eq("userId", userId),
      )
      .unique();
    if (existing !== null) {
      return existing._id;
    }

    const memberships = await ctx.db
      .query("eventMembers")
      .withIndex("by_eventId_and_userId", (q) => q.eq("eventId", eventId))
      .take(MAX_EVENT_MEMBERS);
    if (memberships.length >= MAX_EVENT_MEMBERS) {
      throw new ConvexError({
        code: "EVENT_MEMBER_LIMIT",
        message: `An event can have up to ${MAX_EVENT_MEMBERS} members`,
      });
    }

    return await ctx.db.insert("eventMembers", {
      eventId,
      userId,
      addedByUserId: ctx.userId,
      role: "member",
      eventStartsAt: event.startsAt,
      eventType: event.type,
    });
  },
});
