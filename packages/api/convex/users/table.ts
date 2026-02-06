import { userSchema } from "@sbkl-turborepo/schemas/users";
import { ZTable } from "../lib/schemaHelpers";

export const Users = ZTable("users", userSchema);
