import { Determinant } from 'src/app/models';
import * as _ from 'lodash';

export function removeAllMembersFromDeterminants(dataGroups: Determinant[]) {
  return _.map(dataGroups || [], (dataGroup: Determinant) => {
    return {
      ...dataGroup,
      members: [],
    };
  });
}
