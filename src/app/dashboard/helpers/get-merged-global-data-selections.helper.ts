import {
  each as _each,
  filter as _filter,
  find as _find,
  map as _map,
  slice as _slice,
  some as _some,
  uniqBy as _uniqBy
} from 'lodash';

import { VisualizationDataSelection } from '../modules/ngx-dhis2-visualization/models';

export function getMergedGlobalDataSelectionsFromVisualizationLayers(
  dataSelectionsArray: Array<VisualizationDataSelection[]>
) {
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
