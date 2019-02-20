import { map as _map, find as _find } from 'lodash';
import { generateUid } from 'src/app/helpers';

export function getSanitizedDimensionGroups(
  dimensionGroups: any[],
  dimensionItems: any[]
) {
  return _map(dimensionGroups || [], (group: any) => {
    return {
      ...group,
      id: group.id || generateUid(),
      members: _map(group.members || [], (member: any) => {
        const memberDetails = _find(dimensionItems, ['name', member.name]);
        return member && member.id
          ? member
          : memberDetails
          ? {
              ...member,
              id: memberDetails.id
            }
          : member;
      })
    };
  });
}
