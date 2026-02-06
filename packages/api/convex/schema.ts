import { defineSchema } from "convex/server";
import { Users } from "./users/table";

export default defineSchema({
  users: Users.table.index("authId", ["authId"]),
});
