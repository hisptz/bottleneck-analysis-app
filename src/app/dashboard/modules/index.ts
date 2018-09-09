import { SharingFilterModule } from './sharing-filter/sharing-filter.module';
import { FavoriteFilterModule } from './favorite-filter/favorite-filter.module';
import { NgxDhis2VisualizationModule } from './ngx-dhis2-visualization/ngx-dhis2-visualization.module';
import { NgxDhis2SelectionFiltersModule } from './ngx-dhis2-data-selection-filter/ngx-dhis2-selection-filters.module';

export const modules: any[] = [
  NgxDhis2VisualizationModule,
  NgxDhis2SelectionFiltersModule,
  SharingFilterModule,
  FavoriteFilterModule
];
