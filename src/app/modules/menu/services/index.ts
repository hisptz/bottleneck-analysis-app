import { SystemStateService } from './system-state.service';
import { MenuService } from './menu.service';

export const services: any[] = [MenuService, SystemStateService];

export * from './menu.service';
export * from './system-state.service';
