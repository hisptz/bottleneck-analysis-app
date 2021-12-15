import i18n from "@dhis2/d2-i18n";
import { FlyoutMenu, MenuItem } from "@dhis2/ui";
import React from "react";
import { useSetRecoilState } from "recoil";
import { DOCUMENTATION_URL } from "../../../../../../../constants/documentation";
import HelpState from "../../../../../state/help";

export default function HelperMenu({ onClose }: { onClose: () => void }): React.ReactElement {
  const setHelpState = useSetRecoilState(HelpState);

  return (
    <>
      <FlyoutMenu>
        <MenuItem
          onClick={() => {
            setHelpState(true);
            onClose();
          }}
          label={i18n.t("Start a guided tour")}
        />
        <MenuItem
          onClick={() => {
            onClose();
            window.open(DOCUMENTATION_URL, "_blank");
          }}
          label={i18n.t("Documentation")}
        />
      </FlyoutMenu>
    </>
  );
}
