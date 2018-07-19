import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import {
  SharingItemActionTypes,
  AddSharingItemsAction
} from '../actions/sharing-item.actions';
import { map } from 'rxjs/operators';
import {
  SharingFilterActionTypes,
  AddSharingFilterItemAction
} from '../actions/sharing-filter.actions';

@Injectable()
export class SharingItemEffects {
  @Effect()
  addSharingFilter$: Observable<any> = this.actions$.pipe(
    ofType(SharingFilterActionTypes.AddSharingFilterItem),
    map(
      (action: AddSharingFilterItemAction) =>
        new AddSharingItemsAction(action.sharingItems)
    )
  );
  constructor(private actions$: Actions) {}
}
