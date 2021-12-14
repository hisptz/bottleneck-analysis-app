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
          label={i18n.t("Start a guided tour")}
        />
        <MenuItem
          onClick={() => {
            onClose();
            window.location.href =
              "https://docs.dhis2.org/en/use/optional-apps/bottleneck-analysis-app/app-version-122/introduction-and-usage/dashboard-and-demo.html";
          }}
          label={i18n.t("Documentation")}
        />
      </FlyoutMenu>
    </>
  );
}
