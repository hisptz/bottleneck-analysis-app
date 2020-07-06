import { VisualizationDataSelection } from '../modules/ngx-dhis2-visualization/models';
import { User } from '@iapps/ngx-dhis2-http-client';

export function getInterventionArchiveId(
  dataSelections: VisualizationDataSelection[],
  interventionId: string,
  currentUser: User
) {
  const selectionObject = { pe: '', ou: '' };
  (dataSelections || []).forEach((selection: any) => {
    if (selection.dimension === 'dx') {
      return undefined;
    }

    switch (selection.dimension) {
      case 'pe': {
        selectionObject.pe = selectionObject[
          selection.dimension
        ] = selection.items.map((item) => item.id).join(';');
        break;
      }
      case 'ou': {
        selectionObject.ou = selectionObject[
          selection.dimension
        ] = selection.items
          .map((item) => {
            if (item.id.indexOf('USER') !== -1) {
              return currentUser.organisationUnits
                .map((orgUnit) => orgUnit.id)
                .join(';');
            }

            if (
              item.id.indexOf('LEVEL') !== -1 ||
              item.id.indexOf('GROUP') !== -1
            ) {
              return undefined;
            }

            return item.id;
          })
          .filter((ouItem) => ouItem)
          .join(';');
        break;
      }
      default:
        break;
    }
  });

  return `${interventionId}_${selectionObject.ou}_${selectionObject.pe}`;
}
