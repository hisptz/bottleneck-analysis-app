import {Injectable} from '@angular/core';
import {SystemInfoService} from '../../providers/system-info.service';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import {
  ErrorOccurredAction,
  LOAD_SYSTEM_INFO_ACTION, LoadSystemInfoAction,
  SystemInfoLoadedAction
} from '../actions';
@Injectable()
export class SystemInfoEffect {
  constructor(
    private systemInfoService: SystemInfoService,
    private actions$: Actions
  ) {}

  @Effect() systemInfo$: Observable<Action> = this.actions$
    .ofType(LOAD_SYSTEM_INFO_ACTION)
    .switchMap(() => this.systemInfoService.load())
    .map((systemInfo) => new SystemInfoLoadedAction(systemInfo))
    .catch((error) => Observable.of(new ErrorOccurredAction(error)));
}
