const query = {
  user: {
    resource: "me",
    params: {
      fields: ["id", "name", "organisationUnits[id,displayName,level]"],
    },
  },
};

export async function getUser(engine: any) {
  const { user } = await engine.query(query);

  return user;
}
