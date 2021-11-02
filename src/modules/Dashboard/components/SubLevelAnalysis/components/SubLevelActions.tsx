import { Button, Chip, IconDownload24, Tooltip } from "@dhis2/ui";
import React from "react";
import { useRecoilState } from "recoil";
import { tabs } from "../constants/tabs";
import { ActiveTab } from "../state/tabs";

export default function SubLevelActions() {
  const [activeTab, setActiveTab] = useRecoilState(ActiveTab);
  return (
    <div className="row">
      <div className="column flex">
        <div className="row">
          {tabs?.map(({ label, icon, key }) => (
            <Tooltip key={`${key}-tooltip`} content={label}>
              <Chip onClick={() => setActiveTab(key)} key={key} selected={activeTab === key}>
                {icon}
              </Chip>
            </Tooltip>
          ))}
        </div>
      </div>
      <div className="column">
        <Tooltip content={"Download XLS File"}>
          <Button icon={<IconDownload24 />} />
        </Tooltip>
      </div>
    </div>
  );
}
