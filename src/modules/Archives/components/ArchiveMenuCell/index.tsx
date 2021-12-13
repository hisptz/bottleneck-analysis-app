import i18n from "@dhis2/d2-i18n";
import { Button, DataTableCell, FlyoutMenu, IconDelete24, IconMore24, IconView24, MenuItem, Popover } from "@dhis2/ui";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Archive } from "../../../../shared/interfaces/archive";
import { ArchiveAccess } from "../../state/data";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

export default function ArchiveMenuCell({ archive }: { archive: Archive }): React.ReactElement {
  const [stateActionRef, setStateActionRef] = useState<EventTarget | null>();
  const access = useRecoilValue(ArchiveAccess(archive.id));
  const history = useHistory();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const onViewClick = () => {
    setStateActionRef(null);
    history.push(`/archives/${archive.id}`);
  };

  const onDeleteClick = () => {
    setStateActionRef(null);
    setDeleteOpen(true);
  };
  //TODO: Ask Raj What was to be done on refresh

  return (
    <DataTableCell>
      {access?.read || access?.write ? (
        <div className="archive-menu-cell-action">
          <Button onClick={(_: any, e: MouseEvent) => setStateActionRef(e.target)} icon={<IconMore24 />} />
          {stateActionRef && (
            <Popover arrow onClickOutside={() => setStateActionRef(undefined)} placement="bottom-start" reference={stateActionRef}>
              <FlyoutMenu>
                {access?.read && <MenuItem onClick={onViewClick} icon={<IconView24 />} label={i18n.t("View")} />}
                {access?.write && <MenuItem onClick={onDeleteClick} icon={<IconDelete24 />} label={i18n.t("Delete")} />}
                {/*<MenuItem icon={<IconSync24 />} label={i18n.t("Refresh")} />*/}
              </FlyoutMenu>
            </Popover>
          )}
          {deleteOpen && <DeleteConfirmModal archive={archive} hide={!deleteOpen} onClose={() => setDeleteOpen(false)} />}
        </div>
      ) : (
        <div />
      )}
    </DataTableCell>
  );
}
