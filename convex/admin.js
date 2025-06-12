import { internalAction, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

function hoursAgo(hours = 1) {
  var currentDate = new Date();
  return currentDate.getTime() - hours * 60 * 60 * 1000;
}

export const getDeadGames = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("games")
      .filter((q) => {
        return q.or(
          // Games never created
          q.and(
            q.eq(q.field("players"), undefined),
            q.lt(q.field("_creationTime"), hoursAgo(4)),
          ),
          // Games with no updates for 60 days
          q.lt(q.field("updatedAt"), hoursAgo(1440)),
        );
      })
      .collect();
  },
});

export const deleteDeadGames = internalAction({
  args: {}, // Define any arguments if needed (none in this case)
  handler: async (ctx) => {
    const deadGames = await ctx.runQuery(internal.admin.getDeadGames);
    for (const game of deadGames) {
      await ctx.runMutation("_system:deleteDocument", { id: game._id });
    }
  },
});
