import { Injectable } from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Action} from "@ngrx/store";
import {Observable} from "rxjs";
import {LOAD_VISUALIZATION_OBJECT_ACTION, VisualizationObjectLoadedAction} from "../actions";
import {VisualizationObjectService} from "../../services/visualization-object.service";


@Injectable()
export class LoadVisualizationObjectEffectService {

  constructor(
    private actions$: Actions,
    private visualizationObjectService: VisualizationObjectService
  ) { }


  @Effect() visualization$: Observable<Action> = this.actions$
    .ofType(LOAD_VISUALIZATION_OBJECT_ACTION)
    .flatMap(action => this.visualizationObjectService.getSanitizedVisualizationObject(action.payload))
    .map(visualizationData => new VisualizationObjectLoadedAction(visualizationData));


}
