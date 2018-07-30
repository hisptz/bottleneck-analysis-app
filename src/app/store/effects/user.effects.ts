import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/internal/operators';
import { UserService } from '../../services';
import { User } from '../../models';
import {
  AddCurrentUser,
  LoadCurrentUserFail,
  UserActionTypes
} from '../actions/user.actions';
import { LoadDashboardSettingsAction } from '../actions';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService) {}

  @Effect()
  loadCurrentUser$: Observable<any> = this.actions$.pipe(
    ofType(UserActionTypes.LoadCurrentUser),
    switchMap(() =>
      this.userService.loadCurrentUser().pipe(
        map((user: User) => new AddCurrentUser(user)),
        catchError((error: any) => of(new LoadCurrentUserFail(error)))
      )
    )
  );

  @Effect()
  currentUserLoaded$: Observable<any> = this.actions$.pipe(
    ofType(UserActionTypes.AddCurrentUser),
    map(
      (action: AddCurrentUser) =>
        new LoadDashboardSettingsAction(action.currentUser)
    )
  );
}
