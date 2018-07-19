import * as _ from 'lodash';
export function getSharingAccessesBasedOnAccessType(
  sharingItems: any[],
  accessType: string
) {
  return _.filter(
    _.map(
      _.filter(
        sharingItems || [],
        sharingItem => sharingItem.type === accessType
      ),
      sharingItem => {
        return sharingItem
          ? {
              id: sharingItem.id.split('_')[0],
              access: sharingItem.access
            }
          : null;
      }
    ),
    sharingAccess => sharingAccess
  );
}
