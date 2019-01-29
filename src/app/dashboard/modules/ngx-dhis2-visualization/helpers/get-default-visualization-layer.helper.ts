import { VisualizationLayer } from '../models';

export function getDefaultVisualizationLayer(
  currentUser,
  systemInfo
): VisualizationLayer {
  if (!currentUser || !systemInfo) {
    return null;
  }

  const orgUnits =
    currentUser.dataViewOrganisationUnits.length > 0
      ? currentUser.dataViewOrganisationUnits
      : currentUser.organisationUnits;
  return {
    id: '',
    config: {
      name: 'Untitled',
      type: 'COLUMN'
    },
    dataSelections: [
      {
        dimension: 'pe',
        layout: 'rows',
        items: [
          {
            id: systemInfo.analysisRelativePeriod,
            name: systemInfo.analysisRelativePeriod
          }
        ]
      },
      {
        dimension: 'ou',
        layout: 'filters',
        items: [
          {
            id: orgUnits[0] ? orgUnits[0].id : '',
            name: orgUnits[0] ? orgUnits[0].name : ''
          }
        ]
      }
    ]
  };
}
