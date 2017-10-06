import {Injectable} from '@angular/core';
import {OrgUnitTreeConfiguration} from '../models/orgunit-tree-configuration.model';
import {IActionMapping, TREE_ACTIONS} from 'angular-tree-component';
import {OrgUnitModel} from '../models/orgunit.model';
import {Observable} from 'rxjs/Observable';
import {HttpClientService} from '../../providers/http-client.service';

@Injectable()
export class OrgunitService {

  private _orgUnitDataStore: any;

  constructor(private http: HttpClientService) {
    this._orgUnitDataStore = {
      nodes: [],
      orgUnitLevels: [],
      userOrgUnits: [],
      orgUnitGroups: [],
      initialOrgUnits: []
    };
  }

  getSanitizedOrgUnitTreeConfiguration(orgUnitTreeConfiguration: OrgUnitTreeConfiguration): OrgUnitTreeConfiguration {
    const newOrgUnitTreeConfiguration: OrgUnitTreeConfiguration = orgUnitTreeConfiguration;
    let orgUnitTreeOptions = null;

    /**
     * Get orgunit tree options
     */
    if (newOrgUnitTreeConfiguration.multiple) {
      if (newOrgUnitTreeConfiguration.multipleKey === 'none') {
        const actionMapping: IActionMapping = {
          mouse: {
            dblClick: TREE_ACTIONS.TOGGLE_EXPANDED,
            click: (node, tree, $event) => TREE_ACTIONS.TOGGLE_SELECTED_MULTI(node, tree, $event)
          }
        };

        orgUnitTreeOptions = {actionMapping};

      } else if (newOrgUnitTreeConfiguration.multipleKey === 'control') {
        const actionMapping: IActionMapping = {
          mouse: {
            click: (node, tree, $event) => {
              $event.ctrlKey
                ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(node, tree, $event)
                : TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event);
            }
          }
        };
        orgUnitTreeOptions = {actionMapping};

      } else if (newOrgUnitTreeConfiguration.multipleKey === 'shift') {
        const actionMapping: IActionMapping = {
          mouse: {
            click: (node, tree, $event) => {
              $event.shiftKey
                ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(node, tree, $event)
                : TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event);
            }
          }
        };
        orgUnitTreeOptions = {actionMapping};
      }

    } else {
      const actionMapping: IActionMapping = {
        mouse: {
          dblClick: TREE_ACTIONS.TOGGLE_EXPANDED,
          click: (node, tree, $event) => TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event)
        }
      };
      orgUnitTreeOptions = {actionMapping};
    }
    newOrgUnitTreeConfiguration.orgUnitTreeOptions = Object.assign({}, orgUnitTreeOptions);

    return newOrgUnitTreeConfiguration;
  }

  getSanitizedOrgUnitModel(orgUnitModel: OrgUnitModel, apiRootUrl: string): Observable<OrgUnitModel> {
    const newOrgUnitModel = Object.assign({}, orgUnitModel);
    return Observable.create(observer => {

      /**
       * Get organisation unit level information
       */
      this._getOrgUnitLevelsInformation(apiRootUrl)
        .subscribe((orgUnitLevels: any[]) => {
          newOrgUnitModel.orgUnitLevels = Object.assign([], orgUnitLevels);

          /**
           * Get organisation unit group information
           */
          this._getOrgUnitGroups(apiRootUrl)
            .subscribe((orgUnitGroups: any[]) => {
              newOrgUnitModel.orgUnitGroups = Object.assign([], orgUnitGroups);

              /**
               * Get user organisation unit
               */
              this._getSanitizedUserOrgUnits(orgUnitModel.type, apiRootUrl)
                .subscribe((userOrgUnits: any[]) => {
                  newOrgUnitModel.userOrgUnits = Object.assign([], userOrgUnits);

                  /**
                   * Get selected Organisation unit if selection mode is user organisation unit
                   */
                  if (orgUnitModel.selectionMode === 'USER_ORG_UNIT') {
                    newOrgUnitModel.selectedOrgUnits = Object.assign([], userOrgUnits);
                  }

                  /**
                   * Get highest user organisation unit level
                   */
                  const highestUserOrgUnitLevel: number = this._getUserHighestOrgUnitLevel(userOrgUnits);

                  /**
                   * Get level for generating orgUnit url fields
                   */
                  const urlLevel: number = newOrgUnitModel.orgUnitLevels.length - (highestUserOrgUnitLevel - 1);

                  /**
                   * Get organisation units for the tree
                   */
                  this._getOrgUnits(
                    this._generateUrlBasedOnLevels(urlLevel),
                    this._getUserOrganisationUnitsWithHighestLevel(userOrgUnits, highestUserOrgUnitLevel),
                    apiRootUrl
                  ).subscribe((orgUnits: any[]) => {
                    newOrgUnitModel.orgUnits = Object.assign([], orgUnits);
                    observer.next(newOrgUnitModel);
                    observer.complete();
                  }, (orgUnitsError: string) => observer.error(orgUnitsError));
                }, (userOrgUnitError: string) => observer.error(userOrgUnitError));
            }, (orgUnitGroupError: string) => observer.error(orgUnitGroupError));
        }, (orgUnitLevelError: string) => observer.error(orgUnitLevelError));
    });
  }

  private _getOrgUnitLevelsInformation(apiRootUrl: string): Observable<any[]> {
    return Observable.create(observer => {
      if (this._orgUnitDataStore.orgUnitLevels.length > 0) {
        observer.next(this._orgUnitDataStore.orgunitLevels);
        observer.complete();
      } else {
        this.http.get(apiRootUrl + 'organisationUnitLevels.json?fields=id,name,level&order=level:asc&paging=false')
          .subscribe((levelResponse: any) => {
              this._orgUnitDataStore.orgUnitLevels = Object.assign([], levelResponse.organisationUnitLevels);
              observer.next(levelResponse.organisationUnitLevels);
              observer.complete();
            },
            error => {
              observer.error(error);
            });
      }
    });
  }

  private _getOrgUnitGroups(apiRootUrl: string): Observable<any[]> {
    return Observable.create(observer => {
      if (this._orgUnitDataStore.orgUnitGroups.length > 0) {
        observer.next(this._orgUnitDataStore.orgUnitGroups);
        observer.complete();
      } else {
        this.http.get(apiRootUrl + 'organisationUnitGroups.json?fields=id,name&paging=false')
          .subscribe((groupResponse: any) => {
              this._orgUnitDataStore.orgUnitGroups = Object.assign([], groupResponse.organisationUnitGroups);
              observer.next(groupResponse.organisationUnitGroups);
              observer.complete();
            },
            error => {
              observer.error(error);
            });
      }
    });
  }

  private _getUserOrgUnits(orgUnitType: string, apiRootUrl: string): Observable<any> {
    return orgUnitType === 'report' ?
      this.http.get(apiRootUrl + 'me.json?fields=dataViewOrganisationUnits[id,name,level],organisationUnits[id,name,level]') :
      this.http.get(apiRootUrl + 'me.json?fields=organisationUnits[id,name,level]');
  }

  private _getSanitizedUserOrgUnits(orgUnitType: string, apiRootUrl: string): Observable<any[]> {
    return Observable.create(observer => {
      if (this._orgUnitDataStore.userOrgUnits.length > 0) {
        observer.next(this._orgUnitDataStore.userOrgUnits);
        observer.complete();
      } else {
        this._getUserOrgUnits(orgUnitType, apiRootUrl)
          .subscribe((userOrgUnitResponse: any) => {
            let orgUnits = [];
            if (!userOrgUnitResponse.hasOwnProperty('dataViewOrganisationUnits')) {
              orgUnits = Object.assign([], userOrgUnitResponse.organisationUnits);
            } else {
              if (userOrgUnitResponse.dataViewOrganisationUnits.length === 0) {
                orgUnits = Object.assign([], userOrgUnitResponse.organisationUnits);
              } else {
                orgUnits = Object.assign([], userOrgUnitResponse.dataViewOrganisationUnits);
              }
            }

            /**
             * Save obtained user organisation unit to the data store
             */
            this._orgUnitDataStore.userOrgUnits = Object.assign([], orgUnits);

            /**
             * Also return user organisation unit
             */
            observer.next(orgUnits);
            observer.complete();
          }, (userOrgUnitError: string) => observer.error(userOrgUnitError));
      }
    });
  }

  private _getUserHighestOrgUnitLevel(userOrgUnits: any[]): number {
    return userOrgUnits.map((userOrgUnit: any) => userOrgUnit.level)
      .reduce((a, b) => Math.min(a, b));
  }

  private _getUserOrganisationUnitsWithHighestLevel(userOrgUnits: any[], highestLevel: number): any[] {
    return userOrgUnits.filter((userOrgUnit: any) => userOrgUnit.level === highestLevel)
      .map((orgUnit: any) => orgUnit.id);
  }

  private _generateUrlBasedOnLevels(level: number) {
    let childrenLevels = '[]';
    for (let i = 1; i < level + 1; i++) {
      childrenLevels = childrenLevels.replace('[]', '[id,name,level,children[]]');
    }
    let url = childrenLevels.substring(1);
    url = url.replace(',children[]]', '');
    return url;
  }

  private _getOrgUnits(urlFields: string, orgUnits: any[], apiRootUrl: string) {
    return Observable.create(observer => {
      if (this._orgUnitDataStore.nodes.length > 0) {
        observer.next(this._orgUnitDataStore.nodes);
        observer.complete();
      } else {
        this.http.get(apiRootUrl + 'organisationUnits.json?fields=' + urlFields + '&filter=id:in:[' + orgUnits.join(',') + ']&paging=false')
          .subscribe((nodes: any) => {
            this._orgUnitDataStore.nodes = Object.assign([], nodes.organisationUnits);
            observer.next(nodes.organisationUnits);
            observer.complete();
          }, (error: string) => observer.error(error));
      }
    });

  }
}
