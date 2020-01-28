import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, tap, withLatestFrom } from 'rxjs/operators';

import { SharingSearchList } from '../../models/sharing-search-list.model';
import { SharingFilterService } from '../../services/sharing-filter.service';
import {
  AddSharingSearchListAction,
  LoadSharingSearchListFailAction,
  SharingSearchListActionTypes,
  LoadSharingSearchListAction,
  InitiateLoadingSharingListAction,
} from '../actions/sharing-search-list.actions';
import { getSharingSearchList } from '../reducers/sharing-search-list.reducer';
import { getSharingSearchInitiated } from '../selectors/sharing-search-list.selectors';

@Injectable()
export class SharingSearchListEffects {
  @Effect({ dispatch: false })
  loadSharingSearchList$: Observable<any> = this.actions$.pipe(
    ofType(SharingSearchListActionTypes.LoadSharingSearchList),
    withLatestFrom(this.store.select(getSharingSearchInitiated)),
    tap(([{}, initiated]: [LoadSharingSearchListAction, boolean]) => {
      if (!initiated) {
        this.store.dispatch(new InitiateLoadingSharingListAction());

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
    })
  );
  constructor(
    private actions$: Actions,
    private store: Store<SharingSearchList>,
    private sharingFilterService: SharingFilterService
  ) {}
}
