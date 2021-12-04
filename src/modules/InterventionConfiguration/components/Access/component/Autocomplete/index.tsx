import { useOnlineStatus } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { FlyoutMenu, InputField, MenuItem } from "@dhis2/ui";
import React, { useRef } from "react";
import classes from "../../AccessConfiguration.module.css";
import MenuPopup from "../Menu-Popup";

export default function AutoComplete({
  inputWidth,
  label,
  loading,
  onSearch,
  onClose,
  placeholder,
  onSelect,
  search1,
  searchResults = [],
  showResults,
}: {
  inputWidth: string;
  label: string;
  loading: boolean;
  onSearch: any;
  onClose: any;
  placeholder: string;
  onSelect: any;
  search1: string;
  searchResults: any[];
  showResults?: boolean;
}): React.ReactElement {
  const wrapper = useRef(null);
  const { offline } = useOnlineStatus();
  return (
    <>
      <div ref={wrapper}>
        <InputField
          label={label}
          loading={loading}
          placeholder={placeholder}
          onChange={({ value }: { value: any }) => onSearch(value)}
          type="text"
          fullWidth
          value={search1}
          helpText={offline ? i18n.t("Not available offline") : ""}
        />
      </div>
      {showResults && searchResults?.length > 0 && searchResults != undefined && (
        <MenuPopup onClose={onClose} menuRef={wrapper}>
          <FlyoutMenu className={classes["search-menu"]} maxHeight={"400px"}>
            {searchResults.map((result: any) => (
              <MenuItem fullWidth key={result.id} label={result.displayName} value={result.id} onClick={({ value }: { value: any }) => onSelect(value)} />
            ))}
          </FlyoutMenu>
        </MenuPopup>
      )}
    </>
  );
}
