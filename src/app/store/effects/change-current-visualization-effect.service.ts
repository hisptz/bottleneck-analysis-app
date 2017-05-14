import { Injectable } from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Action} from "@ngrx/store";
import {Observable} from "rxjs";
import {
  CurrentVisualizationChangeAction, CHANGE_CURRENT_VISUALIZATION_ACTION
} from "../actions";
import {VisualizationObjectService} from "../../services/visualization-object.service";


@Injectable()
export class ChangeCurrentVisualizationObjectEffectService {

  constructor(
    private actions$: Actions,
    private visualizationObjectService: VisualizationObjectService
  ) { }


  @Effect() visualization$: Observable<Action> = this.actions$
    .ofType(CHANGE_CURRENT_VISUALIZATION_ACTION)
    .switchMap(action => Observable.of(this.visualizationObjectService.updateVisualizationConfigurationAndSettings(action.payload, {})))
    .map(visualizationData => new CurrentVisualizationChangeAction(visualizationData));


}
