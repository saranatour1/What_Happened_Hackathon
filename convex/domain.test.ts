/// <reference types="vite/client" />

import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import { api, internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

const createTest = () => convexTest(schema, modules);
type TestContext = ReturnType<typeof createTest>;

async function seedUser(
  t: TestContext,
  username: string,
): Promise<Id<"users">> {
  return await t.mutation(internal.users.createUser, {
    provider: "password",
    providerAccountId: `test:${username}`,
    profile: { username },
  });
}

async function expectCode(promise: Promise<unknown>, code: string) {
  await expect(promise).rejects.toMatchObject({
    data: { code },
  });
}

describe("timeline domain", () => {
  test("rejects unauthenticated access", async () => {
    const t = createTest();

    await expectCode(t.query(api.users.current, {}), "UNAUTHENTICATED");
    await expectCode(
      t.query(api.events.list, { limit: 10 }),
      "UNAUTHENTICATED",
    );
    await expectCode(
      t.mutation(api.moments.create, {
        r2Key: "unauthenticated.jpg",
        contentType: "image/jpeg",
        takenAt: 1_000,
      }),
      "UNAUTHENTICATED",
    );
  });

  test("rejects an empty profile update", async () => {
    const t = createTest();
    const aliceId = await seedUser(t, "alice");
    const alice = t.withIdentity({ subject: aliceId });

    await expectCode(
      alice.mutation(api.users.updateProfile, {}),
      "EMPTY_PROFILE_UPDATE",
    );
  });

  test("lists a shared event with case-insensitive type matching", async () => {
    const t = createTest();
    const aliceId = await seedUser(t, "alice");
    const bobId = await seedUser(t, "bob");
    const alice = t.withIdentity({ subject: aliceId });
    const bob = t.withIdentity({ subject: bobId });

    const eventId = await alice.mutation(api.events.create, {
      title: "Summer trip",
      type: "tRiP",
      startsAt: 1_000,
      memberUserIds: [bobId],
    });
    const events = await bob.query(api.events.list, {
      type: "TRIP",
      limit: 10,
    });

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      _id: eventId,
      ownerUserId: aliceId,
      type: "Trip",
    });
  });

  test("allows members and rejects outsiders for event moments", async () => {
    const t = createTest();
    const aliceId = await seedUser(t, "alice");
    const bobId = await seedUser(t, "bob");
    const outsiderId = await seedUser(t, "outsider");
    const alice = t.withIdentity({ subject: aliceId });
    const bob = t.withIdentity({ subject: bobId });
    const outsider = t.withIdentity({ subject: outsiderId });

    const eventId = await alice.mutation(api.events.create, {
      title: "Shared event",
      type: "Trip",
      startsAt: 2_000,
      memberUserIds: [bobId],
    });
    const momentId = await alice.mutation(api.moments.create, {
      eventId,
      r2Key: "shared.jpg",
      contentType: "image/jpeg",
      takenAt: 2_100,
    });

    const moments = await bob.query(api.moments.listByEvent, {
      eventId,
      limit: 10,
    });
    expect(moments.map((moment) => moment._id)).toEqual([momentId]);

    await expectCode(
      outsider.query(api.moments.listByEvent, { eventId, limit: 10 }),
      "EVENT_NOT_FOUND",
    );
  });

  test("creates and lists a moment without an event", async () => {
    const t = createTest();
    const aliceId = await seedUser(t, "alice");
    const alice = t.withIdentity({ subject: aliceId });

    const momentId = await alice.mutation(api.moments.create, {
      r2Key: "unassigned.webp",
      contentType: "image/webp",
      takenAt: 3_000,
      message: "Before choosing an event",
    });
    const moments = await alice.query(api.moments.listUnassigned, {
      limit: 10,
    });

    expect(moments).toEqual([
      expect.objectContaining({
        _id: momentId,
        userId: aliceId,
        r2Key: "unassigned.webp",
      }),
    ]);
    expect(moments[0]?.eventId).toBeUndefined();
  });

  test("rejects an event ending before it starts", async () => {
    const t = createTest();
    const aliceId = await seedUser(t, "alice");
    const alice = t.withIdentity({ subject: aliceId });

    await expect(
      alice.mutation(api.events.create, {
        title: "Invalid event",
        type: "Trip",
        startsAt: 5_000,
        endsAt: 4_999,
        memberUserIds: [],
      }),
    ).rejects.toThrow("End time must be at or after the start time");

    expect(await alice.query(api.events.list, { limit: 10 })).toEqual([]);
  });
});
