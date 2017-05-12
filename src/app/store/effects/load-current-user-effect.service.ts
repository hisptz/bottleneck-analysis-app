import { Injectable } from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {CurrentUserService} from "../../services/current-user.service";
import {Action} from "@ngrx/store";
import {Observable} from "rxjs";
import {LOAD_CURRENT_USER_ACTION, CurrentUserLoadedAction} from "../actions";


@Injectable()
export class LoadCurrentUserEffectService {

  constructor(
    private actions$: Actions,
    private currentUserService: CurrentUserService
  ) { }

  @Effect() currenUser$: Observable<Action> = this.actions$
    .ofType(LOAD_CURRENT_USER_ACTION)
    .switchMap(() => this.currentUserService.getUserInformation())
    .map(userInfo => new CurrentUserLoadedAction(userInfo));


}
