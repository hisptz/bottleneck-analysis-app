import { find, intersectionBy, isEmpty, reduce } from "lodash";
import { InterventionAccess } from "../../shared/interfaces/access";
import { InterventionSummary } from "../../shared/interfaces/interventionConfig";
import { User } from "../../shared/interfaces/user";

const query = {
  user: {
    resource: "me",
    params: {
      fields: ["id", "name", "organisationUnits[id,displayName,level,path]", "authorities", "userGroups[id,name]"],
    },
  },
};

export async function getUser(engine: any): Promise<User> {
  const { user } = await engine.query(query);
  return user as unknown as User;
}

function translateAccess(access = ""): InterventionAccess {
  const translatedAccess = {
    read: false,
    write: false,
  };
  if (access.includes("r")) {
    translatedAccess.read = true;
  }
  if (access.includes("w")) {
    translatedAccess.write = true;
  }
  return translatedAccess;
}

export function getUserAuthority(user: User, interventionSummary?: InterventionSummary): InterventionAccess {
  if (interventionSummary) {
    const { user: interventionUser, userAccess, userGroupAccess, publicAccess } = interventionSummary ?? {};
    if (user?.id === interventionUser.id) {
      return { ...translateAccess("rw-----"), delete: true };
    }

    if (!isEmpty(userAccess)) {
      const access = find(userAccess, ["id", user?.id]);
      if (access) {
        return translateAccess(access?.access);
      }
    }

    if (!isEmpty(userGroupAccess)) {
      const userGroups = intersectionBy([...userGroupAccess], [...user.userGroups], "id");
      if (!isEmpty(userGroups)) {
        const accesses = userGroups.map(({ access }) => access);
        const translatedAccesses = accesses.map(translateAccess);

        return {
          read: reduce(translatedAccesses, (acc, value) => acc || value.read || false, false as boolean),
          write: reduce(translatedAccesses, (acc, value) => acc || value.write || false, false as boolean),
        };
      }
    }

    if (publicAccess) {
      return translateAccess(publicAccess);
    }
  }
  return {
    read: false,
    write: false,
    delete: false,
  };
}
