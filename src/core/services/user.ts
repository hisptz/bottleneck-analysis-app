import { User } from "../../shared/interfaces/user";

const query = {
  user: {
    resource: "me",
    params: {
      fields: ["id", "name", "organisationUnits[id,displayName,level,path]"],
    },
  },
};

export async function getUser(engine: any): Promise<User> {
  const { user } = await engine.query(query);
  return user as unknown as User;
}
