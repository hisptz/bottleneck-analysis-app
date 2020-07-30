import { createSelector } from '@ngrx/store';

import { AppState } from '../reducers/indicators.reducers';

const indicatorsList = (state: AppState) => state.indicatorsList;
const programIndicatorsList = (state: AppState) => state.programIndicatorsList;
const allIndicators = (state: AppState) => state.allIndicators.indicators;
const indicatorGroups = (state: AppState) => state.indicatorGroups;
const programIndicatorGroups = (state: AppState) =>
  state.programIndicatorGroups;

const allProgramIndicators = (state: AppState) =>
  state.allIndicators.programIndicators;

export const getListOfIndicators = createSelector(
  indicatorsList,
  (indicatorsListObject: any) => indicatorsListObject
);

export const getListOfProgramIndicators = createSelector(
  programIndicatorsList,
  (programIndicators: any) => programIndicators
);

export const getAllIndicators = createSelector(
  allIndicators,
  (allIndicatorsObject: any) => allIndicatorsObject
);

export const getIndicatorGroups = createSelector(
  indicatorGroups,
  (indicatorGroupsObj: any) => indicatorGroupsObj
);

export const getAllProgramIndicators = createSelector(
  allProgramIndicators,
  (programIndicators: any) => programIndicators
);

export const getProgramIndicatorGroups = createSelector(
  programIndicatorGroups,
  (programIndicatorGroupList: any) => programIndicatorGroupList
);
