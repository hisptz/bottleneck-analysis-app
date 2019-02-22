import { Action } from '@ngrx/store';

export const TOGGLE_OPEN_VISUALIZATION_LEGEND = '[Map UI] Toggle visualization open';
export const TOGGLE_PIN_VISUALIZATION_LEGEND = '[Map UI] Toggle pin visualization Legend';
export const TOGGLE_VISUALIZATION_FILTER_SECTION = '[Map UI] Toggle filter section';
export const CLOSE_PIN_VISUALIZATION_LEGEND = '[Map UI] Close pinned legend';
export const CLOSE_VISUALIZATION_FILTER_SECTION = '[Map UI] Close filter section legend';
export const INITIALIZE_VISUALIZATION_LEGEND = '[Map UI] Initialize the visualization legend';
export const TOGGLE_DATA_TABLE = '[Map UI] Toggle Datatable visability';
export const FULLSCREEN_OPEN_VISUALIZATION_LEGEND = '[Map UI] Open visualization open fullScreen';
export const VISUALIZATION_FILTER_SECTION_LOADING = '[Map UI] Visualization filter section is loading';
export const VISUALIZATION_FILTER_SECTION_LOADED = '[Map UI] Visualization filter Section Loaded';
export const VISUALIZATION_FILTER_SECTION_JUST_UPDATED = '[Map UI] Visualization filter just updated';
export const VISUALIZATION_FILTER_SECTION_UPDATE_FAIL = '[Map UI] Visualization update fail';

export class ToggleOpenVisualizationLegend implements Action {
  readonly type = TOGGLE_OPEN_VISUALIZATION_LEGEND;
  constructor(public payload: string) {}
}

export class FullScreenOpenVisualizationLegend implements Action {
  readonly type = FULLSCREEN_OPEN_VISUALIZATION_LEGEND;
  constructor(public payload: string) {}
}

export class TogglePinVisualizationLegend implements Action {
  readonly type = TOGGLE_PIN_VISUALIZATION_LEGEND;
  constructor(public payload: string) {}
}

export class ToggleVisualizationLegendFilterSection implements Action {
  readonly type = TOGGLE_VISUALIZATION_FILTER_SECTION;
  constructor(public payload: string) {}
}

export class CloseVisualizationLegend implements Action {
  readonly type = CLOSE_PIN_VISUALIZATION_LEGEND;
  constructor(public payload: string) {}
}

export class CloseVisualizationLegendFilterSection implements Action {
  readonly type = CLOSE_VISUALIZATION_FILTER_SECTION;
  constructor(public payload: string) {}
}

export class VisualizationLegendFilterSectionLoading implements Action {
  readonly type = VISUALIZATION_FILTER_SECTION_LOADING;
  constructor(public payload: string) {}
}

export class VisualizationLegendFilterSectionLoaded implements Action {
  readonly type = VISUALIZATION_FILTER_SECTION_LOADED;
  constructor(public payload: string) {}
}

export class VisualizationLegendFilterSectionJustUpdated implements Action {
  readonly type = VISUALIZATION_FILTER_SECTION_JUST_UPDATED;
  constructor(public payload: string) {}
}

export class VisualizationLegendFilterSectionUpdateFail implements Action {
  readonly type = VISUALIZATION_FILTER_SECTION_UPDATE_FAIL;
}

export class InitiealizeVisualizationLegend implements Action {
  readonly type = INITIALIZE_VISUALIZATION_LEGEND;
  constructor(public payload: string) {}
}

export class ToggleDataTable implements Action {
  readonly type = TOGGLE_DATA_TABLE;
  // TODO: add Legend Set data casting;
  constructor(public payload: any) {}
}

// action types
export type VisualizationLegendAction =
  | ToggleOpenVisualizationLegend
  | TogglePinVisualizationLegend
  | CloseVisualizationLegend
  | ToggleVisualizationLegendFilterSection
  | CloseVisualizationLegendFilterSection
  | InitiealizeVisualizationLegend
  | ToggleDataTable
  | FullScreenOpenVisualizationLegend
  | VisualizationLegendFilterSectionLoading
  | VisualizationLegendFilterSectionLoaded
  | VisualizationLegendFilterSectionJustUpdated
  | VisualizationLegendFilterSectionUpdateFail;
