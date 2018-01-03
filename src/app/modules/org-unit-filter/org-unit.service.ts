import {Injectable} from '@angular/core';
import {HttpClientService} from '../../services/http-client.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class OrgUnitService {

  nodes: any[] = null;
  orgunit_levels: any[] = [];
  user_orgunits: any[] = [];
  orgunit_groups: any[] = [];
  initial_orgunits: any[] = [];
  private _userInfo: any = null;

  constructor(private httpClient: HttpClientService) {
  }

  // Get current user information
  getUserInformation(priority = null) {
    return new Observable(observer => {
      if (this._userInfo !== null) {
        observer.next(this._userInfo);
        observer.complete();
      } else {
        const userInfoCall: Observable<any> = !priority ?
          this.httpClient.get('me.json?fields=dataViewOrganisationUnits[id,name,level],organisationUnits[id,name,level]') :
          this.httpClient.get('me.json?fields=organisationUnits[id,name,level]');

        userInfoCall.subscribe((userInfo: any) => {
          this._userInfo = Object.assign({}, userInfo);
          observer.next(this._userInfo);
          observer.complete();
        }, error => {
          console.log(error);
        });
      }
    });
  }


  getuserOrganisationUnitsWithHighestlevel(level, userOrgunits) {
    const orgunits = [];
    if (!userOrgunits.hasOwnProperty('dataViewOrganisationUnits')) {
      userOrgunits.organisationUnits.forEach((orgunit) => {
        if (orgunit.level === level) {
          orgunits.push(orgunit.id);
        }
      });
    } else {
      if (userOrgunits.dataViewOrganisationUnits.length == 0) {
        userOrgunits.organisationUnits.forEach((orgunit) => {
          if (orgunit.level == level) {
            orgunits.push(orgunit.id);
          }
        })
      } else {
        level = userOrgunits.dataViewOrganisationUnits[0].level;
        userOrgunits.dataViewOrganisationUnits.forEach((orgunit) => {
          if (orgunit.level == level) {
            orgunits.push(orgunit.id);
          }
        })
      }
    }
    return orgunits;
  }

  /**
   * get the highest level among organisation units that user belongs to
   * @param userOrgunits
   * @returns {any}
   */
  getUserHighestOrgUnitlevel(userOrgunits) {
    let level: any;
    let orgunits = [];
    if (!userOrgunits.hasOwnProperty('dataViewOrganisationUnits')) {
      level = userOrgunits.organisationUnits[0].level;
      userOrgunits.organisationUnits.forEach((orgunit) => {
        if (orgunit.level <= level) {
          level = orgunit.level;
        }
      })
    } else {
      if (userOrgunits.dataViewOrganisationUnits.length == 0) {
        level = userOrgunits.organisationUnits[0].level;
        userOrgunits.organisationUnits.forEach((orgunit) => {
          if (orgunit.level <= level) {
            level = orgunit.level;
          }
        })
      } else {
        level = userOrgunits.dataViewOrganisationUnits[0].level;
        userOrgunits.dataViewOrganisationUnits.forEach((orgunit) => {
          if (orgunit.level <= level) {
            level = orgunit.level;
          }
        })
      }

    }
    return level;
  }

  /**
   * get the list of user orgunits as an array
   * @param userOrgunits
   * @returns {any}
   */
  getUserOrgUnits(userOrgunits) {
    let orgunits = [];
    if (!userOrgunits.hasOwnProperty('dataViewOrganisationUnits')) {
      userOrgunits.organisationUnits.forEach((orgunit) => {
        orgunits.push(orgunit);
      })
    } else {
      if (userOrgunits.dataViewOrganisationUnits.length == 0) {
        userOrgunits.organisationUnits.forEach((orgunit) => {
          orgunits.push(orgunit);
        })
      } else {
        userOrgunits.dataViewOrganisationUnits.forEach((orgunit) => {
          orgunits.push(orgunit);
        })
      }
    }
    return orgunits;
  }

  prepareOrgunits(priority = null) {
    this.getOrgunitLevelsInformation()
      .subscribe(
        (data: any) => {
          this.orgunit_levels = data.organisationUnitLevels;
          this.getUserInformation(priority).subscribe(
            userOrgunit => {
              this.user_orgunits = this.getUserOrgUnits(userOrgunit);
              let level = this.getUserHighestOrgUnitlevel(userOrgunit);
              let all_levels = data.pager.total;
              let orgunits = this.getuserOrganisationUnitsWithHighestlevel(level, userOrgunit);
              let use_level = parseInt(all_levels) - (parseInt(level) - 1);
              let fields = this.generateUrlBasedOnLevels(use_level);
              this.getAllOrgunitsForTree1(fields, orgunits).subscribe(
                items => {
                  //noinspection TypeScriptUnresolvedVariable
                  this.nodes = items.organisationUnits;
                }
              )
            }
          )
        }
      );
    this.getOrgunitGroups().subscribe(groups => {//noinspection TypeScriptUnresolvedVariable
      this.orgunit_groups = groups.organisationUnitGroups
    });
  }


  // Generate Organisation unit url based on the level needed
  generateUrlBasedOnLevels(level) {
    let childrenLevels = '[]';
    for (let i = 1; i < level + 1; i++) {
      childrenLevels = childrenLevels.replace('[]', '[id,name,level,children[]]')
    }
    let new_string = childrenLevels.substring(1);
    new_string = new_string.replace(',children[]]', '');
    return new_string;
  }

  // Get system wide settings
  getOrgunitLevelsInformation() {
    return Observable.create(observer => {
      if (this.orgunit_levels.length != 0) {
        observer.next(this.orgunit_levels);
        observer.complete();
      } else {
        this.httpClient.get('organisationUnitLevels.json?fields=id,name,level&order=level:asc')
          .subscribe((levels) => {
              this.orgunit_levels = levels;
              observer.next(this.orgunit_levels);
              observer.complete();
            },
            error => {
              observer.error('some error occur')
            })
      }
    })
  }

  // Get organisation unit groups information
  getOrgunitGroups() {
    return Observable.create(observer => {
      if (this.orgunit_groups.length != 0) {
        observer.next(this.orgunit_groups);
        observer.complete();
      } else {
        this.httpClient.get('organisationUnitGroups.json?fields=id,name&paging=false')
          .subscribe((groups: any) => {
              this.orgunit_groups = groups.organisationUnitGroups;
              observer.next(this.orgunit_groups);
              observer.complete();
            },
            error => {
              observer.error('some error occur')
            })
      }
    })
  }

  // Get system wide settings
  getAllOrgunitsForTree(fields) {
    return this.httpClient.get('organisationUnits.json?filter=level:eq:1&paging=false&fields=' + fields);
  }

  // Get orgunit for specific
  getAllOrgunitsForTree1(fields = null, orgunits = null) {
    return Observable.create(observer => {
      if (this.nodes != null) {
        observer.next(this.nodes);
        observer.complete();
      } else {
        this.httpClient.get('organisationUnits.json?fields=' + fields + '&filter=id:in:[' + orgunits.join(',') + ']&paging=false')
          .subscribe((nodes: any) => {
            this.nodes = nodes.organisationUnits;
            observer.next(this.nodes);
            observer.complete();
          }, error => {
            observer.error('some error occured')
          })
      }
    })

  }

  // Get initial organisation units to speed up things during loading
  getInitialOrgunitsForTree(orgunits) {
    return Observable.create(observer => {
      if (this.initial_orgunits != null) {
        observer.next(this.initial_orgunits);
        observer.complete();
      } else {
        this.httpClient.get('organisationUnits.json?fields=id,name,level,children[id,name]&' +
          'filter=id:in:[' + orgunits.join(',') + ']&paging=false')
          .subscribe((nodes: any) => {
            this.initial_orgunits = nodes.organisationUnits;
            observer.next(this.initial_orgunits);
            observer.complete();
          }, error => {
            observer.error('some error occured');
          })
      }
    });
  }


}


