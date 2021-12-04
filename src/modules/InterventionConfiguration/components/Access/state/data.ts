import { selectorFamily } from "recoil";
import { EngineState } from "../../../../../core/state/dataEngine";
import { Access } from "../../../../../shared/interfaces/interventionConfig";
import { InterventionDirtySelector } from "../../../state/data";

const userGroupsQuery = {
  userGroups: {
    resource: "userGroups",
    params: ({ userGroupIds }: any) => ({
      fields: ["id", "displayName", "name"],
      filter: userGroupIds.map((id: string) => `id:eq:${id}`),
    }),
  },
};

const usersQuery = {
  users: {
    resource: "users",
    params: ({ userIds }: any) => ({
      fields: ["id", "displayName", "name"],
      filter: userIds.map((id: string) => `id:eq:${id}`),
    }),
  },
};

const UserAndUserGroupGetter = selectorFamily<any, { ids: Array<string>; type: "user" | "userGroup" }>({
  key: "userAndUserGroupGetter",
  get:
    ({ type, ids }) =>
    async ({ get }) => {
      const engine = get(EngineState);
      if (type === "user") {
        return (await engine.query(usersQuery, { variables: { userIds: ids } }))?.users;
      }
      if (type === "userGroup") {
        return (await engine.query(userGroupsQuery, { variables: { userGroupIds: ids } }))?.userGroups;
      }
      return [];
    },
});

export const UserGroupsWithAccess = selectorFamily({
  key: "user-groups-getter",
  get:
    (id: string) =>
    async ({ get }) => {
      const access: Array<Access> = get(InterventionDirtySelector({ id, path: ["userGroupAccess"] }));
      const userGroupIds = access.map((access: any) => access.id);
      const userGroups = await get(UserAndUserGroupGetter({ ids: userGroupIds, type: "userGroup" }));
      return userGroups.userGroups?.map((userGroup: any) => ({
        ...userGroup,
        access: access.find((access: any) => access.id === userGroup.id)?.access,
      }));
    },
});

export const UsersWithAccess = selectorFamily({
  key: "user-getter",
  get:
    (id: string) =>
    async ({ get }) => {
      const access: Array<Access> = get(InterventionDirtySelector({ id, path: ["userAccess"] }));
      const userIds = access.map((access: any) => access.id);
      const users = await get(UserAndUserGroupGetter({ ids: userIds, type: "user" }));
      return users.users?.map((user: any) => ({
        ...user,
        access: access.find((access: any) => access.id === user.id)?.access,
      }));
    },
});
