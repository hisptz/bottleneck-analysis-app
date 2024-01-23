const orgUnitLevelQuery = {
  levels: {
    resource: "organisationUnitLevels",
    params: {
      fields: ["id", "level", "displayName"],
    },
  },
};

export async function getOrgUnitLevels(engine: any) {
  const { levels } = await engine.query(orgUnitLevelQuery);
  return levels?.organisationUnitLevels;
}
