import { IconDimensionIndicator16, IconDimensionProgramIndicator16, Button, IconAdd24 } from "@dhis2/ui";
import { DataConfigurationArea } from "@hisptz/react-ui";
import { DataConfigurationAreaGroupProps } from "@hisptz/react-ui/build/types/components/DataConfigurationArea";
import React from "react";
import { useSetRecoilState } from "recoil";
import { InterventionConfiguationDeterminant } from "../../../../../../../state/intervention";
import "./GroupDeterminantComponent.module.css";

export default function GroupDeterminantComponent() {
  const setInterventinoLegendDefintionConfigState = useSetRecoilState(InterventionConfiguationDeterminant);
  const groups: Array<DataConfigurationAreaGroupProps> = [
    {
      id: "group-1",
      name: "Commodities (2)",
      items: [
        {
          id: "item-1",
          name: "Item 1",
          icon: <IconDimensionIndicator16 />,
          subLabel: "Indicator",
        },
        {
          id: "item-2",
          name: "Item 2",
          icon: <IconDimensionProgramIndicator16 />,
          subLabel: "Program Indicator",
        },
      ],
    },
    {
      id: "group-2",
      name: "Human Resources",
      items: [
        {
          id: "item-1",
          name: "Item 1",
          icon: <IconDimensionIndicator16 />,
          subLabel: "Indicator",
        },
        {
          id: "item-2",
          name: "Item 2",
          icon: <IconDimensionProgramIndicator16 />,
          subLabel: "Program Indicator",
        },
      ],
    },
    {
      id: "group-3",
      name: "Geographical Accesibility",
      items: [
        {
          id: "item-1",
          name: "Item 1",
          icon: <IconDimensionIndicator16 />,
          subLabel: "Indicator",
        },
        {
          id: "item-2",
          name: "Item 2",
          icon: <IconDimensionProgramIndicator16 />,
          subLabel: "Program Indicator",
        },
      ],
    },
    {
      id: "group-4",
      name: "Initial Utilization",
      items: [
        {
          id: "item-1",
          name: "Item 1",
          icon: <IconDimensionIndicator16 />,
          subLabel: "Indicator",
        },
        {
          id: "item-2",
          name: "Item 2",
          icon: <IconDimensionProgramIndicator16 />,
          subLabel: "Program Indicator",
        },
      ],
    },
  ];

  return (
    <div>
      <DataConfigurationArea
        groups={groups}
        deletableItems
        onItemClick={function (groupId: string, itemId: string): void {
          setInterventinoLegendDefintionConfigState(true);
        }}
        onItemDelete={function (groupId: string, itemId: string): void {
          throw new Error("Function not implemented.");
        }}
        groupFooter={
          <div>
            <Button icon={<IconAdd24 />}>Add Item</Button>
          </div>
        }
      />
    </div>
  );
}
