import { cloneDeep, find, findIndex, set as _set } from "lodash";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useRecoilCallback, useRecoilState, useSetRecoilState } from "recoil";
import { DataItem, Group } from "../../../../../../../shared/interfaces/interventionConfig";
import { InterventionDirtySelector } from "../../../../../state/data";
import { SelectedDeterminantId, SelectedIndicatorId } from "../../../../../state/edit";

export default function useItemOperations(setIndicatorSelectorHide: (hide: boolean) => void): {
  onItemDragEnd: (groupId: string, result: { destination: any; source: any }) => void;
  onItemsAdd: (group: Group, indicators: Array<DataItem>) => void;
  onItemClick: (groupId: string, itemId: string) => void;
  onItemDelete: (groupId: string, itemId: string) => void;
} {
  const { id } = useParams<{ id: string }>();
  const setSelectedDeterminant = useSetRecoilState(SelectedDeterminantId(id));
  const [selectedIndicatorId, setSelectedIndicator] = useRecoilState(SelectedIndicatorId(id));
  const [determinants, setDeterminants] = useRecoilState(
    InterventionDirtySelector({
      id,
      path: ["dataSelection", "groups"],
    })
  );

  const onItemDragEnd = useCallback(
    (groupId: string, result: { destination: any; source: any }) => {
      const { destination, source } = result;
      if (!destination) {
        return;
      }
      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return;
      }
      setDeterminants((prevDeterminants: Array<Group>) => {
        const newDeterminants = cloneDeep(prevDeterminants);
        const group: Group | undefined = find(newDeterminants, { id: groupId });
        if (group) {
          const items = [...group?.items];
          items.splice(destination.index, 0, items.splice(source.index, 1)[0]);
          group.items = items;
          newDeterminants[findIndex(newDeterminants, { id: groupId })] = group as Group;
          return newDeterminants;
        }
      });
    },
    [setDeterminants]
  );

  const onItemsAdd = useCallback(
    (group: Group, indicators: Array<DataItem>) => {
      setDeterminants((prevDeterminants: Array<Group>) => {
        const newDeterminants = cloneDeep(prevDeterminants);
        const selectedGroup = find(newDeterminants, { id: group.id });

        if (selectedGroup) {
          _set(selectedGroup, "items", [...indicators]);
          _set(newDeterminants, [findIndex(newDeterminants, ["id", selectedGroup.id])], selectedGroup);
          return newDeterminants;
        }
      });
      setIndicatorSelectorHide(true);
    },
    [setDeterminants, setIndicatorSelectorHide]
  );

  const onItemClick = (groupId: string, itemId: string) => {
    const selectedGroup = find(determinants, { id: groupId });
    setSelectedDeterminant(selectedGroup?.id);
    setSelectedIndicator(find(selectedGroup?.items, { id: itemId })?.id);
  };

  const onItemDelete = useRecoilCallback(
    ({ set, reset }) =>
      (groupId: string, itemId: string) => {
        if (selectedIndicatorId === itemId) {
          reset(SelectedIndicatorId(id));
        }
        set(
          InterventionDirtySelector({
            id,
            path: ["dataSelection", "groups"],
          }),
          (determinants) => {
            const newDeterminants = cloneDeep(determinants);
            const selectedGroup = find(newDeterminants, { id: groupId });
            if (selectedGroup) {
              const items = [...selectedGroup.items];
              const index = findIndex(items, { id: itemId });
              if (index !== -1) {
                items.splice(index, 1);
                _set(selectedGroup, "items", items);
                _set(newDeterminants, [findIndex(newDeterminants, ["id", selectedGroup.id])], selectedGroup);
              }
            }
            return newDeterminants;
          }
        );
      },
    [id, selectedIndicatorId]
  );

  return {
    onItemDragEnd,
    onItemsAdd,
    onItemClick,
    onItemDelete,
  };
}
