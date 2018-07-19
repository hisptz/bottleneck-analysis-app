import * as _ from 'lodash';
export function getStandardizedSharingItems(
  sharingObject: any,
  sharingFilterId: string
) {
  return sharingObject
    ? [
        {
          id: `externalAccess_${sharingFilterId}`,
          name: 'External Access',
          isExternal: true,
          access: sharingObject.externalAccess,
          sharingFilterId
        },
        {
          id: `publicAccess_${sharingFilterId}`,
          name:
            sharingObject.publicAccess === '--------' ? 'Only me' : 'Everyone',
          isPublic: true,
          access: sharingObject.publicAccess,
          sharingFilterId
        },
        ...getSharingItemsBasedOnType(
          sharingObject.userAccesses,
          sharingFilterId,
          'user'
        ),
        ...getSharingItemsBasedOnType(
          sharingObject.userGroupAccesses,
          sharingFilterId,
          'userGroup'
        )
      ]
    : [];
}

function getSharingItemsBasedOnType(
  sharingArray: any[],
  sharingFilterId: string,
  type: string
) {
  return sharingArray
    ? _.map(sharingArray, (sharingObject: any) => {
        return {
          ...sharingObject,
          id: `${sharingObject.id}_${sharingFilterId}`,
          type: type,
          sharingFilterId
        };
      })
    : [];
}
