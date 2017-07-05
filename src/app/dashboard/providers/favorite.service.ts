import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClientService} from '../../providers/http-client.service';
import * as _ from 'lodash';

@Injectable()
export class FavoriteService {

  constructor(
    private http: HttpClientService
  ) { }

  private _getFavoriteUrl(apiRootUrl: string, favoriteType: string, favoriteId: string): string {
    let url: string = apiRootUrl + favoriteType + 's/' + favoriteId + '.json?fields=';
    if (favoriteType === 'map') {
      url += 'id,user,displayName,longitude,latitude,zoom,basemap,mapViews[*,dataElementDimensions[dataElement[id,name,optionSet[id,options[id,name]]]],columns[dimension,filter,items[dimensionItem,dimensionItemType,displayName]],rows[dimension,filter,items[dimensionItem,dimensionItemType,displayName]],filters[dimension,filter,items[dimensionItem,dimensionItemType,displayName]],dataDimensionItems,program[id,displayName],programStage[id,displayName],legendSet[id,displayName],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,!sortOrder,!topLimit]';
    } else {
      url += '*,dataElementDimensions[dataElement[id,name,optionSet[id,options[id,name]]]],displayDescription,program[id,name],programStage[id,name],interpretations[*,user[id,displayName],likedBy[id,displayName],comments[lastUpdated,text,user[id,displayName]]],columns[dimension,filter,legendSet,items[id,dimensionItem,dimensionItemType,displayName]],rows[dimension,filter,legendSet,items[id,dimensionItem,dimensionItemType,displayName]],filters[dimension,filter,legendSet,items[id,dimensionItem,dimensionItemType,displayName]],access,userGroupAccesses,publicAccess,displayDescription,user[displayName,dataViewOrganisationUnits],!href,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!organisationUnitGroups,!itemOrganisationUnitGroups,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits';
    }
    return url;
  }

  getFavorite(visualizationDetails: any): Observable<any> {
    const visualizationObjectFavorite: any = visualizationDetails.visualizationObject.details.favorite;
    if (!visualizationObjectFavorite.id) {
      visualizationDetails.favorite = {};
      return Observable.of(visualizationDetails);
    }
    return Observable.create(observer => {
      this.http.get(this._getFavoriteUrl(
        visualizationDetails.apiRootUrl,
        visualizationObjectFavorite.type,
        visualizationObjectFavorite.id)
      ).subscribe((favorite: any) => {
        visualizationDetails.favorite = favorite;
        observer.next(visualizationDetails);
        observer.complete();
      }, error => observer.error());
    });
  }

  getVisualizationFiltersFromFavorite(favoriteDetails: any) {
    const favorite: any = favoriteDetails.favorite;
    const filters: any[] = [];
    if (favorite.mapViews) {
      favorite.mapViews.forEach((view: any) => {
        const filterObject: any = {
          id: view.id,
          filters: []
        };

        filterObject.filters.push(this._getDimensionValues(view.rows));
        filterObject.filters.push(this._getDimensionValues(view.columns));
        filterObject.filters.push(this._getDimensionValues(view.filters));
        filterObject.filters = this._compileDimensionFilters(filterObject.filters);
        filters.push(filterObject)
      })

    } else {
      const filterObject: any = {
        id: favorite.id,
        filters: []
      };

      filterObject.filters.push(this._getDimensionValues(favorite.rows));
      filterObject.filters.push(this._getDimensionValues(favorite.columns));
      filterObject.filters.push(this._getDimensionValues(favorite.filters));
      filterObject.filters = this._compileDimensionFilters(filterObject.filters);
      filters.push(filterObject)
    }
    favoriteDetails.filters = filters;
    return favoriteDetails;
  }

  private _getDimensionValues(dimensionArray: any) {
    const dimensionValues: any[] = [];
    if (dimensionArray) {
      dimensionArray.forEach((dimensionObject: any) => {
        if (dimensionObject.dimension !== 'dy') {
          const dimensionValue = {
            name: '',
            value: ''
          };

          /**
           * Get dimension name
           */
          let dimensionName = dimensionObject.dimension;
          dimensionName += dimensionObject.legendSet ? '-' + dimensionObject.legendSet.id : '';
          dimensionValue.name = dimensionName;

          /**
           * Get dimension value
           */
          if (dimensionObject.items) {
            const itemValues = dimensionObject.items.map(item => { return item.dimensionItem ? item.dimensionItem : ''}).join(';')
            dimensionValue.value = itemValues !== '' ? itemValues : dimensionObject.filter ? dimensionObject.filter : '';
          }
          dimensionValues.push(dimensionValue)
        }
      });
    }

    return dimensionValues;
  }

  private _compileDimensionFilters(filters) {
    const compiledFilters: any[] = [];
    if (filters) {
      filters.forEach((filter: any) => {
        filter.forEach(filterValue => {
          compiledFilters.push(filterValue)
        })
      })
    }
    return compiledFilters;
  }

  getVisualizationLayoutFromFavorite(favoriteDetails: any) {
    const favorite: any = favoriteDetails.favorite;
    const layouts: any[] = [];
    if (favorite) {
      if (favorite.mapViews) {
        favorite.mapViews.forEach(view => {
          const layout = {
            rows: this._getDimensionLayout(view.rows, view.dataElementDimensions),
            columns: this._getDimensionLayout(view.columns, view.dataElementDimensions),
            filters: this._getDimensionLayout(view.filters, view.dataElementDimensions)
          }
          layouts.push({id: view.id, layout: layout})
        })
      } else {
        const layout = {
          rows: this._getDimensionLayout(favorite.rows, favorite.dataElementDimensions),
          columns: this._getDimensionLayout(favorite.columns, favorite.dataElementDimensions),
          filters: this._getDimensionLayout(favorite.filters, favorite.dataElementDimensions)
        }
        layouts.push({id: favorite.id, layout: layout})
      }
      favoriteDetails.layouts = layouts;
    }
    return favoriteDetails;
  }

  private _getDimensionLayout(dimensionArray, dataElementDimensions) {
    const newDimensionLayoutArray: any[] = [];
    if (dimensionArray) {
      dimensionArray.forEach(dimensionObject => {
        if (dimensionObject.dimension !== 'dy') {
          const layoutValue = dimensionObject.dimension;
          const layoutName = this._getLayoutName(layoutValue, dataElementDimensions);
          newDimensionLayoutArray.push({name: layoutName, value: layoutValue});
        }
      })
    }
    return newDimensionLayoutArray;
  }

  private _getLayoutName(layoutValue, dataElementDimensions) {
    switch (layoutValue) {
      case 'ou': {
        return 'Organisation Unit'
      }

      case 'pe': {
        return 'Period'
      }

      case 'dx': {
        return 'Data'
      }

      default: {
        let layoutName = '';
        if (dataElementDimensions) {
          const compiledDimension = dataElementDimensions.map(dataElementDimension => { return dataElementDimension.dataElement});
          const layoutObject = _.find(compiledDimension, ['id', layoutValue]);
          if (layoutObject) {
            layoutName = layoutObject.name;
          }
        }
        return layoutName !== '' ? layoutName : 'Category Option';
      }
    }

  }

  loadAdditionalOptions(visualizationDetails) {
    const favoriteId = visualizationDetails.favorite.id;
    return Observable.create(observer => {
      if (favoriteId) {
        this.http.get(visualizationDetails.apiRootUrl + 'dataStore/favoriteOptions/' + visualizationDetails.favorite.id)
          .subscribe(favoriteOptions => {
            visualizationDetails.favorite = Object.assign({}, visualizationDetails.favorite, favoriteOptions);
            observer.next(visualizationDetails);
            observer.complete();
          }, () => {
            observer.next(visualizationDetails);
            observer.complete();
          })
      } else {
        observer.next(visualizationDetails);
        observer.complete();
      }
    });
  }

  private _updateAdditionalOptions(visualizationDetails) {
    const favoriteOptions = visualizationDetails.favoriteOptions;
    return Observable.create(observer => {
      if (favoriteOptions) {
        this.http.get(visualizationDetails.apiRootUrl + 'dataStore/favoriteOptions/' + favoriteOptions.id)
          .subscribe(() => {
            this.http.put(visualizationDetails.apiRootUrl + 'dataStore/favoriteOptions/' + favoriteOptions.id, favoriteOptions)
              .subscribe(() => {
                observer.next(visualizationDetails);
                observer.complete();
              }, error => observer.error(error))
          }, () => {
            this.http.post(visualizationDetails.apiRootUrl + 'dataStore/favoriteOptions/' + favoriteOptions.id, favoriteOptions)
              .subscribe(() => {
                observer.next(visualizationDetails);
                observer.complete();
              }, error => observer.error(error))
          });
      } else {
        observer.next(visualizationDetails);
        observer.complete();
      }
    })
  }

  createOrUpdateFavorite(visualizationDetails: any) {
    return Observable.create(observer => {
      const visualizationSettings = visualizationDetails.visualizationObject.layers.map(layer => { return layer.settings});
      const additionalOptionsArray = this._prepareAdditionalFavoriteOptions(visualizationSettings);
      /**
       * Update favorites
       */
      Observable.forkJoin(
        visualizationSettings.map(setting => { return Observable.of(setting)})
      ).subscribe(() => {
        /**
         * Update additional options
         */
        Observable.forkJoin(
          additionalOptionsArray.map(option => { return this._updateAdditionalOptions({
            apiRootUrl: visualizationDetails.apiRootUrl,
            favoriteOptions: option
          })})
        ).subscribe(() => {
          visualizationDetails.updateSuccess = true;
          observer.next(visualizationDetails);
          observer.complete()
        }, error => {
          visualizationDetails.updateSuccess = false;
          visualizationDetails.updateError = error;
          observer.next(visualizationDetails);
          observer.complete()
        })
      }, favoriteError => {
        visualizationDetails.updateSuccess = false;
        visualizationDetails.updateError = favoriteError;
        observer.next(visualizationDetails);
        observer.complete()
      })
    })
  }

  private _prepareAdditionalFavoriteOptions(visualizationSettings) {
    const favoriteOptionArray: any[] = [];
    if (visualizationSettings) {
      visualizationSettings.forEach(visualizationSetting => {
        const favoriteOption: any = {
          id: visualizationSetting.id,
          useMultipleAxis: visualizationSetting.useMultipleAxis,
          selectedChartTypes: visualizationSetting.selectedChartTypes
        };

        favoriteOptionArray.push(favoriteOption)
      })
    }
    return favoriteOptionArray
  }

}
