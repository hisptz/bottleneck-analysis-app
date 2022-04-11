export function dateTimeDisplay(str: string | number | Date) {
  return new Date(str).toLocaleString("en-GB");
}

export function isCustomFunctionId(id: string) {
  return id.includes(".");
}
