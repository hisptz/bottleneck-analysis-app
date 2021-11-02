import { Button, IconMore24 } from "@dhis2/ui";
import React, { useRef } from "react";
import "./dashboard-card.css";

export type DashboardMenu = {
  label: string | JSX.Element;
  icon?: JSX.Element;
  callback: () => void;
};

export type DashboardCardProps = {
  title: string | JSX.Element;
  content: JSX.Element;
  actions?: JSX.Element;
  menu?: Array<DashboardMenu>;
};

export default function DashboardCard({ title, content, actions, menu }: DashboardCardProps) {
  const actionButtonRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className="card-container">
      <div className="row space-between align-center">
        <div className="card-header">{typeof title === "string" ? <h4>{title}</h4> : title}</div>
        {menu && (
          <div ref={actionButtonRef}>
            <Button icon={<IconMore24 />} />
          </div>
        )}
      </div>
      <div className="card-content column align-center center">{content}</div>
      <div className="card-actions">{actions}</div>
    </div>
  );
}
