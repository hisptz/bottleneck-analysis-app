import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';
import {AngularIndexedDB} from 'angular2-indexeddb';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class OrgUnitService {

  nodes:any[] = null;
  orgunit_levels:any[] = [];
  user_orgunits:any[] = [];
  orgunit_groups:any[] = [];
  initial_orgunits:any[] = [];
  db;

  constructor(private http:Http) {
    this.db = new AngularIndexedDB('water-point', 1);
  }

  userInfo;
  // Get current user information
  getUserInformation(priority = null) {
    return Observable.create((observable)=>{
      if(this.userInfo){
        observable.next(this.userInfo);
        observable.complete();
      }else{
        this.http.get('../../../api/me.json?fields=organisationUnits[id,name,level]')
          .map((response:Response) => response.json())
          .subscribe((data)=>{
            this.userInfo = data;
            observable.next(this.userInfo);
            observable.complete();
          })
      }
    })
  }
  loadedOrganisationUnits={};
  // Get current user information
  getOrgunit(id) {
    return Observable.create((observable)=>{
      if(this.loadedOrganisationUnits[id]){
        observable.next(this.loadedOrganisationUnits[id]);
        observable.complete();
      }else{
        this.http.get('../../../api/organisationUnits/' + id + '.json?fields=id,name,level,ancestors[id,name],parent[id],dataSets[id,categoryCombo[*,categoryOptionCombos[*]],name,periodType,dataElements[id,name,valueType,attributeValues[value,attribute[id,name,optionSet[options[id,name,code]]]]],attributeValues[value,attribute[id,name]]],dataSets[id,name,periodType,openFuturePeriods,dataElements[id,name,valueType,attributeValues[value,attribute[id,name,optionSet[options[id,name,code]]]],optionSet[id,name,options[id,name,code]]]]')
          .map((response:Response) => response.json())
          .subscribe((data)=>{
            this.loadedOrganisationUnits[id] = data;
            observable.next(this.loadedOrganisationUnits[id]);
            observable.complete();
          })
      }
    })
  }
  waterPointConstant
  getWaterPointConstant() {
    return Observable.create((observable)=>{
      observable.next({
        constants:[{value:6}]
      });
      observable.complete();
      /*if(this.waterPointConstant){
        observable.next(this.waterPointConstant);
        observable.complete();
      }else{
        this.http.get('../../../api/constants.json?fields=id,name,value&filter=name:eq:Water Point Parent Level')
          .map((response:Response) => response.json())
          .subscribe((data)=>{
            this.waterPointConstant = data;
            observable.next(this.waterPointConstant);
            observable.complete();
          })
      }*/
    })
  }


  getuserOrganisationUnitsWithHighestlevel(level, userOrgunits) {
    let orgunits = [];
    if (!userOrgunits.hasOwnProperty('dataViewOrganisationUnits')) {
      userOrgunits.organisationUnits.forEach((orgunit) => {
        if (orgunit.level == level) {
          orgunits.push(orgunit.id);
        }
      })
    }
    else {
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
    let level:any;
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
        (data:any) => {
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
    let childrenLevels = "[]";
    for (let i = 1; i < level; i++) {
      childrenLevels = childrenLevels.replace("[]", "[id,name,level,children[]]")
    }
    let new_string = childrenLevels.substring(1);
    new_string = new_string.replace(",children[]]", "");
    return new_string;
  }

  // Get system wide settings
  getOrgunitLevelsInformation() {
    return Observable.create(observer => {
      if (this.orgunit_levels.length != 0) {
        observer.next(this.orgunit_levels);
        observer.complete();
      } else {
        this.http.get('../../../api/organisationUnitLevels.json?fields=id,name,level&order=level:asc')
          .map((response:Response) => response.json())
          .catch(this.handleError)
          .subscribe((levels) => {
              this.orgunit_levels = levels;
              observer.next(this.orgunit_levels);
              observer.complete();
            },
            error=> {
              observer.error("some error occur")
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
        this.http.get('../../../api/organisationUnitGroups.json?fields=id,name&paging=false')
          .map((response:Response) => response.json())
          .catch(this.handleError)
          .subscribe((groups) => {
              this.orgunit_groups = groups.organisationUnitGroups;
              observer.next(this.orgunit_groups);
              observer.complete();
            },
            error=> {
              observer.error("some error occur")
            })
      }
    })
  }

  // Get system wide settings
  getAllOrgunitsForTree(fields) {
    return this.http.get('../../../api/organisationUnits.json?filter=level:eq:1&paging=false&fields=' + fields)
      .map((response:Response) => response.json())
      .catch(this.handleError);
  }

  // Get orgunit for specific
  getAllOrgunitsForTree2(fields = null, orgunits = null) {
    return Observable.create(observer => {
      if (this.nodes != null) {
        observer.next(this.nodes);
        observer.complete();
      } else {
        this.http.get('../../../api/organisationUnits.json?fields=' + fields + '&filter=id:in:[' + orgunits.join(",") + ']&paging=false')
          .map((response:Response) => response.json())
          .catch(this.handleError)
          .subscribe(nodes => {
            this.nodes = nodes.organisationUnits;
            observer.next(this.nodes);
            observer.complete();
          }, error => {
            observer.error("some error occured")
          })
      }
    })

  }

  getAllOrgunitsForTree1(fields = null, orgunits = null) {
    return Observable.create(observer => {
      if (this.nodes != null) {
        observer.next(this.nodes);
        observer.complete();
      } else {
        this.db.createStore(1, (evt) => {
          let objectStore = evt.currentTarget.result.createObjectStore(
            'organisationUnits', {keyPath: "id", autoIncrement: true});
        }).then((results)=> {
          this.db.getAll('organisationUnits').then((organisationUnits) => {
            if (this.areOrganisationUnitsSaveLocally(orgunits,organisationUnits)) {
              observer.next(organisationUnits);
              observer.complete();
            } else {
              this.getOrganisationUnitsSaveLocally(fields,orgunits).subscribe((organisationUnits)=>{
                observer.next(organisationUnits);
                observer.complete();
              })
            }
          }, (error) => {
            console.log("DB Error:", error);
          })
        });
      }
    })

  }

  areOrganisationUnitsSaveLocally(ids,localOrganisationUnits){
    if(localOrganisationUnits.length == ids.length){
      var assumeIsFound = true;
      ids.forEach((orgUnitId)=>{
        var found = false;
        localOrganisationUnits.forEach((orgUnit)=>{
          if(orgUnitId == orgUnit.id){
            found = true;
          }
        })
        if(!found){
          assumeIsFound = false;
        }
      })
      return assumeIsFound
    }else{
      return false;
    }
  }
  getOrganisationUnitsSaveLocally(fields,orgunits) {
    return Observable.create(observer => {
      this.http.get('../../../api/organisationUnits.json?fields=' + fields + '&filter=id:in:[' + orgunits.join(",") + ']&paging=false')
        .map((response:Response) => response.json())
        .catch(this.handleError)
        .subscribe(results => {
          results.organisationUnits.forEach((organisationUnit) => {
            this.db.add('organisationUnits', organisationUnit).then((ret) => {
              // Do something after the value was added
            }, (error) => {

            });
          })
          observer.next(results.organisationUnits);
          observer.complete();
        }, error => {
          observer.error("some error occured")
        })
    })
  }

  // Get initial organisation units to speed up things during loading
  getInitialOrgunitsForTree(orgunits) {
    return Observable.create(observer => {
      if (this.initial_orgunits != null) {
        observer.next(this.initial_orgunits);
        observer.complete();
      } else {
        this.http.get('../../../api/organisationUnits.json?fields=id,level,name,children[id,name,level]&filter=id:in:[' + orgunits.join(",") + ']&paging=false')
          .map((response:Response) => response.json())
          .catch(this.handleError)
          .subscribe(nodes => {
            this.initial_orgunits = nodes.organisationUnits;
            observer.next(this.initial_orgunits);
            observer.complete();
          }, error => {
            observer.error("some error occured")
          })
      }
    });
  }

  // Handling error
  handleError(error:any) {
    return Observable.throw(error);
  }


}


