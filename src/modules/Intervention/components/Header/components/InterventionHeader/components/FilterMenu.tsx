import i18n from "@dhis2/d2-i18n";
import { FlyoutMenu, IconClock24, IconDimensionOrgUnit16, MenuItem } from "@dhis2/ui";
import React from "react";

export default function FilterMenu({
  onClose,
  onPeriodSelect,
  onOrgUnitSelect,
}: {
  onClose: () => void;
  onPeriodSelect: () => void;
  onOrgUnitSelect: () => void;
}): React.ReactElement {
  return (
    <>
      <FlyoutMenu>
        <MenuItem
          onClick={() => {
            onPeriodSelect();
            onClose();
          }}
          icon={<IconClock24 />}
          label={i18n.t("Period")}
        />
        <MenuItem
          onClick={() => {
            onOrgUnitSelect();
            onClose();
          }}
          icon={<IconDimensionOrgUnit16 />}
          label={i18n.t("Organisation Unit")}
        />
      </FlyoutMenu>
    </>
  );
}
