import { Intervention } from '../models';
import * as _ from 'lodash';
import { generateUid } from 'src/app/helpers';

export function getSanitizedInterventions(
  interventions: any[]
): Intervention[] {
  return _.map(interventions, (intervention: any) => {
    return {
      ...intervention,
      id: intervention.id || generateUid()
    };
  });
}
