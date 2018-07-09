import { RouterEffects } from './router.effects';
import { SystemInfoEffects } from './system-info.effects';
import { UserEffects } from './user.effects';

export const effects: any[] = [RouterEffects, SystemInfoEffects, UserEffects];
export * from './router.effects';
export * from './system-info.effects';
export * from './user.effects';
