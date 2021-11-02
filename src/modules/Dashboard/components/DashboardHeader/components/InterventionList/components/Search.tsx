import i18n from "@dhis2/d2-i18n";
import { Input } from "@dhis2/ui";
import React from "react";

export default function Search() {
  return (
    <div style={{ minWidth: 240 }}>
      <Input placeholder={i18n.t("Search")} name="intervention-search" />
    </div>
  );
}
