import { useOnlineStatus } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { InputField, Menu, MenuItem } from "@dhis2/ui";
import React, { useRef } from "react";
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
          value={search1}
          inputWidth={inputWidth}
          helpText={offline ? i18n.t("Not available offline") : ""}
        />
      </div>
      {searchResults?.length > 0 && searchResults != undefined && (
        <MenuPopup onClick={onClose} menuWidth={`100%`} menuRef={wrapper}>
          <Menu>
            {searchResults.map((result: any) => (
              <MenuItem key={result.id} label={result.displayName} value={result.id} onClick={({ value }: { value: any }) => onSelect(value)} />
            ))}
          </Menu>
        </MenuPopup>
      )}
    </>
  );
}
