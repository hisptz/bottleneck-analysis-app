import { DataGroup } from 'src/app/models';
import * as _ from 'lodash';

export function addMembersToGroups(
  dataGroups: DataGroup[],
  selectedGroupId: string,
  members: any[],
  dataGroupPreferences: any
): DataGroup[] {
  const maximumItemPerGroup = dataGroupPreferences
    ? dataGroupPreferences.maximumItemPerGroup
    : (members || []).length;
  let availableMembers = _.differenceBy(
    members,
    _.flatten(
      _.map(dataGroups, (dataGroup: DataGroup) =>
        dataGroup ? dataGroup.members || [] : []
      )
    ),
    'id'
  );

  // Assign to the selected group first until maximum number is reached
  let selectedGroup = _.find(dataGroups || [], ['id', selectedGroupId]);
  const selectedGroupIndex = (dataGroups || []).indexOf(selectedGroup);

  if (selectedGroup) {
    const membersForSelectedGroup = _.slice(
      availableMembers,
      0,
      maximumItemPerGroup - selectedGroup.members.length
    );

    selectedGroup = {
      ...selectedGroup,
      members: [...selectedGroup.members, ...membersForSelectedGroup]
    };

    availableMembers = _.differenceBy(
      availableMembers,
      membersForSelectedGroup
    );
  }

  return _.map(
    selectedGroupIndex > -1
      ? [
          ..._.slice(dataGroups, 0, selectedGroupIndex),
          selectedGroup,
          ..._.slice(dataGroups, selectedGroupIndex + 1)
        ]
      : dataGroups,
    (dataGroup: any) => {
      if (!dataGroup) {
        return null;
      }
      const membersForCurrentGroup = _.slice(
        availableMembers,
        0,
        maximumItemPerGroup - (dataGroup.members || []).length
      );

      availableMembers = _.differenceBy(
        availableMembers,
        membersForCurrentGroup
      );

      return {
        ...dataGroup,
        members: [...dataGroup.members, ...membersForCurrentGroup]
      };
    }
  );
}
