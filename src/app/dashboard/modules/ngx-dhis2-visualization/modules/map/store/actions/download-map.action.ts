import { Action } from '@ngrx/store';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum DownloadMapActionTypes {
  ConvertDomToPng = '[DownloadMap] ConvertDomToPng',
  ConvertDomToPngSuccess = '[DownloadMap] ConvertDomToPng Success',
  ConvertDomToPngFail = '[DownloadMap] ConvertDomToPng Fail',
  SaveFile = '[DownloadMap] Save Map as image'
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 */
export class ConvertDomToPng implements Action {
  readonly type = DownloadMapActionTypes.ConvertDomToPng;

  constructor(public dataElm: string) {}
}

export class SaveFile implements Action {
  readonly type = DownloadMapActionTypes.SaveFile;

  constructor(public fileBlob: any) {}
}

export class ConvertDomToPngFail implements Action {
  readonly type = DownloadMapActionTypes.ConvertDomToPngFail;
  constructor(public error: any) {}
}

export class ConvertDomToPngSuccess implements Action {
  readonly type = DownloadMapActionTypes.ConvertDomToPngSuccess;
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type DownloadMapActions = ConvertDomToPng | SaveFile | ConvertDomToPngFail | ConvertDomToPngSuccess;
