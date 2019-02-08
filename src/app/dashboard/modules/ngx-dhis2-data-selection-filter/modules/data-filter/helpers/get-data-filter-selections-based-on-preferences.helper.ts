import { filter as _filter, uniq as _uniq } from 'lodash';
import { DataFilterSelection } from '../models';
import { DATA_FILTER_SELECTIONS } from '../constants';
import { DataFilterPreference } from '../model/data-filter-preference.model';
export function getDataFilterSelectionsBasedOnPreferences(
  dataFilterPreferences: DataFilterPreference
) {
  // set data filter selections
  const enabledSelections = _uniq([
    'all',
    ...(dataFilterPreferences ? dataFilterPreferences.enabledSelections : [])
  ]);

  return _filter(
    DATA_FILTER_SELECTIONS || [],
    (dataFilterSelection: DataFilterSelection) => {
      if (!dataFilterPreferences || !dataFilterPreferences.enabledSelections) {
        return true;
      }

      return enabledSelections.indexOf(dataFilterSelection.prefix) !== -1;
    }
  );
}
