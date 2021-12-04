import { selectorFamily } from "recoil";
import { EngineState } from "../../../../../core/state/dataEngine";

const user = {
  user: {
    resource: "users",
    id: ({ id }: any) => id,
    params: () => ({
      fields: ["id", "displayName", "name"],
    }),
  },
};

const userGroup = {
  userGroup: {
    resource: "userGroups",
    id: ({ id }: any) => id,
    params: () => ({
      fields: ["id", "displayName", "name"],
    }),
  },
};

export const AccessUser = selectorFamily({
  key: "access-user",
  get:
    (userId: string) =>
    async ({ get }) => {
      const engine = get(EngineState);
      return (await engine.query(user, { variables: { id: userId } }))?.user;
    },
});

export const AccessUserGroup = selectorFamily({
  key: "access-user-group",
  get:
    (userGroupId: string) =>
    async ({ get }) => {
      const engine = get(EngineState);
      return (await engine.query(userGroup, { variables: { id: userGroupId } }))?.userGroup;
    },
});

export const AccessEntityDetails = selectorFamily({
  key: "access-entity-details",
  get:
    ({ type, id }: { type: string; id?: string }) =>
    async ({ get }) => {
      if (id) {
        if (type === "SHARE_TARGET_USER") {
          return get(AccessUser(id));
        }
        if (type === "SHARE_TARGET_GROUP") {
          return get(AccessUserGroup(id));
        }
      }
    },
});
