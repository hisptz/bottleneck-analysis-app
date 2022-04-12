import i18n from "@dhis2/d2-i18n";
import { Button, IconDownload24, Tooltip } from "@dhis2/ui";
import React from "react";
import Control from "react-leaflet-custom-control";
import usePrintMap from "../../hooks/print";

export default function DownloadControl() {
  const { printMap } = usePrintMap();

  return (
    <Control position="topleft">
      <Tooltip content={i18n.t("Download image")}>
        <Button onClick={printMap} icon={<IconDownload24 />} />
      </Tooltip>
    </Control>
  );
}
