import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { SharingFilterService } from '../../services/sharing-filter.service';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import {
  SharingFilterActionTypes,
  LoadSharingFilterItemAction,
  LoadSharingFilterItemFailAction,
  AddSharingFilterItemAction,
  SaveSharingFilterItemAction,
  SaveSharingFilterItemSuccessAction,
  SaveSharingFilterItemFailAction
} from '../actions/sharing-filter.actions';
import {
  tap,
  take,
  switchMap,
  exhaustMap,
  map,
  catchError,
  withLatestFrom
} from 'rxjs/operators';
import { SharingFilterState } from '../reducers/sharing-filter.reducer';
import { getSharingFilterItemById } from '../selectors/sharing-filter.selectors';
import { SharingFilter } from '../../models';
import { getStandardizedSharingItems } from '../../helpers/get-standardized-sharing-items.helper';
import { SharingFilterVm } from '../../models/sharing-filter-vm.model';
import { getSharingObjectForSaving } from '../../helpers';
import {
  SharingItemActionTypes,
  UpsertSharingItemAction,
  RemoveSharingItemAction
} from '../actions/sharing-item.actions';

@Injectable()
export class SharingFilterEffects {
  @Effect({ dispatch: false })
  loadSharingFilterItem$: Observable<any> = this.actions$.pipe(
    ofType(SharingFilterActionTypes.LoadSharingFilterItem),
    tap((action: LoadSharingFilterItemAction) => {
      this.store
        .select(getSharingFilterItemById(action.id))
        .pipe(take(1))
        .subscribe((availableSharingFilterItem: SharingFilterVm) => {
          if (!availableSharingFilterItem) {
            this.sharingFilterService
              .loadSharing(action.id, action.itemType)
              .subscribe(
                (sharingFilterObject: any) => {
                  const sharingItems = getStandardizedSharingItems(
                    sharingFilterObject,
                    action.id
                  );
                  const sharingFilterItem: SharingFilter = {
                    id: action.id,
                    type: action.itemType,
                    user: sharingFilterObject.user
                  };
                  this.store.dispatch(
                    new AddSharingFilterItemAction(
                      sharingFilterItem,
                      sharingItems
                    )
                  );
                },
                error =>
                  of(new LoadSharingFilterItemFailAction(action.id, error))
              );
          }
        });
    })
  );

  @Effect()
  upsertOrRemoveSharingItem$: Observable<any> = this.actions$.pipe(
    ofType(
      SharingItemActionTypes.UpsertSharingItem,
      SharingItemActionTypes.RemoveSharingItem
    ),
    map(
      (action: any) =>
        new SaveSharingFilterItemAction(
          action.sharingFilterId,
          action.sharingType
        )
    )
  );

  @Effect()
  saveSharing$: Observable<any> = this.actions$.pipe(
    ofType(SharingFilterActionTypes.SaveSharingFilterItem),
    exhaustMap((action: SaveSharingFilterItemAction) =>
      this.store.select(getSharingFilterItemById(action.sharingFilterId)).pipe(
        take(1),
        exhaustMap((sharingFilter: SharingFilter) =>
          this.sharingFilterService
            .saveSharing(
              getSharingObjectForSaving(sharingFilter),
              action.sharingType,
              action.sharingFilterId
            )
            .pipe(
              map(() => new SaveSharingFilterItemSuccessAction('')),
              catchError(error =>
                of(new SaveSharingFilterItemFailAction('', error))
              )
            )
        )
      )
    )
  );
  constructor(
    private actions$: Actions,
    private store: Store<SharingFilterState>,
    private sharingFilterService: SharingFilterService
  ) {}
}
