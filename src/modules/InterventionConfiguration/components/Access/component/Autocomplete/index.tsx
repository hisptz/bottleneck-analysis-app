import { useOnlineStatus } from "@dhis2/app-runtime";
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
}) {
  const wrapper = useRef(null);
  const { offline } = useOnlineStatus();
  return (
    <>
      <div ref={wrapper}>
        <InputField
          label={label}
          loading={loading}
          placeholder={placeholder}
          onChange={() => {}}
          type={"text"}
          value={search1}
          inputWidth={inputWidth}
          helpText={offline ? "Not available offline" : ""}
        />
      </div>
      {searchResults?.length > 0 && searchResults != undefined && (
        <MenuPopup onClick={onClose} menuWidth={`210px`} menuRef={wrapper}>
          <Menu>
            {searchResults.map((result: any) => (
              <MenuItem key={result.id} label={result.displayName} value={result.id} onClick={({ value }) => onSelect(value)} />
            ))}
          </Menu>
        </MenuPopup>
      )}
    </>
  );
}
