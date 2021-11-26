const query = {
  user: {
    resource: "me",
    params: {
      fields: ["id", "name", "organisationUnits[displayName, id]"],
    },
  },
};

export async function getUser(engine: any) {
  const { user } = await engine.query(query);

  return user;
}
