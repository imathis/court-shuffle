import { cronJobs } from "convex/server";
import { internal } from "./_generated/api"; // Import the function reference

const crons = cronJobs();

crons.daily(
  "delete dead games",
  { hourUTC: 0, minuteUTC: 0 }, // daily at midnight
  internal.admin.deleteDeadGames, // Pass the function reference directly
);

export default crons;
