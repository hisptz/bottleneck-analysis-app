import { find, flattenDeep, last } from "lodash";
import { utils as xlsx, write, writeFile } from "xlsx";
import { Group } from "../interfaces/interventionConfig";

export function downloadExcelFromTable(tableRef: any, title: string) {
  const sheet = xlsx.table_to_sheet(tableRef);
  const workbook = xlsx.book_new();
  xlsx.book_append_sheet(workbook, sheet, `${title.substring(0, 31)}`); //TODO: Notify user if title is too long
  writeFile(workbook, `${title}.${"xlsx"}`);
}

export function getExcelFromTable(tableRef: any, title: string) {
  const sheet = xlsx.table_to_sheet(tableRef);
  const workbook = xlsx.book_new();
  xlsx.book_append_sheet(workbook, sheet, `${title.substring(0, 31)}`); //TODO: Notify user if title is too long
  return write(workbook, { bookType: "xlsx", type: "base64" });
}

function generateExcelJson(analytics: any, groups: Array<Group>, orgUnit: any) {
  const data = groups.map(({ items, name }) => {
    return items.map(({ label, id }) => ({
      Determinant: name,
      Indicator: label,
      [orgUnit?.displayName]: last(find(analytics.rows, [0, id])),
    }));
  });
  return flattenDeep(data) ?? [];
}

export function downloadExcelFromAnalytics({ analytics, groups, orgUnit }: { analytics: any; groups: Array<Group>; orgUnit: any }, title: string) {
  const json = generateExcelJson(analytics, groups, orgUnit);
  const sheet = xlsx.json_to_sheet(json);
  const workbook = xlsx.book_new();
  xlsx.book_append_sheet(workbook, sheet, `${title.substring(0, 31)}`); //TODO: Notify user if title is too long
  writeFile(workbook, `${title}.${"xlsx"}`);
}

export function getExcelFromAnalytics({ analytics, groups, orgUnit }: { analytics: any; groups: Array<Group>; orgUnit: any }, title: string) {
  const json = generateExcelJson(analytics, groups, orgUnit);
  const sheet = xlsx.json_to_sheet(json);
  const workbook = xlsx.book_new();
  xlsx.book_append_sheet(workbook, sheet, `${title.substring(0, 31)}`); //TODO: Notify user if title is too long
  return write(workbook, { bookType: "xlsx", type: "base64" });
}
