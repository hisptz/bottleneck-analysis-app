import { Action } from '@ngrx/store';
import { DashboardSettings } from '../../models/dashboard-settings.model';
import { SystemInfo } from '../../../models';
import { User } from '@iapps/ngx-dhis2-http-client';

export enum DashboardSettingsActionTypes {
  InitializeDashboardSettings = '[DashboardSettings] initialize dashboard settings',
  LoadDashboardSettings = '[DashboardSettings] Load dashboard settings',
  AddDashboardSettings = '[DashboardSettings] Add dashboard settings',
  LoadDashboardSettingsFail = '[DashboardSettings] Load dashboard settings fails'
}

export class InitializeDashboardSettingsAction implements Action {
  readonly type = DashboardSettingsActionTypes.InitializeDashboardSettings;
}

export class LoadDashboardSettingsAction implements Action {
  readonly type = DashboardSettingsActionTypes.LoadDashboardSettings;
  constructor(public currentUser: User, public systemInfo: SystemInfo) {}
}
export class AddDashboardSettingsAction implements Action {
  readonly type = DashboardSettingsActionTypes.AddDashboardSettings;
  constructor(
    public dashboardSettings: DashboardSettings,
    public currentUser: User,
    public systemInfo: SystemInfo
  ) {}
}
export class LoadDashboardSettingsFailAction implements Action {
  readonly type = DashboardSettingsActionTypes.LoadDashboardSettingsFail;
  constructor(public error: any, public currentUser: User) {}
}

export type DashboardSettingsActions =
  | InitializeDashboardSettingsAction
  | LoadDashboardSettingsAction
  | LoadDashboardSettingsFailAction
  | AddDashboardSettingsAction;
