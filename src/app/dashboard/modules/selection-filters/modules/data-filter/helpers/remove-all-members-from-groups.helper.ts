import { DataGroup } from 'src/app/models';
import * as _ from 'lodash';

export function removeAllMembersFromGroups(dataGroups: DataGroup[]) {
  return _.map(dataGroups || [], (dataGroup: DataGroup) => {
    return {
      ...dataGroup,
      members: []
    };
  });
}
