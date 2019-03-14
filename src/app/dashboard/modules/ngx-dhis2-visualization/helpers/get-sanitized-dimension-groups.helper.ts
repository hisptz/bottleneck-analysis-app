import * as _ from 'lodash';

export function getSanitizedDimensionGroups(
  dimensionGroups: any[],
  dimensionItems: any[]
) {
  return _.map(dimensionGroups || [], (group: any) => {
    return {
      ...group,
      members: _.map(
        group.members || [],
        (member: any) =>
          (member.id
            ? _.find(dimensionItems, ['id', member.id])
            : _.find(dimensionItems, ['name', member.name])) || member
      )
    };
  });
}
