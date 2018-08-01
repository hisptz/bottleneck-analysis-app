import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of ,  Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as visualizationObjectActions from '../actions/visualization-object.action';
import * as fromServices from '../../services';
import { tap ,  map, switchMap, catchError, combineLatest } from 'rxjs/operators';


@Injectable()
export class GeofeatureEffects {
  constructor(private actions$: Actions, private geofeatureService: fromServices.GeoFeatureService) {}
}
