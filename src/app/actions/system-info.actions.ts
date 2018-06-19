import { Action } from '@ngrx/store';
import { SystemInfo } from '../models/system-info.model';
import { ErrorMessage } from '../models/error-message.model';

export enum SystemInfoActionTypes {
  LoadSystemInfo = '[SystemInfo] Load System info',
  AddSystemInfo = '[SystemInfo] Add System info',
  LoadSystemInfoFail = '[SystemInfo] Load System info fail',
}

export class LoadSystemInfo implements Action {
  readonly type = SystemInfoActionTypes.LoadSystemInfo;
}

export class AddSystemInfo implements Action {
  readonly type = SystemInfoActionTypes.AddSystemInfo;

  constructor(public systemInfo: SystemInfo) {}
}

export class LoadSystemInfoFail implements Action {
  readonly type = SystemInfoActionTypes.LoadSystemInfoFail;

  constructor(public error: ErrorMessage) {}
}

export type SystemInfoActions =
 LoadSystemInfo
 | AddSystemInfo
 | LoadSystemInfoFail;
