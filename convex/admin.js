import { internalAction } from "./_generated/server";

function hoursAgo(hours = 1) {
  var currentDate = new Date();
  return currentDate.getTime() - hours * 60 * 60 * 1000;
}

const getDeadGames = async ({ db }) => {
  return await db
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
};

export const deleteDeadGames = internalAction({
  args: {}, // Define any arguments if needed (none in this case)
  handler: async ({ db }) => {
    const deadGames = await getDeadGames({ db });
    for (const game of deadGames) {
      await db.delete(game._id);
    }
  },
});
