import { Button, IconMore24, Menu, MenuItem, Popover } from "@dhis2/ui";
import React, { useState } from "react";
import "./dashboard-card.css";

export type DashboardMenu = {
  label: string | JSX.Element;
  icon?: JSX.Element;
  callback: () => void;
};

export type DashboardCardProps = {
  title: string | JSX.Element;
  children: JSX.Element | Array<JSX.Element> | React.ReactElement | string;
  actions?: JSX.Element;
  menu?: Array<DashboardMenu>;
};

export default function DashboardCard({ title, children, actions, menu }: DashboardCardProps) {
  const [actionButtonRef, setActionButtonRef] = useState<any>();
  return (
    <div className="card-container">
      <div className="row space-between align-center">
        <div className="card-header">{typeof title === "string" ? <h4>{title}</h4> : title}</div>
        {menu && (
          <>
            <Button icon={<IconMore24 />} onClick={(_: any, e: MouseEvent) => setActionButtonRef(e.target)} />
            {actionButtonRef && (
              <Popover onClickOutside={() => setActionButtonRef(undefined)} placement="left-start" reference={actionButtonRef}>
                <Menu>
                  {menu?.map(({ label, icon, callback }) => (
                    <MenuItem onClick={callback} key={`${label}-${title}-menu`} label={label} icon={icon} />
                  ))}
                </Menu>
              </Popover>
            )}
          </>
        )}
      </div>
      <div className={`card-content column`}>{children}</div>
      <div className="card-actions">{actions}</div>
    </div>
  );
}
