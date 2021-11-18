import i18n from "@dhis2/d2-i18n";
import { Input } from "@dhis2/ui";
import React from "react";
import { useRecoilState } from "recoil";
import { SearchState } from "../state/search";

export default function Search() {
  const [searchKeyword, setSearchKeyWord] = useRecoilState(SearchState);
  return (
    <div style={{ minWidth: 240 }}>
      <Input
        value={searchKeyword}
        onChange={({ value }: { name: string; value: string }) => {
          setSearchKeyWord(value);
        }}
        placeholder={i18n.t("Search")}
        name="intervention-search"
      />
    </div>
  );
}
