import i18n from "@dhis2/d2-i18n";

export default function errorHandler(error: any): string {
  if (error) {
    const { message, details } = error ?? {};
    if (details) {
      const { httpStatusCode } = details ?? {};
      switch (httpStatusCode) {
        case 404:
          return i18n.t("This resource was not found in the server");
        default:
          return i18n.t("There is a problem with the server");
      }
    }
    if (message) {
      if (message.includes("dx")) {
        return i18n.t("There are no indicators configured for this intervention");
      }
    }
  }
  return "";
}
