import { withSystemFields, zid } from "convex-helpers/server/zod4";
import { z } from "zod";

export const DEFAULT_EVENT_TYPES = [
  "Trip",
  "Milestone",
  "Everyday",
  "Other",
] as const;
export const MAX_EVENT_MEMBERS = 100;

const trimmedString = (maximum: number) =>
  z.string().trim().min(1).max(maximum);

const timestamp = z.number().finite().int().nonnegative();

export const eventTypeName = trimmedString(40);

export const userFields = {
  username: trimmedString(320),
  name: trimmedString(120).optional(),
  image: z.string().trim().url().max(2_048).optional(),
  customEventTypes: z.array(eventTypeName).min(1).max(32),
};

export const eventFields = {
  ownerUserId: zid("users"),
  title: trimmedString(120),
  type: eventTypeName,
  parentEventId: zid("events").optional(),
  startsAt: timestamp,
  endsAt: timestamp.optional(),
  timezone: trimmedString(100).optional(),
  notes: z.string().trim().max(4_000).optional(),
};

export const eventMemberRole = z.enum(["owner", "member"]);

export const eventMemberFields = {
  eventId: zid("events"),
  userId: zid("users"),
  addedByUserId: zid("users"),
  role: eventMemberRole,
  eventStartsAt: timestamp,
  eventType: eventTypeName,
};

export const momentFields = {
  userId: zid("users"),
  eventId: zid("events").optional(),
  r2Key: trimmedString(1_024),
  contentType: z.enum([
    "image/gif",
    "image/heic",
    "image/heif",
    "image/jpeg",
    "image/png",
    "image/webp",
  ]),
  byteSize: z
    .number()
    .finite()
    .int()
    .positive()
    .max(25 * 1024 * 1024)
    .optional(),
  takenAt: timestamp,
  message: z.string().trim().max(2_000).optional(),
};

export const userDocument = z.object(withSystemFields("users", userFields));
export const userSummary = z.object({
  _id: zid("users"),
  username: userFields.username,
  name: userFields.name,
  image: userFields.image,
});
export const eventDocument = z
  .object(withSystemFields("events", eventFields))
  .refine(
    ({ endsAt, startsAt }) => endsAt === undefined || endsAt >= startsAt,
    {
      message: "End time must be at or after the start time",
      path: ["endsAt"],
    },
  );
export const eventMemberDocument = z.object(
  withSystemFields("eventMembers", eventMemberFields),
);
export const momentDocument = z.object(
  withSystemFields("moments", momentFields),
);

export const addEventTypeArgs = z.object({
  name: eventTypeName,
});

export const updateProfileArgs = z
  .object({
    name: userFields.name,
    image: userFields.image,
  })
  .refine(({ image, name }) => image !== undefined || name !== undefined, {
    message: "Provide a name or image to update",
  });

export const createEventArgs = z
  .object({
    title: eventFields.title,
    type: eventFields.type,
    parentEventId: eventFields.parentEventId,
    startsAt: eventFields.startsAt,
    endsAt: eventFields.endsAt,
    timezone: eventFields.timezone,
    notes: eventFields.notes,
    memberUserIds: z
      .array(zid("users"))
      .max(MAX_EVENT_MEMBERS - 1)
      .default([]),
  })
  .refine(
    ({ endsAt, startsAt }) => endsAt === undefined || endsAt >= startsAt,
    {
      message: "End time must be at or after the start time",
      path: ["endsAt"],
    },
  );

export const listEventsArgs = z.object({
  type: eventTypeName.optional(),
  limit: z.number().int().min(1).max(100).default(50),
});

export const addEventMemberArgs = z.object({
  eventId: zid("events"),
  userId: zid("users"),
});

export const listEventMembersArgs = z.object({
  eventId: zid("events"),
  limit: z.number().int().min(1).max(100).default(50),
});

export const createMomentArgs = z.object({
  eventId: momentFields.eventId,
  r2Key: momentFields.r2Key,
  contentType: momentFields.contentType,
  byteSize: momentFields.byteSize,
  takenAt: momentFields.takenAt,
  message: momentFields.message,
});

export const listMomentsArgs = z.object({
  eventId: zid("events"),
  limit: z.number().int().min(1).max(100).default(50),
});

export const listUnassignedMomentsArgs = z.object({
  limit: z.number().int().min(1).max(100).default(50),
});
