import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable, of, forkJoin, throwError } from 'rxjs';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';

import { VisualizationDataSelection } from '../models';
import {
  getAnalyticsUrl,
  getSanitizedAnalytics,
  getStandardizedAnalyticsObject,
  getMergedAnalytics,
  getAnalyticsWithGrouping
} from '../helpers';
import { mergeMap, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(private http: NgxDhis2HttpClientService) {}

  getAnalytics(
    dataSelections: VisualizationDataSelection[],
    layerType: string,
    config?: any
  ) {
    return this.getCombinedAnalytics(dataSelections, layerType, config).pipe(
      map((analytics: any) =>
        getAnalyticsWithGrouping(dataSelections, analytics)
      )
    );
  }

  getCombinedAnalytics(
    dataSelections: VisualizationDataSelection[],
    layerType: string,
    config?: any
  ) {
    return forkJoin(
      this._getNormalAnalytics(
        this._getDataSelectionByDxType(
          dataSelections || [],
          'FUNCTION_RULE',
          false
        ),
        layerType,
        config
      ),
      this._getFunctionAnalytics(
        this._getDataSelectionByDxType(dataSelections || [], 'FUNCTION_RULE')
      )
    ).pipe(
      map((analyticsResults: any[]) =>
        getMergedAnalytics(
          this._getSanitizedAnalyticsArray(analyticsResults, dataSelections)
        )
      )
    );
  }

  private _getNormalAnalytics(
    dataSelections: VisualizationDataSelection[],
    layerType: string,
    config?: any
  ): Observable<any> {
    const analyticsUrl = !layerType
      ? getAnalyticsUrl(dataSelections, 'thematic', config)
      : layerType === 'thematic' || layerType === 'event'
        ? getAnalyticsUrl(dataSelections, layerType, config)
        : '';
    return analyticsUrl !== ''
      ? this.http.get(analyticsUrl).pipe(
          mergeMap(
            (analytics: any) =>
              analytics.count && analytics.count < 2000
                ? this.http.get(
                    getAnalyticsUrl(dataSelections, layerType, {
                      ...config,
                      eventClustering: false
                    })
                  )
                : of(analytics)
          )
        )
      : of(null);
  }

  private _getFunctionAnalytics(dataSelections: VisualizationDataSelection[]) {
    if (dataSelections.length === 0) {
      return of(null);
    }
    const ouObject = _.find(dataSelections, ['dimension', 'ou']);
    const ouValue = ouObject
      ? _.join(_.map(ouObject.items, item => item.id), ';')
      : '';

    const peObject = _.find(dataSelections, ['dimension', 'pe']);
    const peValue = peObject
      ? _.join(_.map(peObject.items, item => item.id), ';')
      : '';

    const dxObject = _.find(dataSelections, ['dimension', 'dx']);

    if (!dxObject || dxObject.items.length === 0) {
      return of(null);
    }

    const functionAnalyticsPromises = _.map(dxObject.items, (dxItem: any) => {
      let functionPromise = of(null);
      try {
        const functionRuleJson =
          typeof dxItem.ruleDefinition.json === 'string'
            ? JSON.parse(dxItem.ruleDefinition.json)
            : dxItem.ruleDefinition.json;
        functionPromise = this._runFunction(
          {
            pe: peValue,
            ou: ouValue,
            rule: {
              ...dxItem.ruleDefinition,
              json: functionRuleJson
            },
            success: result => {},
            error: error => {},
            progress: progress => {}
          },
          dxItem.functionObject ? dxItem.functionObject.functionString : ''
        );
      } catch (e) {
        functionPromise = throwError({
          status: '400',
          statusText: 'Internal server error',
          error: 'Something is wrong with your rule definition, ' + e
        });
      }
      return functionPromise;
    });

    return forkJoin(functionAnalyticsPromises).pipe(
      map((analyticsResults: any[]) =>
        getMergedAnalytics(
          this._getSanitizedAnalyticsArray(analyticsResults, dataSelections)
        )
      )
    );
  }

  private _getSanitizedAnalyticsArray(
    analyticsResults: any[],
    dataSelections: VisualizationDataSelection[]
  ) {
    return _.map(
      _.filter(
        analyticsResults,
        analyticsResultObject => analyticsResultObject !== null
      ),
      analytics =>
        getSanitizedAnalytics(
          getStandardizedAnalyticsObject(analytics, true),
          dataSelections
        )
    );
  }

  private _runFunction(
    functionParameters: any,
    functionString: string
  ): Observable<any> {
    return new Observable(observer => {
      if (!this._isError(functionString)) {
        try {
          functionParameters.error = error => {
            observer.error(error);
          };
          functionParameters.success = results => {
            observer.next(results);
            observer.complete();
          };
          functionParameters.progress = results => {};
          const execute = Function('parameters', functionString);

          execute(functionParameters);
        } catch (e) {
          observer.error(e.stack);
          observer.complete();
        }
      } else {
        observer.error({ message: 'Errors in the code.' });
        observer.complete();
      }
    });
  }

  private _isError(code) {
    let successError = false;
    let errorError = false;
    let progressError = false;
    const value = code
      .split(' ')
      .join('')
      .split('\n')
      .join('')
      .split('\t')
      .join('');
    if (value.indexOf('parameters.success(') === -1) {
      successError = true;
    }
    if (value.indexOf('parameters.error(') === -1) {
      errorError = true;
    }
    if (value.indexOf('parameters.progress(') === -1) {
      progressError = true;
    }
    return successError || errorError;
  }

  private _getDataSelectionByDxType(
    dataSelections: VisualizationDataSelection[],
    dxType: string,
    useEqualOperator: boolean = true
  ): VisualizationDataSelection[] {
    const dxDataSelection: VisualizationDataSelection = _.find(dataSelections, [
      'dimension',
      'dx'
    ]);

    const dxDataSelectionSelectionIndex = dataSelections.indexOf(
      dxDataSelection
    );
    const dxItems = _.filter(
      dxDataSelection ? dxDataSelection.items : [],
      item => (useEqualOperator ? item.type === dxType : item.type !== dxType)
    );

    return dxDataSelectionSelectionIndex !== -1
      ? dxItems.length > 0
        ? [
            ..._.slice(dataSelections, 0, dxDataSelectionSelectionIndex),
            {
              ...dxDataSelection,
              items: dxItems
            },
            ..._.slice(dataSelections, dxDataSelectionSelectionIndex + 1)
          ]
        : []
      : dataSelections;
  }
}
