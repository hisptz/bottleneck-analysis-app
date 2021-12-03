import { cloneDeep, find, findIndex, set } from "lodash";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { DataItem, Group } from "../../../../../../../shared/interfaces/interventionConfig";
import { SelectedDeterminantId, SelectedIndicatorId } from "../../../../../state/edit";

export default function useItemOperations(
  setDeterminants: (determinants: (prevDeterminants: Array<Group>) => Array<Group> | undefined) => void,
  setIndicatorSelectorHide: (hide: boolean) => void,
  groups: Array<Group>
): {
  onItemDragEnd: (groupId: string, result: { destination: any; source: any }) => void;
  onItemsAdd: (group: Group, indicators: Array<DataItem>) => void;
  onItemClick: (groupId: string, itemId: string) => void;
  onItemDelete: (groupId: string, itemId: string) => void;
} {
  const { id } = useParams<{ id: string }>();

  const setSelectedDeterminant = useSetRecoilState(SelectedDeterminantId(id));
  const setSelectedIndicator = useSetRecoilState(SelectedIndicatorId(id));

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
          set(selectedGroup, "items", [...indicators]);
          set(newDeterminants, [findIndex(newDeterminants, ["id", selectedGroup.id])], selectedGroup);
          return newDeterminants;
        }
      });
      setIndicatorSelectorHide(true);
    },
    [setDeterminants, setIndicatorSelectorHide]
  );

  const onItemClick = (groupId: string, itemId: string) => {
    const selectedGroup = find(groups, { id: groupId });
    setSelectedDeterminant(selectedGroup?.id);
    setSelectedIndicator(find(selectedGroup?.items, { id: itemId })?.id);
  };

  const onItemDelete = (groupId: string, itemId: string) => {
    console.log({ groupId, itemId });
  };

  return {
    onItemDragEnd,
    onItemsAdd,
    onItemClick,
    onItemDelete,
  };
}
