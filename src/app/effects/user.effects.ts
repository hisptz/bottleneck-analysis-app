import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs/index';
import { catchError, map, switchMap } from 'rxjs/internal/operators';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { AddCurrentUser, LoadCurrentUserFail, UserActionTypes } from '../actions/user.actions';


@Injectable()
export class UserEffects {

  constructor(private actions$: Actions, private userService: UserService) {
  }

  @Effect()
  loadCurrentUser$: Observable<any> = this.actions$.pipe(ofType(UserActionTypes.LoadCurrentUser),
    switchMap(() => this.userService.loadCurrentUser().
      pipe(map((user: User) => new AddCurrentUser(user)),
        catchError((error: any) => of(new LoadCurrentUserFail(error))))));
}
