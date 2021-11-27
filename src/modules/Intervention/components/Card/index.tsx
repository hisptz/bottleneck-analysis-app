import { Button, IconFullscreen24, IconFullscreenExit24, IconMore24, Menu, MenuItem, Popover, Tooltip } from "@dhis2/ui";
import React, { Suspense, useState } from "react";
import "./intervention-card.css";
import { ErrorBoundary } from "react-error-boundary";
import { FullScreen } from "react-full-screen";
import { useParams } from "react-router-dom";
import CardError from "../../../../shared/components/errors/CardError";
import CardLoader from "../../../../shared/components/loaders/CardLoader";
import i18n from "@dhis2/d2-i18n";

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
  maxHeight?: number | string;
  minHeight?: number | string;
  onReset?: () => void;
  allowFullScreen?: boolean;
  fullScreenHandle: any;
};

export default function InterventionCard({
  title,
  children,
  actions,
  menu,
  minHeight,
  maxHeight,
  onReset,
  allowFullScreen,
  fullScreenHandle,
}: InterventionCardProps) {
  const { id } = useParams<{ id: string }>();
  const [actionButtonRef, setActionButtonRef] = useState<any>();

  const fullScreenHandleFullScreen = () => {
    if (fullScreenHandle) {
      fullScreenHandle.enter();
      setActionButtonRef(undefined);
    }
  };

  return (
    <FullScreen handle={fullScreenHandle}>
      <div className="card-container">
        <div className="row space-between align-center gap">
          <div className="card-header">{typeof title === "string" ? <h4>{title}</h4> : title}</div>
          {menu && !fullScreenHandle?.active && (
            <>
              <Button icon={<IconMore24 />} onClick={(_: any, e: MouseEvent) => setActionButtonRef(e.target)} />
              {actionButtonRef && (
                <Popover onClickOutside={() => setActionButtonRef(undefined)} placement="left-start" reference={actionButtonRef}>
                  <Menu>
                    {menu?.map(({ label, icon, callback }) => (
                      <MenuItem onClick={callback} key={`${label}-${title}-menu`} label={label} icon={icon} />
                    ))}
                    {allowFullScreen && (
                      <MenuItem
                        onClick={fullScreenHandleFullScreen}
                        key={`full-screen-menu`}
                        label={i18n.t("View in Full Screen")}
                        icon={<IconFullscreen24 />}
                      />
                    )}
                  </Menu>
                </Popover>
              )}
            </>
          )}
          {fullScreenHandle?.active && (
            <Tooltip content={"Exit Full Screen View"}>
              <Button className="full-screen-button" icon={<IconFullscreenExit24 />} onClick={fullScreenHandle?.exit} />
            </Tooltip>
          )}
        </div>
        <div className={`card-content column mt-16 mb-16`} style={{ maxHeight, minHeight, overflow: "auto" }}>
          <ErrorBoundary resetKeys={[id]} onReset={onReset} FallbackComponent={CardError}>
            <Suspense fallback={<CardLoader />}>{children}</Suspense>
          </ErrorBoundary>
        </div>
        <div className="card-actions">{actions}</div>
      </div>
    </FullScreen>
  );
}
