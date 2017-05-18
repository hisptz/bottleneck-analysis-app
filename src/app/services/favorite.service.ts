import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Constants} from "./constants";

@Injectable()
export class FavoriteService {

  constructor(
    private http: Http,
    private constant: Constants
  ) { }

  getFavoriteDetails(favoriteType: string, favoriteId: string, skipCall: boolean = false): Observable<any> {
    if(skipCall) {
      return Observable.of({});
    }
    let url = this._getFavoriteUrl(favoriteType, favoriteId);
    if(url == null) {
      return Observable.create(observer => observer.error('Failed to construct call for favorite'))
    }
    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch(error => Observable.throw(new Error(error)))
  }

  private _getFavoriteUrl(favoriteType: string, favoriteId: string): string {
    let url: string = this.constant.api + favoriteType + 's/' + favoriteId + '.json?fields=';
    if(favoriteType == 'map') {
      url += 'id,user,displayName~rename(name),longitude,latitude,zoom,basemap,mapViews[*,columns[dimension,filter,items[dimensionItem,dimensionItemType,displayName]],rows[dimension,filter,items[dimensionItem,dimensionItemType,displayName]],filters[dimension,filter,items[dimensionItem,dimensionItemType,displayName]],dataDimensionItems,program[id,displayName],programStage[id,displayName],legendSet[id,displayName],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,!sortOrder,!topLimit]';
    } else {
      url += '*,dataElementDimensions[dataElement[id,optionSet[id,options[id,name]]]],displayDescription,program[id,name],programStage[id,name],interpretations[*,user[id,displayName],likedBy[id,displayName],comments[lastUpdated,text,user[id,displayName]]],columns[dimension,filter,legendSet,items[id,dimensionItem,dimensionItemType,displayName]],rows[dimension,filter,legendSet,items[id,dimensionItem,dimensionItemType,displayName]],filters[dimension,filter,legendSet,items[id,dimensionItem,dimensionItemType,displayName]],access,userGroupAccesses,publicAccess,displayDescription,user[displayName,dataViewOrganisationUnits],!href,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!organisationUnitGroups,!itemOrganisationUnitGroups,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits';

    }
    return url;

  }

}
