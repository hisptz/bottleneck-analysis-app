import { cloneDeep, find, findIndex, set as _set } from "lodash";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useRecoilCallback, useRecoilState } from "recoil";
import { DataItem, Group } from "../../../../../../../shared/interfaces/interventionConfig";
import { SelectedDeterminantIndex, SelectedIndicatorIndex } from "../../../../../state/edit";

export default function useItemOperations(setIndicatorSelectorHide: (hide: boolean) => void): {
  onItemDragEnd: (groupId: string, result: { destination: any; source: any }) => void;
  onItemsAdd: (group: Group, indicators: Array<DataItem>) => void;
  onItemClick: (groupId: string, itemId: string) => void;
  onItemDelete: (groupId: string, itemId: string) => void;
} {
  const { id } = useParams<{ id: string }>();
  const { getValues, setValue, watch } = useFormContext();
  const [selectedDeterminantIndex, setSelectedDeterminant] = useRecoilState(SelectedDeterminantIndex(id));
  const [selectedIndicatorIndex, setSelectedIndicator] = useRecoilState(SelectedIndicatorIndex(id));
  const determinants = watch("dataSelection.groups");

  const onItemDragEnd = useCallback(
    (groupId: string, result: { destination: any; source: any }) => {
      const { destination, source } = result;
      if (!destination) {
        return;
      }
      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return;
      }
      const prevDeterminants = getValues("dataSelection.groups");
      const newDeterminants = cloneDeep(prevDeterminants);
      const group: Group | undefined = find(newDeterminants, { id: groupId });
      if (group) {
        const items = [...group?.items];
        items.splice(destination.index, 0, items.splice(source.index, 1)[0]);
        group.items = items;
        newDeterminants[findIndex(newDeterminants, { id: groupId })] = group as Group;
        setValue("dataSelection.groups", newDeterminants);
      }
    },
    [getValues, setValue]
  );

  const onItemsAdd = useCallback(
    (group: Group, indicators: Array<DataItem>) => {
      const prevDeterminants = getValues("dataSelection.groups");
      const newDeterminants = cloneDeep(prevDeterminants);
      const selectedGroup = find(newDeterminants, { id: group.id });
      if (selectedGroup) {
        _set(selectedGroup, "items", [...indicators]);
        _set(newDeterminants, [findIndex(newDeterminants, ["id", selectedGroup.id])], selectedGroup);
        setValue("dataSelection.groups", newDeterminants);
      }

      setIndicatorSelectorHide(true);
    },
    [getValues, setIndicatorSelectorHide, setValue]
  );

  const onItemClick = (groupId: string, itemId: string) => {
    const selectedGroup = find(determinants, { id: groupId });
    setSelectedDeterminant(findIndex(determinants, ["id", groupId]));
    setSelectedIndicator(findIndex(selectedGroup.items, ["id", itemId]));
  };

  const onItemDelete = useRecoilCallback(
    ({ reset }) =>
      (groupId: string, itemId: string) => {
        if (selectedDeterminantIndex !== undefined && selectedIndicatorIndex !== undefined) {
          const selectedGroup = determinants[selectedDeterminantIndex];
          if (selectedGroup) {
            const selectedIndicatorId = selectedGroup.items[selectedIndicatorIndex];
            if (selectedIndicatorId) {
              if (selectedIndicatorId === itemId) {
                reset(SelectedIndicatorIndex(id));
                reset(SelectedDeterminantIndex(id));
              }
            }
          }
        }
        const prevDeterminants = getValues("dataSelection.groups");
        const newDeterminants = cloneDeep(prevDeterminants);
        const newGroup = find(newDeterminants, { id: groupId });
        if (newGroup) {
          const items = [...newGroup.items];
          const index = findIndex(items, { id: itemId });
          if (index !== -1) {
            items.splice(index, 1);
            _set(newGroup, "items", items);
            _set(newDeterminants, [findIndex(newDeterminants, ["id", newGroup.id])], newGroup);
          }
        }
        setValue("dataSelection.groups", newDeterminants);
      },
    [determinants, getValues, id, selectedDeterminantIndex, selectedIndicatorIndex, setValue]
  );

  return {
    onItemDragEnd,
    onItemsAdd,
    onItemClick,
    onItemDelete,
  };
}
