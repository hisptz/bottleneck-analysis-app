import * as _ from 'lodash';
import { getSharingAccessesBasedOnAccessType } from './get-sharing-accesses-based-access-type.helper';
export function getSharingObjectForSaving(sharingFilter: any) {
  const publicAccesObject = _.filter(
    sharingFilter.sharingItems || [],
    sharingItem => sharingItem.id.indexOf('publicAccess') !== -1
  )[0];

  const externalAccessObject = _.filter(
    sharingFilter.sharingItems || [],
    sharingItem => sharingItem.id.indexOf('externalAccess') !== -1
  )[0];

  return {
    id: sharingFilter.id,
    publicAccess: publicAccesObject ? publicAccesObject.access : '--------',
    externalAccess: externalAccessObject
      ? externalAccessObject.access
      : '--------',
    userGroupAccesses: getSharingAccessesBasedOnAccessType(
      sharingFilter.sharingItems,
      'userGroup'
    ),
    userAccesses: getSharingAccessesBasedOnAccessType(
      sharingFilter.sharingItems,
      'user'
    )
  };
}
