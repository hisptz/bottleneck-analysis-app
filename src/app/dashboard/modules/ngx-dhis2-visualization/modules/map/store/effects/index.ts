import { LayersEffects } from './layers.effect';
import { VisualizationObjectEffects } from './visualizationObject.effect';
import { AnalyticsEffects } from './analytics.effect';
import { OrganizationUnitGroupSetEffects } from './orgUnitGroupSet.effect';
import { SystemInfoEffects } from './systemInfo.effect';
import { LegendSetEffects } from './legendSet.effect';
import { BaseLayerEffects } from './baseLayer.effect';
import { FilesEffects } from './files.effects';
import { DataSelectionEffects } from './dataSelection.effect';
import { LegendSetConfigEffects } from './legend-set-config.effects';
import { DownloadMapEffects } from './download-map.effects';

export const effects: any[] = [
  VisualizationObjectEffects,
  AnalyticsEffects,
  OrganizationUnitGroupSetEffects,
  SystemInfoEffects,
  LegendSetEffects,
  BaseLayerEffects,
  DataSelectionEffects,
  BaseLayerEffects,
  FilesEffects,
  LegendSetConfigEffects,
  DownloadMapEffects
];

export * from './layers.effect';
export * from './visualizationObject.effect';
export * from './analytics.effect';
export * from './orgUnitGroupSet.effect';
export * from './systemInfo.effect';
export * from './legendSet.effect';
export * from './baseLayer.effect';
export * from './files.effects';
export * from './dataSelection.effect';
export * from './legend-set-config.effects';
export * from './download-map.effects';
