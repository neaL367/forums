import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";
import { createAccessControl } from "better-auth/plugins/access";

/**
 * make sure to use `as const` so typescript can infer the type correctly
 */
const statement = {
    ...defaultStatements,
    posts: ["create", "read", "update", "delete", "share", "update:own", "delete:own"],
} as const;

export const ac = createAccessControl(statement);

export const roles = {
    MEMBERS: ac.newRole({
        posts: [],
    }),

    ADMINISTRATOR: ac.newRole({
        posts: [],
        ...adminAc.statements,
    }),

    MODERATOR: ac.newRole({
        posts: [],
    }),

    OWNER: ac.newRole({
        posts: [],
    }),

    STAFF: ac.newRole({
        posts: [],
    }),

   GUEST: ac.newRole({
        posts: [],
    }),
};