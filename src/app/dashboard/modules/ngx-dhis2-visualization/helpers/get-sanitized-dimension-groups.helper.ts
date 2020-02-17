import * as _ from 'lodash';
import { generateDeterminants } from 'src/app/helpers/generate-determinants.helper';

export function getSanitizedDimensionGroups(
  dimensionGroups: any[],
  dimensionItems: any[]
) {
  const defaultDeterminants = generateDeterminants();
  return _.sortBy(
    _.map(dimensionGroups || [], (group: any) => {
      const determinant =
        _.find(defaultDeterminants, ['code', group.code]) ||
        _.find(defaultDeterminants, ['name', group.name]);

      const sortOrder = determinant ? determinant.sortOrder : undefined;
      return {
        ...group,
        sortOrder: group.sortOrder || sortOrder,
        members: _.map(
          group.members || [],
          (member: any) =>
            (member.id
              ? _.find(dimensionItems, ['id', member.id])
              : _.find(dimensionItems, ['name', member.name])) || member
        ),
      };
    }),
    'sortOrder'
  );
}
