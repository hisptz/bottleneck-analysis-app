import {
  map as _map,
  each as _each,
  find as _find,
  slice as _slice,
  uniqBy as _uniqBy,
  some as _some,
  filter as _filter
} from 'lodash';
import {
  VisualizationLayer,
  VisualizationDataSelection
} from '../modules/ngx-dhis2-visualization/models';
import { getSelectionDimensionsFromAnalytics } from '../modules/ngx-dhis2-visualization/helpers';

export function getMergedGlobalDataSelections(
  visualizationLayers: VisualizationLayer[],
  retrieveFromAnalytics?: boolean
) {
  const dataSelectionsArray: Array<VisualizationDataSelection[]> = _map(
    visualizationLayers,
    (visualizationLayer: VisualizationLayer) =>
      retrieveFromAnalytics && visualizationLayer.analytics
        ? getSelectionDimensionsFromAnalytics(visualizationLayer.analytics)
        : visualizationLayer.dataSelections
  );

  let mergedDataSelections = [];

  _each(dataSelectionsArray, (dataSelections: VisualizationDataSelection[]) => {
    _each(dataSelections, (dataSelection: VisualizationDataSelection) => {
      const availableDataSelection = _find(mergedDataSelections, [
        'dimension',
        dataSelection.dimension
      ]);
      if (availableDataSelection) {
        const availableDataSelectionIndex = mergedDataSelections.indexOf(
          availableDataSelection
        );
        mergedDataSelections = [
          ..._slice(mergedDataSelections, 0, availableDataSelectionIndex),
          {
            ...availableDataSelection,
            ...dataSelection,
            items: _uniqBy(
              [...availableDataSelection.items, ...dataSelection.items],
              'id'
            )
          },
          ..._slice(mergedDataSelections, availableDataSelectionIndex + 1)
        ];
      } else {
        mergedDataSelections = [...mergedDataSelections, dataSelection];
      }
    });
  });

  return _map(
    mergedDataSelections,
    (dataSelection: VisualizationDataSelection) => {
      switch (dataSelection.dimension) {
        case 'ou':
          const OuItemsContainUserOrgUnits = _some(
            dataSelection.items,
            (item: any) => item.id.indexOf('USER') !== -1
          );

          return {
            ...dataSelection,
            items: OuItemsContainUserOrgUnits
              ? _filter(dataSelection.items, (item: any) => {
                  return item.id !== 'USER_ORGUNIT';
                })
              : dataSelection.items
          };
        default:
          return dataSelection;
      }
    }
  );
}
