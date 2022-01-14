import i18n from "@dhis2/d2-i18n";
import { FlyoutMenu, IconArchive24, IconDownload24, IconView24, MenuItem } from "@dhis2/ui";
import React from "react";

export default function MoreMenu({
  onClose,
  onArchive,
  onZipDownload,
  zipDisabled,
}: {
  onClose: () => void;
  onArchive: () => void;
  onZipDownload: () => void;
  zipDisabled: boolean;
}): React.ReactElement {
  return (
    <>
      <FlyoutMenu>
        <MenuItem
          icon={<IconArchive24 />}
          onClick={() => {
            onArchive();
            onClose();
          }}
          label={i18n.t("Archive")}
        />
        <MenuItem
          icon={<IconDownload24 />}
          disabled={zipDisabled}
          onClick={() => {
            onZipDownload();
            onClose();
          }}
          label={i18n.t("Download zip")}
        />
      </FlyoutMenu>
    </>
  );
}
