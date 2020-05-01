import * as _ from 'lodash';
import { Legend } from '../../legend-set-configuration/models/legend-set';
export function getDeterminantMemberLegendSet(
  determinantMember: any,
  legendDefinitions: Legend[]
) {
  const legendSet = determinantMember ? determinantMember.legendSet : null;

  if (!legendSet) {
    return {
      id: determinantMember.id,
      name: determinantMember.name,
      legends: legendDefinitions,
    };
  }

  const newLegends: Legend[] = (legendDefinitions || []).map(
    (legendDefinition: Legend) => {
      const legend = _.find(legendSet.legends, ['id', legendDefinition.id]);
      return legend
        ? {
            ...legend,
            color: legendDefinition.color,
            name: legendDefinition.name,
          }
        : legendDefinition;
    }
  );

  return {
    id: determinantMember.id,
    name: determinantMember.name,
    legends: newLegends,
  };
}
