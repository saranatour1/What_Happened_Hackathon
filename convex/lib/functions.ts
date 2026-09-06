import { getAuthUserId } from "@convex-dev/auth/core";
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod4";
import { ConvexError } from "convex/values";
import { mutation, query, type QueryCtx } from "../_generated/server";

const requireUser = {
  args: {},
  input: async (ctx: QueryCtx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "Sign in to continue",
      });
    }
    const user = await ctx.db.get("users", userId);
    if (user === null) {
      throw new ConvexError({
        code: "USER_NOT_FOUND",
        message: "The authenticated user no longer exists",
      });
    }
    return {
      ctx: { user, userId },
      args: {},
    };
  },
};

export const authenticatedQuery = zCustomQuery(query, requireUser);
export const authenticatedMutation = zCustomMutation(mutation, requireUser);
