import { Button, IconAdd24 } from "@dhis2/ui";
import { DataConfigurationArea } from "@hisptz/react-ui";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { DataItem, Group } from "../../../../../../../shared/interfaces/interventionConfig";
import { getIcon } from "../../../../../../../shared/utils/indicators";
import { InterventionConfiguationDeterminant } from "../../../../../../Intervention/state/intervention";
import "./GroupDeterminantComponent.module.css";
import { InterventionDirtySelector } from "../../../../../state/data";

export default function GroupDeterminantComponent() {
  const { id } = useParams<{ id: string }>();
  const setInterventinoLegendDefintionConfigState = useSetRecoilState(InterventionConfiguationDeterminant);
  const [determinants, setDeterminants] = useRecoilState(
    InterventionDirtySelector({
      id,
      path: ["dataSelection", "groups"],
    })
  );
  const groups: Array<any> = useMemo(
    () =>
      determinants.map(({ id, name, items }: Group) => {
        return {
          id,
          name: `${name} (${items.length})`,
          items: items?.map(({ id, name, type }: DataItem) => ({
            id,
            name,
            icon: getIcon(type),
          })),
        };
      }),
    [determinants]
  );

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
