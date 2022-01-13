import * as _ from "lodash";

export function getOrgUnitUrls(
  userOrgUnits: any,
  pageCount: number,
  pageSize: number,
  minLevel: number,
  orgUnitFields: string[]
) {
  return _.map(
    _.range(1, pageCount + 1),
    (pageNumber) =>
      "organisationUnits.json?fields=" +
      orgUnitFields +
      "&page=" +
      pageNumber +
      "&pageSize=" +
      pageSize +
      "&order=level:asc&order=name:asc&filter=path:ilike:" +
      userOrgUnits.join(";") +
      (minLevel ? "&filter=level:le:" + minLevel : "")
  );
}
