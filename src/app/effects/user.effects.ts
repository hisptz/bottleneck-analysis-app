import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs/index';
import { catchError, map, switchMap } from 'rxjs/internal/operators';

import * as fromUserActions from '../actions/user.actions';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { LoadCurrentUserFail } from '../actions/user.actions';


@Injectable()
export class UserEffects {

  constructor(private actions$: Actions, private userService: UserService) {
  }

  @Effect()
  loadCurrentUser$: Observable<any> = this.actions$.pipe(ofType(fromUserActions.UserActionTypes.LoadCurrentUser),
    switchMap(() => this.userService.loadCurrentUser().
      pipe(map((user: User) => new fromUserActions.LoadCurrentUserSuccess({user})),
        catchError((error: any) => of(new LoadCurrentUserFail({error}))))));
}
