import i18n from "@dhis2/d2-i18n";
import { Button, IconAdd24 } from "@dhis2/ui";
import { DataConfigurationArea } from "@hisptz/react-ui";
import { isArray } from "lodash";
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { DataItem, Group } from "../../../../../../../shared/interfaces/interventionConfig";
import { getIcon } from "../../../../../../../shared/utils/indicators";
import "./GroupDeterminantComponent.module.css";
import { InterventionDirtySelector } from "../../../../../state/data";
import { SelectedDeterminant, SelectedIndicator } from "../../../../../state/edit";
import IndicatorSelector from "../../IndicatorSelector";
import useItemOperations from "../hooks/useItemOperations";

export default function GroupDeterminantComponent(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const [indicatorSelectorHide, setIndicatorSelectorHide] = useState(true);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | undefined>();
  const selectedGroup = useRecoilValue(SelectedDeterminant(id));
  const selectedIndicator = useRecoilValue(SelectedIndicator(id));
  const [determinants, setDeterminants] = useRecoilState(
    InterventionDirtySelector({
      id,
      path: ["dataSelection", "groups"],
    })
  );

  const { onItemDragEnd, onItemDelete, onItemsAdd, onItemClick } = useItemOperations(setDeterminants, setIndicatorSelectorHide, determinants);

  const groups: Array<any> = useMemo(() => {
    return determinants?.map(({ id, name, items }: Group) => {
      if (!isArray(determinants)) {
        return [];
      }
      return {
        id,
        name: `${name} (${items.length})`,
        items: items?.map(({ id, name, type }: DataItem) => ({
          id,
          name,
          icon: getIcon(type),
        })),
      };
    });
  }, [determinants]);

  const selectedItems = useMemo(() => {
    if (selectedIndicator && selectedGroup) {
      return [{ groupId: selectedGroup?.id, itemId: selectedIndicator?.id }];
    }
    return [];
  }, [selectedGroup, selectedIndicator]);

  return (
    <div>
      <DataConfigurationArea
        selectedItems={selectedItems}
        groups={groups}
        draggableItems
        onItemDragEnd={onItemDragEnd}
        deletableItems
        onItemClick={onItemClick}
        onItemDelete={onItemDelete}
        groupFooter={(group, groupIndex) => (
          <>
            <Button
              icon={<IconAdd24 />}
              onClick={() => {
                setSelectedGroupIndex(groupIndex);
                setIndicatorSelectorHide(false);
              }}
              className="add-button">
              {i18n.t("Add Indicator")}
            </Button>
          </>
        )}
      />
      {!indicatorSelectorHide && selectedGroupIndex !== undefined ? (
        <IndicatorSelector onSave={onItemsAdd} group={groups[selectedGroupIndex]} onClose={() => setIndicatorSelectorHide(true)} hide={indicatorSelectorHide} />
      ) : null}
    </div>
  );
}
