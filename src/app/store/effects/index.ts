import { RouterEffects } from './router.effects';
import { SystemInfoEffects } from './system-info.effects';
import { UserEffects } from './user.effects';
import { LegendSetEffects } from './legend-set.effects';
import { RootCauseDataEffects } from './root-cause-data.effects';
import { DeterminantEffects } from './determinant.effects';

export const effects: any[] = [
  RouterEffects,
  SystemInfoEffects,
  UserEffects,
  LegendSetEffects,
  DeterminantEffects,
  RootCauseDataEffects,
];
