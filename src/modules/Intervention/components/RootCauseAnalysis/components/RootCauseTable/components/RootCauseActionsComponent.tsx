import i18n from "@dhis2/d2-i18n";
import { Button, IconDelete24, IconEdit24, IconMore24, Menu, MenuItem, Popover } from "@dhis2/ui";
import React, { useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { UserAuthority } from "../../../../../../../core/state/user";
import classes from "./../RootCauseTable.module.css";

type RootCauseActionsProps = {
  onUpdateRootCause: any;
  onDeleteRootCause: any;
};

export default function RootCauseActionsComponent({ onUpdateRootCause, onDeleteRootCause }: RootCauseActionsProps) {
  const authorities = useRecoilValue(UserAuthority);
  const ref = useRef<HTMLDivElement | null>(null);
  const [stateActionRef, setStateActionRef] = useState<any>(null);
  return (
    <div ref={ref}>
      {authorities?.rootCause?.edit || authorities?.rootCause?.delete ? (
        <Button
          className={classes["button"]}
          onClick={(_: any, e: MouseEvent) => {
            setStateActionRef(e.target);
            ref.current?.scrollIntoView({ behavior: "smooth" });
          }}>
          <IconMore24 />
        </Button>
      ) : (
        <div />
      )}
      {stateActionRef && (
        <Popover onClickOutside={() => setStateActionRef(undefined)} placement="bottom-start" reference={stateActionRef}>
          <Menu>
            {authorities?.rootCause?.edit && (
              <MenuItem
                onClick={() => {
                  onUpdateRootCause();
                  setStateActionRef(undefined);
                }}
                label={i18n.t("Edit")}
                icon={<IconEdit24 />}
              />
            )}
            {authorities?.rootCause?.delete && (
              <MenuItem
                onClick={() => {
                  onDeleteRootCause();
                  setStateActionRef(undefined);
                }}
                label={i18n.t("Delete")}
                icon={<IconDelete24 />}
              />
            )}
          </Menu>
        </Popover>
      )}
    </div>
  );
}
