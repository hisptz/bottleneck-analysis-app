import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import {
  SharingSearchListActionTypes,
  AddSharingSearchListAction,
  LoadSharingSearchListFailAction
} from '../actions/sharing-search-list.actions';
import { switchMap, map, catchError, tap, take } from 'rxjs/operators';
import { SharingFilterService } from '../../services/sharing-filter.service';
import { Store } from '@ngrx/store';
import { SharingSearchList } from '../../models/sharing-search-list.model';
import { getSharingSearchList } from '../reducers/sharing-search-list.reducer';

@Injectable()
export class SharingSearchListEffects {
  @Effect({ dispatch: false })
  loadSharingSearchList$: Observable<any> = this.actions$.pipe(
    ofType(SharingSearchListActionTypes.LoadSharingSearchList),
    tap(() => {
      this.store
        .select(getSharingSearchList)
        .pipe(take(1))
        .subscribe((sharingSearchList: SharingSearchList[]) => {
          if (sharingSearchList.length === 0) {
            this.sharingFilterService.loadSharingListForSearch().subscribe(
              (sharingSearchListResponse: any[]) => {
                this.store.dispatch(
                  new AddSharingSearchListAction(sharingSearchListResponse)
                );
              },
              (error: any) => {
                this.store.dispatch(new LoadSharingSearchListFailAction(error));
              }
            );
          }
        });
    })
  );
  constructor(
    private actions$: Actions,
    private store: Store<SharingSearchList>,
    private sharingFilterService: SharingFilterService
  ) {}
}
