import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import 'rxjs/add/operator/switchMap';
import {CurrentUserLoadedAction, ErrorOccurredAction, LOAD_CURRENT_USER_ACTION} from '../actions';
import {CurrentUserService} from '../../providers/current-user.service';

@Injectable()
export class CurrentUserEffect {
  constructor(
    private actions$: Actions,
    private currentUserService: CurrentUserService
  ) {}

  @Effect() currentUser$: Observable<Action> = this.actions$
    .ofType(LOAD_CURRENT_USER_ACTION)
    .switchMap(action => this.currentUserService.getUserInformation(action.payload))
    .map(userInfo => new CurrentUserLoadedAction(userInfo))
    .catch((error) => Observable.of(new ErrorOccurredAction(error)));
}
