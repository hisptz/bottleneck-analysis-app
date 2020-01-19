import * as _ from 'lodash';
import { Determinant } from 'src/app/models';

export function addDefaultDeterminantInList(
  determinants: Determinant[],
  newGroupId: string
): Determinant[] {
  return [
    ..._.map(determinants, (determinant: Determinant) => {
      return { ...determinant, current: false };
    }),
    {
      id: newGroupId,
      name: 'Untitled',
      color: '#000000',
      members: [],
    },
  ];
}
