import i18n from "@dhis2/d2-i18n";
import { Button, IconAdd24 } from "@dhis2/ui";
import { DataConfigurationArea, useConfirmDialog } from "@hisptz/react-ui";
import { findIndex, isArray } from "lodash";
import React, { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { DataItem, Group } from "../../../../../../../shared/interfaces/interventionConfig";
import { getIcon } from "../../../../../../../shared/utils/indicators";
import "./GroupDeterminantComponent.module.css";
import { SelectedDeterminantIndex, SelectedIndicatorIndex } from "../../../../../state/edit";
import IndicatorSelector from "../../IndicatorSelector";
import useItemOperations from "../hooks/useItemOperations";
import ColorPicker from "./ColorPicker";

export default function GroupDeterminantComponent(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const { watch, setValue } = useFormContext();
  const [indicatorSelectorHide, setIndicatorSelectorHide] = useState(true);
  const [selectedAddGroupIndex, setSelectedAddGroupIndex] = useState<number | undefined>();
  const selectedGroupIndex = useRecoilValue(SelectedDeterminantIndex(id));
  const selectedIndicatorIndex = useRecoilValue(SelectedIndicatorIndex(id));
  const determinants = watch("dataSelection.groups");
  const { onItemDragEnd, onItemDelete, onItemsAdd, onItemClick } = useItemOperations(setIndicatorSelectorHide);

  const { confirm } = useConfirmDialog();

  const groups: Array<any> = determinants?.map((group: Group) => {
    const { id, name, items, style } = group ?? {};
    if (!isArray(determinants)) {
      return [];
    }
    return {
      ...group,
      id,
      name: `${name} (${items.length})`,
      items: items?.map(({ id, type, label }: DataItem) => ({
        id,
        name: label,
        icon: getIcon(type)
      })),
      style
    };
  });

  const selectedItems = useMemo(() => {
    if (selectedGroupIndex !== undefined && selectedIndicatorIndex !== undefined) {
      const selectedGroup = determinants[selectedGroupIndex];
      if (selectedGroup) {
        const selectedIndicatorId = selectedGroup.items[selectedIndicatorIndex]?.id;

        if (selectedIndicatorId) {
          return [
            {
              itemId: selectedIndicatorId,
              groupId: selectedGroup.id
            }
          ];
        }
      }
    }
    return [];
  }, [determinants, selectedGroupIndex, selectedIndicatorIndex]);

  return (
    <div className="indicator-data-configuration-area">
      <DataConfigurationArea
        defaultExpanded
        selectedItems={selectedItems}
        groups={groups}
        draggableItems
        onItemDragEnd={onItemDragEnd}
        deletableItems
        onItemClick={onItemClick}
        onItemDelete={(groupId, itemId) => {
          if (id) {
            confirm({
              title: i18n.t("Confirm Delete"),
              message: (
                <div className="p-8">
                  {i18n.t("Removing this indicator may affect already existing data for this intervention.")}
                  {i18n.t(" Are you sure you want to delete this indicator?")}
                </div>
              ),
              onConfirm: () => {
                onItemDelete(groupId, itemId);
              },
              onCancel: () => {
                return;
              },
              confirmButtonText: i18n.t("Delete")
            });
            return;
          }
          onItemDelete(groupId, itemId);
        }}
        groupFooter={(group, groupIndex) => (
          <>
            <Button
              icon={<IconAdd24 />}
              dataTest={"add-indicator-button"}
              onClick={() => {
                setSelectedAddGroupIndex(groupIndex);
                setIndicatorSelectorHide(false);
              }}
              className="add-button">
              {i18n.t("Add Indicator")}
            </Button>
          </>
        )}
        titleRightAdornment={({ id }) => {
          const groupIndex = findIndex(groups, { id });
          return (
            <ColorPicker
              group={groups[groupIndex]}
              onChange={(color) => {
                setValue(`dataSelection.groups.${groupIndex}.style.color`, color);
              }}
            />
          );
        }}
      />
      {!indicatorSelectorHide && selectedAddGroupIndex !== undefined ? (
        <IndicatorSelector
          onSave={onItemsAdd}
          group={determinants[selectedAddGroupIndex]}
          onClose={() => setIndicatorSelectorHide(true)}
          hide={indicatorSelectorHide}
        />
      ) : null}
    </div>
  );
}
