import { mutation } from "./_generated/server";

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

export const deleteDeadGames = mutation(async ({ db }) => {
  const deadGames = await getDeadGames({ db });
  deadGames.forEach(async (game) => {
    await db.delete(game._id);
  });
});
