/**
 * Created by mpande on 2/21/18.
 */
import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';
import {catchError, map, tap} from 'rxjs/operators';
import * as filesAction from '../actions/files.action';
import {of} from 'rxjs/observable/of';
import * as fromServices from '../../services';
@Injectable()
export class FilesEffects {

  constructor(private actions$: Actions, private fileService: fromServices.MapFilesService ) {
  }

  @Effect() downloadCSV$ = this.actions$
    .ofType(filesAction.DOWNLOAD_CSV)
    .pipe(
      map(
        (action: filesAction.DownloadCSV) => {
          this.fileService.downloadMapVisualizationAsCSV(action);
        }
      ),
      catchError(error => of(new filesAction.FileDownloadFail(error)))
    );

  @Effect() downloadSuccess$ = this.actions$
    .ofType(filesAction.FILE_DOWNLOAD_SUCCESS)
    .pipe(
      map(
        (action: filesAction.FileDownloadSuccess) => {
          console.log(action);
        }
      )
    );

  // @Effect() downloadGML$ = null;
  // @Effect() downloadSHAPEFILE$ = null;
  // @Effect() downloadJSON$ = null;
}
