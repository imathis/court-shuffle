import { cronJobs } from "convex/server";

const crons = cronJobs()

crons.daily(
  "delete dead games",
  { hourUTC: 0, minuteUTC: 0 }, // daily at midnight
  "admin:deleteDeadGames"
)

export default crons
