import { defineSchema, defineTable } from "convex/server";
import { zodToConvexFields } from "convex-helpers/server/zod4";
import {
  eventFields,
  eventMemberFields,
  momentFields,
  userFields,
} from "./lib/validators";

export default defineSchema({
  // Auth v2 uses this document's _id as the authenticated app user ID.
  users: defineTable(zodToConvexFields(userFields)).index("by_username", [
    "username",
  ]),
  events: defineTable(zodToConvexFields(eventFields))
    .index("by_ownerUserId_and_startsAt", ["ownerUserId", "startsAt"])
    .index("by_ownerUserId_and_type_and_startsAt", [
      "ownerUserId",
      "type",
      "startsAt",
    ])
    .index("by_parentEventId_and_startsAt", ["parentEventId", "startsAt"]),
  eventMembers: defineTable(zodToConvexFields(eventMemberFields))
    .index("by_eventId_and_userId", ["eventId", "userId"])
    .index("by_userId_and_eventStartsAt", ["userId", "eventStartsAt"])
    .index("by_userId_and_eventType_and_eventStartsAt", [
      "userId",
      "eventType",
      "eventStartsAt",
    ]),
  moments: defineTable(zodToConvexFields(momentFields))
    .index("by_eventId_and_takenAt", ["eventId", "takenAt"])
    .index("by_userId_and_takenAt", ["userId", "takenAt"])
    .index("by_userId_and_eventId_and_takenAt", [
      "userId",
      "eventId",
      "takenAt",
    ]),
});
