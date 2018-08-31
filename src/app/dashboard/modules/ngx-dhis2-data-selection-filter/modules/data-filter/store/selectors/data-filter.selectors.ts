import { createSelector } from '@ngrx/store';

import * as fromFunctionSelectors from './function.selectors';
import * as fromIndicatorGroupSelectors from './indicator-group.selectors';
import * as fromModels from '../models';

export const getDataFilterObject = createSelector(
  fromFunctionSelectors.getFunctions,
  fromIndicatorGroupSelectors.getIndicatorGroups,
  (functions: any[], indicatorGroups: any[]) => {
    return { functions, indicatorGroups };
  }
);
