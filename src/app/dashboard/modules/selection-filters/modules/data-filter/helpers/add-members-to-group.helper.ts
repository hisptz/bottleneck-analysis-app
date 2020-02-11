import { Determinant } from 'src/app/models';
import * as _ from 'lodash';

export function addMembersToDeterminants(
  determinants: Determinant[],
  selectedDeterminantId: string,
  members: any[],
  dataDeterminantPreferences: any
): Determinant[] {
  const maximumItemPerDeterminant = dataDeterminantPreferences
    ? dataDeterminantPreferences.maximumItemPerDeterminant
    : (members || []).length;
  let availableMembers = _.differenceBy(
    members,
    _.flatten(
      _.map(determinants, (dataDeterminant: Determinant) =>
        dataDeterminant ? dataDeterminant.members || [] : []
      )
    ),
    'id'
  );

  // Assign to the selected group first until maximum number is reached
  let selectedDeterminant = _.find(determinants || [], [
    'id',
    selectedDeterminantId,
  ]);
  const selectedDeterminantIndex = (determinants || []).indexOf(
    selectedDeterminant
  );

  if (selectedDeterminant) {
    const membersForSelectedDeterminant = _.slice(
      availableMembers,
      0,
      maximumItemPerDeterminant - selectedDeterminant.members.length
    );

    selectedDeterminant = {
      ...selectedDeterminant,
      members: [
        ...selectedDeterminant.members,
        ...membersForSelectedDeterminant,
      ],
    };

    availableMembers = _.differenceBy(
      availableMembers,
      membersForSelectedDeterminant
    );
  }

  return _.map(
    selectedDeterminantIndex > -1
      ? [
          ..._.slice(determinants, 0, selectedDeterminantIndex),
          selectedDeterminant,
          ..._.slice(determinants, selectedDeterminantIndex + 1),
        ]
      : determinants,
    (dataDeterminant: any) => {
      if (!dataDeterminant) {
        return null;
      }
      const membersForCurrentDeterminant = _.slice(
        availableMembers,
        0,
        maximumItemPerDeterminant - (dataDeterminant.members || []).length
      );

      availableMembers = _.differenceBy(
        availableMembers,
        membersForCurrentDeterminant
      );

      console.log(membersForCurrentDeterminant);

      return {
        ...dataDeterminant,
        members: [...dataDeterminant.members, ...membersForCurrentDeterminant],
      };
    }
  );
}
