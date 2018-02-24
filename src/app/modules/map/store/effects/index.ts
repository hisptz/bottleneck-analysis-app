import { LayersEffects } from './layers.effect';
import { VisualizationObjectEffects } from './visualizationObject.effect';
import { AnalyticsEffects } from './analytics.effect';
import { OrganizationUnitGroupSetEffects } from './orgUnitGroupSet.effect';
import { SystemInfoEffects } from './systemInfo.effect';
import { LegendSetEffects } from './legendSet.effect';
import { BaseLayerEffects } from './baseLayer.effect';
import { DataSelectionEffects } from './dataSelection.effect';

export const effects: any[] = [
  VisualizationObjectEffects,
  AnalyticsEffects,
  OrganizationUnitGroupSetEffects,
  SystemInfoEffects,
  LegendSetEffects,
  BaseLayerEffects,
  DataSelectionEffects
];

export * from './layers.effect';
export * from './visualizationObject.effect';
export * from './analytics.effect';
export * from './orgUnitGroupSet.effect';
export * from './systemInfo.effect';
export * from './legendSet.effect';
export * from './baseLayer.effect';
export * from './dataSelection.effect';
