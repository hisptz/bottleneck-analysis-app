import { Button, IconMore24, Menu, MenuItem, Popover } from "@dhis2/ui";
import React, { Suspense, useState } from "react";
import "./intervention-card.css";
import CardLoader from "../../../../shared/components/loaders/CardLoader";

export type InterventionMenu = {
  label: string | JSX.Element;
  icon?: JSX.Element;
  callback: () => void;
};

export type InterventionCardProps = {
  title: string | JSX.Element;
  children: JSX.Element | Array<JSX.Element> | React.ReactElement | string;
  actions?: JSX.Element;
  menu?: Array<InterventionMenu>;
  maxHeight?: number;
  minHeight?: number;
};

export default function InterventionCard({ title, children, actions, menu, minHeight, maxHeight }: InterventionCardProps) {
  const [actionButtonRef, setActionButtonRef] = useState<any>();
  return (
    <div className="card-container">
      <div className="row space-between align-center gap">
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
      <div className={`card-content column mt-16 mb-16`} style={{ maxHeight, minHeight, overflow: "auto" }}>
        <Suspense fallback={<CardLoader />}>{children}</Suspense>
      </div>
      <div className="card-actions">{actions}</div>
    </div>
  );
}
