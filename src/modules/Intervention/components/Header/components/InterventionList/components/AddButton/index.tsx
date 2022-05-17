import i18n from "@dhis2/d2-i18n";
import { DropdownButton, FlyoutMenu, IconAdd24, MenuItem } from "@dhis2/ui";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import CloningSelector from "./components/CloningSelector";

function AddMenu({ onCloneClick, onClose }: { onCloneClick: () => void; onClose: () => void }): React.ReactElement {
  const history = useHistory();
  return (
    <FlyoutMenu dataTest={"intervention-selection-menu"}>
      <MenuItem
        dataTest={"create-intervention-menu"}
        onClick={() => {
          onClose();
          history.replace("/new-intervention");
        }}
        label={i18n.t("Create new intervention")}
      />
      <MenuItem
        onClick={() => {
          onClose();
          onCloneClick();
        }}
        label={i18n.t("Duplicate an intervention")}
      />
    </FlyoutMenu>
  );
}

export default function AddButton(): React.ReactElement {
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);
  const [cloningModalOpen, setCloningModalOpen] = useState(false);

  return (
    <div className="add-button">
      <DropdownButton
        onClose={() => setMenuOpen(false)}
        open={menuOpen}
        onClick={({ open }: { open: boolean }) => {
          setMenuOpen(open);
        }}
        component={<AddMenu onCloneClick={() => setCloningModalOpen(true)} onClose={() => setMenuOpen(false)} />}
        dataTest={"add-intervention-button"}
        icon={<IconAdd24 />}
      />
      {cloningModalOpen && <CloningSelector hide={!cloningModalOpen} onClose={() => setCloningModalOpen(false)} />}
    </div>
  );
}
