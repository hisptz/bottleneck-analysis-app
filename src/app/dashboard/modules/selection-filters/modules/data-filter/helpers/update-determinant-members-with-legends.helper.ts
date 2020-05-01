import { Legend } from '../../legend-set-configuration/models/legend-set';
import { getDeterminantMemberLegendSet } from './get-determinant-member-legend-set.helper';

export function updateDeterminantMembersWithLegends(
  determinantMembers: any[],
  legendDefinitions: Legend[]
) {
  return (determinantMembers || []).map((determinantMember: any) => {
    return {
      ...determinantMember,
      legendSet: getDeterminantMemberLegendSet(
        determinantMember,
        legendDefinitions
      ),
    };
  });
}
