export function isOrgUnitId(id: string) {
  return !id.match(/(LEVEL-)|(USER_)|(OU_GROUP-)\w+/);
}
