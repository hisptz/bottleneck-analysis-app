import i18n from "@dhis2/d2-i18n";
import { FlyoutMenu, IconDragHandle16, IconEmptyFrame16, MenuItem } from "@dhis2/ui";
import React from "react";
import { useSetRecoilState } from "recoil";
import HelpState from "../../../../../state/help";

export default function HelperMenu({ onClose }: { onClose: () => void }) {
  const setHelpState = useSetRecoilState(HelpState);

  return (
    <>
      <FlyoutMenu>
        <MenuItem
          onClick={() => {
            setHelpState(true);
            onClose();
          }}
          icon={<IconEmptyFrame16 />}
          label={i18n.t("Take a Tour")}
        />
        <MenuItem
          onClick={() => {
            onClose();
          }}
          icon={<IconDragHandle16 />}
          label={i18n.t("User Manual")}
        />
      </FlyoutMenu>
    </>
  );
}
