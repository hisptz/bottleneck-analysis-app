import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {AngularIndexedDB} from '../../providers/angular2-indexeddb';

export const DATAELEMENT_KEY =        'data-elements';
export const DATASET_KEY =        'data-sets';
export const ORGANISATION_UNIT_KEY =  'organisation-units';
export const INDICATOR_KEY =          'indicators';
export const CATEGORY_COMBOS_KEY =    'category-options';
export const DATAELEMENT_GROUP_KEY =  'data-element-groups';
export const INDICATOR_GROUP_KEY =    'indicator-groups';
export const PROGRAM_KEY =    'programs';

@Injectable()
export class LocalStorageService {
  db;
  constructor() {

    this.db = new AngularIndexedDB('dhis2metadata', 1);
  }

  /**
   * Initiate the store
   * @returns {Promise<any>}
   * @private
   */
  _initiateStoreObjects(){
    return this.db.createStore(2, (evt) => {
      //Create data element table
      this.createStore(evt, DATAELEMENT_KEY, "id");

      //create indicator key
      this.createStore(evt, INDICATOR_KEY, "id");

      //Create category combos table
      this.createStore(evt, CATEGORY_COMBOS_KEY, "id");

      //Create Organisation Unit table
      this.createStore(evt, ORGANISATION_UNIT_KEY, "id");

      //create data eLement group  table
      this.createStore(evt, DATAELEMENT_GROUP_KEY, "id");

      //create indicator group table
      this.createStore(evt, INDICATOR_GROUP_KEY, "id");

      //create indicator group table
      this.createStore(evt, DATASET_KEY, "id");

      //create programs table
      this.createStore(evt, PROGRAM_KEY, "id");
    })
  }

  createStore( evt, key:string, index:string ) {
    let objectStore = evt.currentTarget.result.createObjectStore(
      key, { keyPath: index });
    objectStore.createIndex(index, index, { unique: false });
  }

  /**
   * Add item to store in existing table
   * @param table
   * @param value
   * @returns {any}
   */
  add(table: string, value: any) {
    return Observable.create(observer => {
      this._initiateStoreObjects().then(() => {
        this.db.add(table, value).then(() => {
          observer.next(value);
          observer.complete();
        }, (error) => {
          console.log("an error occuers")
          observer.error(error);
        });
      });
    });
  }

  /**
   * Update existing value in store
   * @param table
   * @param value // this should have the id same as one in system
   * @returns Observable{any}
   */
  update( table: string, value: any ): Observable<any> {
    return Observable.create(observer => {
      this._initiateStoreObjects().then(() => {
        this.db.update(table, value).then(() => {
          observer.next(value);
          observer.complete();
        }, (error) => {
          console.log(error);
        });
      });
    });
  }

  /**
   * get a single item by using index
   * @param table
   * @param index
   * @param index_value
   * @returns {any}
   */
  getByIndex( table: string, index: string, index_value:string ): Observable<any> {
    return Observable.create(observer => {
      this._initiateStoreObjects().then(() => {
        this.db.getByIndex(table, index, index_value ).then((item) => {
          observer.next(item);
          observer.complete();
        }, (error) => {
          observer.error(error);
        });
      });
    });
  }


  /**
   * get an item by key
    * @param table
   * @param key_value
   * @returns {any}
   */
  getByKey( table: string, key_value: any ): Observable<any> {
    return Observable.create(observer => {
      this._initiateStoreObjects().then(() => {
        this.db.getByKey(table, key_value).then((item) => {
          observer.next(item);
          observer.complete();
        }, (error) => {
          observer.error(error);
        });
      });
    });
  }

  getByKeys( table: string, keys:Array<any> ): Observable<any> {
    return Observable.create(observer => {
      this._initiateStoreObjects().then(() => {
        this.db.getByKeys(table, keys).then((items) => {
          observer.next(items);
          observer.complete();
        }, (error) => {
          observer.error(error);
        });
      });
    });
  }


  /**
   * get all items in a store
   * @param store_key
   * @returns {any}
   */
  getAll( store_key:string ): Observable<any> {
    return Observable.create(observer => {
      this._initiateStoreObjects().then(() => {
        this.db.getAll(store_key).then((values) => {
          observer.next(values);
          observer.complete()
        }, (error) => {
          observer.error(error);
        });
      });

    });
  }

  /**
   * delete all items in a store
   * @param store_key
   * @returns {any}
   */
  clearAll( store_key:string ): Observable<any> {
    return Observable.create(observer => {
      this._initiateStoreObjects().then(() => {
        this.db.clear(store_key).then(() => {
          observer.next("Values cleared");
          observer.complete()
        }, (error) => {
          observer.error(error);
        });
      });

    });
  }

  /**
   * delete a single item in a store
   * @param store_key
   * @param index
   * @returns {any}
   */
  delete( store_key:string, index:string ): Observable<any> {
    return Observable.create(observer => {
      this._initiateStoreObjects().then(() => {
        this.db.remove(store_key, index).then(() => {
          observer.next( index+ "Values cleared" );
          observer.complete()
        }, (error) => {
          observer.error( error );
        });
      });

    });
  }

}
