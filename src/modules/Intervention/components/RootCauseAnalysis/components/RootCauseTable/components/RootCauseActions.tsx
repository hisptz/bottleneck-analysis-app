import i18n from "@dhis2/d2-i18n";
import { Button, IconMore24, IconEdit24, IconDelete24, Menu, MenuItem, Popover } from "@dhis2/ui";
import React, { useRef, useState } from "react";
import classes from "./../RootCauseTable.module.css";

type RootCauseActionsProps = {
  onUpdateRootCause: any;
  onDeleteRootCause: any;
};

export default function RootCauseActions({ onUpdateRootCause, onDeleteRootCause }: RootCauseActionsProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [stateActionRef, setStateActionRef] = useState<any>(null);
  return (
    <div ref={ref}>
      <Button
        className={classes["button"]}
        onClick={(_: any, e: MouseEvent) => {
          setStateActionRef(e.target);
          ref.current?.scrollIntoView({ behavior: "smooth" });
        }}>
        <IconMore24 />
      </Button>
      {stateActionRef && (
        <Popover onClickOutside={() => setStateActionRef(undefined)} placement="bottom-start" reference={stateActionRef}>
          <Menu>
            <MenuItem
              onClick={() => {
                onUpdateRootCause();
                setStateActionRef(undefined);
              }}
              label={i18n.t("Edit")}
              icon={<IconEdit24 />}
            />
            <MenuItem
              onClick={() => {
                onDeleteRootCause();
                setStateActionRef(undefined);
              }}
              label={i18n.t("Delete")}
              icon={<IconDelete24 />}
            />
          </Menu>
        </Popover>
      )}
    </div>
  );
}
