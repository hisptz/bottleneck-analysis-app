import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Indicator} from '../model/indicator';
import {DataElement} from '../model/data-element';
import {CategoryCombo} from '../model/category-combo';
import {OrganisationUnit} from '../model/organisation-unit';
import {
  CATEGORY_COMBOS_KEY,
  DATAELEMENT_GROUP_KEY, DATAELEMENT_KEY, DATASET_KEY, INDICATOR_GROUP_KEY, INDICATOR_KEY,
  LocalStorageService, ORGANISATION_UNIT_KEY, PROGRAM_KEY
} from './local-storage.service';
import {HttpClientService} from '../../providers/http-client.service';
import {DataSet} from '../model/dataset';
import {DataelementGroup} from '../model/dataelement-group';
import {IndicatorGroup} from '../model/indicator-group';
import {AutoGrowing} from '../model/auto-growing';

@Injectable()
export class DataService {

  metaData = {
    organisationUnits: [],
    dataElements: [],
    indicators: [],
    dataElementGroups: [],
    indicatorGroups: [],
    categoryOptions: [],
    dataSets: [],
  };

  constructor(private http: Http, private localDbService: LocalStorageService,private httpService:HttpClientService ) { }

  getIndicators(): Observable<Indicator[]>{
    return this.http.get("../../../api/indicators.json?fields=id,name,dataSets[periodType]&paging=false")
      .map(res => res.json().indicators || [])
  }

  getDataElements(): Observable<DataElement[]>{
    // return this.http.get("../../../api/dataElements.json?fields=id,name,valueType,categoryCombo,dataSetElements[dataSet[periodType]&paging=false&filter=domainType:eq:AGGREGATE")
    return this.http.get("../../../api/dataElements.json?fields=,id,name,valueType,categoryCombo&paging=false&filter=domainType:eq:AGGREGATE&filter=valueType:ne:TEXT&filter=valueType:ne:LONG_TEXT")
    // return this.http.get("../../../api/dataElements.json?fields=id,name,categoryCombo,dataSetElements[dataSet[periodType]&pageSize=400")
      .map(res => res.json().dataElements || [])
  }

  getDataSets(): Observable<DataSet[]>{
    return this.http.get("../../../api/dataSets.json?paging=false&fields=id,name")
      .map(res => res.json().dataSets || [])
  }

  getCategoryCombos(): Observable<CategoryCombo[]>{
    return this.http.get("../../../api/categoryCombos.json?fields=id,name,categoryOptionCombos[id,name]&paging=false")
      .map(res => res.json().categoryCombos || [])

  }

  getOrganisationUnits(): Observable<OrganisationUnit[]>{
    return this.http.get("../../../api/organisationUnits.json?fields=id,name,children,parent,path&paging=false")
      .map(res => res.json().organisationUnits || [])
  }

  getDataElementGroups(): Observable<DataelementGroup[]>{
    return this.http.get("../../../api/dataElementGroups.json?paging=false&fields=id,name,dataElements[id,name,categoryCombo]")
      .map(res => res.json().dataElementGroups || [])
  }

  getIndicatorGroups(): Observable<IndicatorGroup[]>{
    return this.http.get("../../../api/indicatorGroups.json?paging=false&fields=id,name,indicators[id,name]")
      .map(res => res.json().indicatorGroups || [])
  }

  getPrograms(): Observable<AutoGrowing[]>{
    return this.http.get("../../../api/programs.json?paging=false&fields=id,name,programType")
      .map(res => res.json().programs || [])

  }


  initiateData(){
    return Observable.forkJoin(
      this.getDataFromLocalDatabase(DATAELEMENT_KEY),
      this.getDataFromLocalDatabase(INDICATOR_KEY),
      this.getDataFromLocalDatabase(INDICATOR_GROUP_KEY),
      this.getDataFromLocalDatabase(DATAELEMENT_GROUP_KEY),
      this.getDataFromLocalDatabase(DATASET_KEY),
      this.getDataFromLocalDatabase(CATEGORY_COMBOS_KEY),
      this.getDataFromLocalDatabase(PROGRAM_KEY)
    );

  }

  getFunctions(){
    return new Observable((observ)=>{
      this.http.get("../../../api/dataStore/functions").map(res=>res.json()).subscribe((results)=>{
        let observable = [];
        results.forEach((id)=>{
          observable.push(this.http.get("../../../api/dataStore/functions/" + id).map(res=>res.json()))
        });
        Observable.forkJoin(observable).subscribe((responses:any)=>{
          let functions = [];
          responses.forEach((response,index)=>{
            functions.push(response);
          });
          observ.next(functions);
          observ.complete();
        },(error)=>{

        })
      },(error)=>{

      })
    })

  }

  // Get the data-elements mappings to match with functions
  getAllMappings(){
    return new Observable((observ)=>{
      this.http.get("../../../api/dataStore/functionMapper1").map(res=>res.json()).subscribe((results)=>{
        observ.next(results);
        observ.complete();
      },(error)=>{
        observ.error();
      })
    })

  }

  // Get the data-elements mappings to match with functions
  getASytemInfo(){
    return new Observable((observ)=>{
      this.http.get("../../../api/system/info.json").map(res=>res.json()).subscribe((results)=>{
        observ.next(results);
        observ.complete();
      },(error)=>{
        observ.error();
      })
    })

  }

  // get a list of data-elements to hide because of grey fields in data-elements/otherwise
  getHiddenDataElements() :any{
    return new Observable((observ)=>{
      this.http.get("../../../api/dataStore/dataElementsHiddenInPivot").map(res=>res.json()).subscribe((results)=>{
        observ.next(results);
        observ.complete();
      },(error)=>{
        observ.error();
      })
    })

  }

  getMapping(id): any{
    return new Observable((observ)=>{
      this.http.get("../../../api/dataStore/functionMapper1/" + id).map(res=>res.json()).subscribe((results)=>{
        observ.next(results);
        observ.complete();
      },(error)=>{
        observ.error();
      })
    })
  }

  /**
   * This function will be used to return all needed metadata either from offline or if not available the online
   * @param key
   * @returns {any}
   */
  getDataFromLocalDatabase( key:string ): Observable<any>{
    return Observable.create(observer => {
      this.localDbService.getAll(key).subscribe(
        (items) => {
          if( items.length != 0){
            observer.next( items );
            observer.complete();
          }else{
            let dataStream$ = null;
            switch (key){
              case DATAELEMENT_KEY:
                dataStream$ = this.getDataElements();
                break;
              case DATASET_KEY:
                dataStream$ = this.getDataSets();
                break;
              case ORGANISATION_UNIT_KEY:
                dataStream$ = this.getOrganisationUnits();
                break;
              case CATEGORY_COMBOS_KEY:
                dataStream$ = this.getCategoryCombos();
                break;
              case INDICATOR_KEY:
                dataStream$ = this.getIndicators();
                break;
              case INDICATOR_GROUP_KEY:
                dataStream$ = this.getIndicatorGroups();
                break;
              case DATAELEMENT_GROUP_KEY:
                dataStream$ = this.getDataElementGroups();
                break;
              case PROGRAM_KEY:
                dataStream$ = this.getPrograms()
                break;
              default:
                console.error("The key passed is not recognized");
                break;

            }
            dataStream$.subscribe(
              (data) => {
                data.forEach((val) => {
                  this.localDbService.add(key, val).subscribe((v) => null);
                });
                observer.next( data );
                observer.complete();
              },
              (error) => observer.error(error)
            )
          }
        },
        error => observer.error(error)
      )
    });
  }

/**
   * This function will be used to return all needed metadata either from offline or if not available the online
   * @param key
   * @returns {any}
   */
  addDataToLocalDatabase( key:string ): Observable<any>{
    return Observable.create(observer => {
      this.localDbService.getAll(key).subscribe(
        (items) => {
            let dataStream$ = null;
            switch (key){
              case DATAELEMENT_KEY:
                dataStream$ = this.getDataElements();
                break;
              case DATASET_KEY:
                dataStream$ = this.getDataSets();
                break;
              case ORGANISATION_UNIT_KEY:
                dataStream$ = this.getOrganisationUnits();
                break;
              case CATEGORY_COMBOS_KEY:
                dataStream$ = this.getCategoryCombos();
                break;
              case INDICATOR_KEY:
                dataStream$ = this.getIndicators();
                break;
              case INDICATOR_GROUP_KEY:
                dataStream$ = this.getIndicatorGroups();
                break;
              case DATAELEMENT_GROUP_KEY:
                dataStream$ = this.getDataElementGroups();
                break;
              case PROGRAM_KEY:
                dataStream$ = this.getPrograms();
                break;
              default:
                console.error("The key passed is not recognized");
                break;

            }
            dataStream$.subscribe(
              (data) => {
                data.forEach((val) => {
                  this.localDbService.add(key, val).subscribe((v) => null,error=> {});
                });
                observer.next( data );
                observer.complete();
              },
              (error) => observer.error(error)
            )
        },
        error => observer.error(error)
      )
    });
  }




}
