import i18n from "@dhis2/d2-i18n";
import { FlyoutMenu, IconArchive24, IconDownload24, IconView24, MenuItem } from "@dhis2/ui";
import React from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { UserAuthority } from "../../../../../../../core/state/user";

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
  const history = useHistory();
  const { archive } = useRecoilValue(UserAuthority);

  function onToArchivesList() {
    history.push("/archives");
  }

  return (
    <>
      <FlyoutMenu>
        <MenuItem
          icon={<IconView24 />}
          onClick={() => {
            onToArchivesList();
            onClose();
          }}
          label={i18n.t("View Archives")}
        />
        {archive.create && (
          <MenuItem
            icon={<IconArchive24 />}
            onClick={() => {
              onArchive();
              onClose();
            }}
            label={i18n.t("Archive")}
          />
        )}
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
