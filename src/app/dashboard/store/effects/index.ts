import { EffectsModule } from '@ngrx/effects';

import { InterventionEffects } from './intervention.effects';
import { DashboardEffects } from './dashboard.effects';
import { DashboardVisualizationEffects } from './dashboard-visualization.effects';
import { DashboardGroupsEffects } from './dashboard-groups.effects';
import { DashboardSettingsEffects } from './dashboard-settings.effects';
import { InterventionArchiveEffects } from './intervention-archive.effects';

export const effects = EffectsModule.forFeature([
  DashboardEffects,
  InterventionEffects,
  DashboardVisualizationEffects,
  DashboardGroupsEffects,
  DashboardSettingsEffects,
  InterventionArchiveEffects,
]);
