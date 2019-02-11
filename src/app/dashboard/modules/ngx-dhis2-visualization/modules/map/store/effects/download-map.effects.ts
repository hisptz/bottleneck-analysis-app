import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';
import {
  DownloadMapActionTypes,
  DownloadMapActions,
  ConvertDomToPng,
  SaveFile,
  ConvertDomToPngFail,
  ConvertDomToPngSuccess
} from '../actions/download-map.action';
import { downloadFile, dataURItoBlob, convertToPng } from '../../utils/export-map-to-image';

@Injectable()
export class DownloadMapEffects {
  @Effect()
  convertDomToPng$: Observable<Action> = this.actions$.pipe(
    ofType<DownloadMapActions>(DownloadMapActionTypes.ConvertDomToPng),
    switchMap((action: ConvertDomToPng) => {
      const { dataElm } = action;
      const mapElId = `map-view-port-${dataElm}`;
      const mapEl = document.getElementById(mapElId);
      const newoptions = {
        width: mapEl.clientWidth,
        height: mapEl.clientHeight
      };
      return from(convertToPng(mapEl, newoptions));
    }),
    map(dataUri => new SaveFile(dataURItoBlob(dataUri))),
    catchError(error => of(new ConvertDomToPngFail(error)))
  );

  @Effect()
  saveFileAsImage$: Observable<any> = this.actions$.pipe(
    ofType<DownloadMapActions>(DownloadMapActionTypes.SaveFile),
    switchMap((action: SaveFile) => {
      const { fileBlob } = action;
      const filename = `ards-map-${Math.random()
        .toString(36)
        .substring(7)}.png`;
      downloadFile(fileBlob, filename);
      return of(null);
    }),
    map(dataUri => new ConvertDomToPngSuccess()),
    catchError(error => of(new ConvertDomToPngFail(error)))
  );

  constructor(private actions$: Actions) {}
}
