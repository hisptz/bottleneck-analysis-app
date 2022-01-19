import i18n from "@dhis2/d2-i18n";
import { Button, DataTableCell, FlyoutMenu, IconDelete24, IconMore24, IconView24, MenuItem, Popover } from "@dhis2/ui";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { UserAuthority } from "../../../../core/state/user";
import { Archive } from "../../../../shared/interfaces/archive";
import classes from "../../../../styles/Table.module.css";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

export default function ArchiveMenuCell({ archive }: { archive: Archive }): React.ReactElement {
  const [stateActionRef, setStateActionRef] = useState<EventTarget | null>();
  const history = useHistory();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { archive: archiveAuthority } = useRecoilValue(UserAuthority);

  const onViewClick = () => {
    setStateActionRef(null);
    history.push(`/archives/${archive.id}`);
  };

  const onDeleteClick = () => {
    setStateActionRef(null);
    setDeleteOpen(true);
  };

  return (
    <DataTableCell className={classes["table-cell"]}>
      <div className="archive-menu-cell-action">
        <Button className="archive-menu-cell-action-test" onClick={(_: any, e: MouseEvent) => setStateActionRef(e.target)} icon={<IconMore24 />}>
          {i18n.t("More")}
        </Button>
        {stateActionRef && (
          <Popover arrow onClickOutside={() => setStateActionRef(undefined)} placement="bottom-start" reference={stateActionRef}>
            <FlyoutMenu>
              <MenuItem className="archive-menu-cell-action-delete-test" onClick={onViewClick} icon={<IconView24 />} label={i18n.t("View")} />
              {archiveAuthority.delete && <MenuItem onClick={onDeleteClick} icon={<IconDelete24 />} label={i18n.t("Delete")} />}
            </FlyoutMenu>
          </Popover>
        )}
        {deleteOpen && <DeleteConfirmModal archive={archive} hide={!deleteOpen} onClose={() => setDeleteOpen(false)} />}
      </div>
    </DataTableCell>
  );
}
