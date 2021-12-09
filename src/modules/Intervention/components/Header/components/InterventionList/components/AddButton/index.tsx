import i18n from "@dhis2/d2-i18n";
import { Button, FlyoutMenu, IconAdd24, Layer, MenuItem, Popover } from "@dhis2/ui";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "../../styles.module.css";
import CloningSelector from "./components/CloningSelector";

function AddMenu({ reference, onClose, onCloneClick }: { reference: any; onClose: () => void; onCloneClick: () => void }): React.ReactElement {
  const history = useHistory();
  return (
    <Layer onClick={onClose}>
      <Popover onClickOutside={onClose} placement="bottom-start" dataTest={"intervention-selection-menu"} reference={reference}>
        <FlyoutMenu>
          <MenuItem
            dataTest={"create-intervention-menu"}
            onClick={() => {
              onClose();
              history.replace("/new-intervention");
            }}
            label={i18n.t("Create new")}
          />
          <MenuItem
            onClick={() => {
              onClose();
              onCloneClick();
            }}
            label={i18n.t("Clone an existing intervention")}
          />
        </FlyoutMenu>
      </Popover>
    </Layer>
  );
}

export default function AddButton({ onClick }: { onClick: () => void }): React.ReactElement {
  const [reference, setReference] = React.useState<any>(null);
  const [cloningModalOpen, setCloningModalOpen] = useState(false);

  return (
    <>
      <Button dataTest={"addIntervntionButton"} onClick={(_: any, e: any) => setReference(e.target)} className={styles.circular} icon={<IconAdd24 />} />
      {reference && <AddMenu onCloneClick={() => setCloningModalOpen(true)} reference={reference} onClose={() => setReference(null)} />}
      {cloningModalOpen && <CloningSelector hide={!cloningModalOpen} onClose={() => setCloningModalOpen(false)} />}
    </>
  );
}
