import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {HttpClientService} from '../../services/http-client.service';
import * as currentUser from './current-user.actions';
import 'rxjs/add/operator/switchMap';
import {Observable} from 'rxjs/Observable';
import {CurrentUserState} from './current-user.state';
import 'rxjs/add/operator/map';

@Injectable()
export class CurrentUserEffects {

  @Effect()
  loadCurrentUser$ = this.actions$
    .ofType<currentUser.LoadAction>(currentUser.CurrentUserActions.LOAD)
    .switchMap(() => this._load())
    .map((currentUserObject: CurrentUserState) => new currentUser.LoadSuccessAction(currentUserObject));

  constructor(private actions$: Actions,
              private httpClient: HttpClientService) {
  }

  private _load(): Observable<any> {
    return this.httpClient.get(`me.json?fields=id,name,displayName,created,lastUpdated,email,
    dataViewOrganisationUnits[id,name,level],userCredentials[username]`);
  }
}
