import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action, Store} from '@ngrx/store';
import 'rxjs/add/operator/switchMap';
import {
  CurrentUserLoadedAction, ErrorOccurredAction, LOAD_CURRENT_USER_ACTION, LoadCurrentUserAction,
  SYSTEM_INFO_LOADED_ACTION
} from '../actions';
import {CurrentUserService} from '../../providers/current-user.service';
import {ApplicationState} from '../application-state';

@Injectable()
export class CurrentUserEffect {

  @Effect() systemInfoLoaded$: Observable<Action> = this.actions$
    .ofType(SYSTEM_INFO_LOADED_ACTION)
    .withLatestFrom(this.store)
    .switchMap(([action, store]) => Observable.of(store.uiState.systemInfo.apiRootUrl))
    .map((apiRootUrl) => new LoadCurrentUserAction(apiRootUrl));

  @Effect() currentUser$: Observable<Action> = this.actions$
    .ofType(LOAD_CURRENT_USER_ACTION)
    .switchMap(action => this.currentUserService.getUserInformation(action.payload))
    .map(userInfo => new CurrentUserLoadedAction(userInfo))
    .catch((error) => Observable.of(new ErrorOccurredAction(error)));

  constructor(
    private actions$: Actions,
    private currentUserService: CurrentUserService,
    private store: Store<ApplicationState>
  ) {}
}
