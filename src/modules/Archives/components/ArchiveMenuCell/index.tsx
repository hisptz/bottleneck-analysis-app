import i18n from "@dhis2/d2-i18n";
import { Button, DataTableCell, FlyoutMenu, IconDelete24, IconMore24, IconSync24, IconView24, MenuItem, Popover } from "@dhis2/ui";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function ArchiveMenuCell({ id }: { id: string }): React.ReactElement {
  const [stateActionRef, setStateActionRef] = useState<EventTarget | null>();
  const history = useHistory();

  const onViewClick = () => {
    setStateActionRef(null);
    history.push(`/archives/${id}`);
  };

  return (
    <DataTableCell>
      <div>
        <Button onClick={(_: any, e: MouseEvent) => setStateActionRef(e.target)} icon={<IconMore24 />} />
        {stateActionRef && (
          <Popover arrow onClickOutside={() => setStateActionRef(undefined)} placement="bottom-start" reference={stateActionRef}>
            <FlyoutMenu>
              <MenuItem onClick={onViewClick} icon={<IconView24 />} label={i18n.t("View")} />
              <MenuItem icon={<IconDelete24 />} label={i18n.t("Delete")} />
              <MenuItem icon={<IconSync24 />} label={i18n.t("Refresh")} />
            </FlyoutMenu>
          </Popover>
        )}
      </div>
    </DataTableCell>
  );
}
