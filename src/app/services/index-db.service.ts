import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { switchMap, mergeMap, tap } from 'rxjs/operators';

@Injectable()
export class IndexDbService {
  private _indexedDB: any;
  private _dbName: string;

  constructor() {
    this._indexedDB = indexedDB;
    this._dbName = 'hisptz'; // by default
  }

  setName(dbName: string): void {
    if (dbName) {
      this._dbName = dbName;
    }
  }

  /**
   * Function to update existing data in the db
   * @param {string} schemaName
   * @param data
   * @returns {Observable<any>}
   */
  put(schema: any, data: any): Observable<any> {
    return Observable.create((observer: any) => {
      this.create(schema)
        .pipe(switchMap(() => this.open()))
        .subscribe((db: any) => {
          const transaction = db.transaction(schema.name, 'readwrite');
          const store = transaction.objectStore(schema.name);
          store.put(data);

          transaction.oncomplete = () => {
            observer.next(data);
            db.close();
            observer.complete();
          };
          db.onerror = (errorEvent: any) => {
            db.close();
            observer.error(errorEvent.target.errorCode);
          };
        });
    });
  }

  /**
   * Function to add new data in the db
   * @param {string} schemaName
   * @param data
   * @returns {Observable<any>}
   */
  post(schema: any, data: any): Observable<any> {
    return Observable.create((observer: any) => {
      this.create(schema)
        .pipe(switchMap(() => this.open()))
        .subscribe((db: any) => {
          const transaction = db.transaction(schema.name, 'readwrite');
          const store = transaction.objectStore(schema.name);
          const request = store.add(data);

          request.onsuccess = () => {
            observer.next(data);
            db.close();
            observer.complete();
          };
          db.onerror = () => {
            observer.next(data);
            db.close();
            observer.complete();
          };
        });
    });
  }

  /**
   * Function to select all values for a particular table in the db
   * @param schema
   * @returns {Observable<any[]>}
   */
  get(schema: any, key: string | number): Observable<any[]> {
    return new Observable((observer: any) => {
      this.create(schema)
        .pipe(mergeMap(() => this.open()))
        .subscribe((db: any) => {
          const transaction = db.transaction(schema.name, 'readwrite');
          const store = transaction.objectStore(schema.name);
          const request = store.get(key);
          request.onsuccess = successEvent => {
            observer.next(successEvent.target.result);
            db.close();
            observer.complete();
          };
          db.onerror = (event: any) => {
            console.log(event.target.errorCode);
            db.close();
            observer.error(event.target.errorCode);
          };
        });
    });
  }

  /**
   * Function to select all values for a particular table in the db
   * @param schema
   * @returns {Observable<any[]>}
   */
  select(schema: any): Observable<any[]> {
    return Observable.create((observer: any) => {
      this.create(schema)
        .pipe(switchMap(() => this.open()))
        .subscribe((db: any) => {
          const transaction = db.transaction(schema.name, 'readwrite');
          const store = transaction.objectStore(schema.name);
          const storeIndex = store.index(schema.keyPath);
          const request = storeIndex.openCursor();
          const results: any[] = [];

          request.onsuccess = successEvent => {
            const cursor = successEvent.target.result;
            if (cursor) {
              results.push(cursor.value);
              cursor.continue();
            } else {
              observer.next(results);
              db.close();
              observer.complete();
            }
          };
          db.onerror = (event: any) => {
            db.close();
            observer.error(event.target.errorCode);
          };
        });
    });
  }

  /**
   * Delete data from the db
   * @param schema
   * @param {number} id
   * @returns {Observable<any>}
   */
  delete(schema: any, id: number): Observable<any> {
    return Observable.create((observer: any) => {
      this.open().subscribe((db: any) => {
        if (!db.objectStoreNames.contains(schema.name)) {
          const transaction = db.transaction(schema.name, 'readwrite');
          const store = transaction.objectStore(schema.name);
          store.delete(id);

          transaction.oncomplete = () => {
            observer.next(id);
            db.close();
            observer.complete();
          };
          db.onerror = (errorEvent: any) => {
            db.close();
            observer.error(errorEvent.target.errorCode);
          };
        }
      });
    });
  }

  /**
   * Create a schema/table
   * @param schema
   * @returns {Observable<any>}
   */
  create(schema: any): Observable<any> {
    return Observable.create((observer: any) => {
      this.open().subscribe((requestResult: any) => {
        if (!requestResult.objectStoreNames.contains(schema.name)) {
          /**
           * Close database to allow opening with new version
           */
          requestResult.close();

          /**
           * Set a new connection with new version to allows creating schema
           */
          const request = this._indexedDB.open(
            this._dbName,
            requestResult.version + 1
          );

          request.onupgradeneeded = event => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(schema.name)) {
              /**
               * Create corresponding schema
               * @type {IDBObjectStore}
               */
              const store = db.createObjectStore(schema.name, {
                keyPath: schema.keyPath
              });
              store.createIndex(schema.keyPath, schema.keyPath, {
                unique: true
              });

              /**
               * Create indexes for schema if supplied
               */
              if (schema.indexes) {
                _.each(schema.indexes, (schemaIndex: any) => {
                  store.createIndex(schemaIndex, schemaIndex);
                });
              }

              /**
               * Add data if supplied
               */
              if (schema.data) {
                _.each(schema.data, (dataItem: any) => {
                  store.put(dataItem);
                });
              }
            }

            observer.next('done');
            observer.complete();
          };

          request.onerror = errorEvent => {
            observer.error(errorEvent.target.errorCode);
          };

          request.onsuccess = successEvent => {
            successEvent.target.result.close();
            observer.next('done');
            observer.complete();
          };
        } else {
          observer.next('done');
          observer.complete();
        }
      });
    });
  }

  /**
   * Delete the whole database
   * @returns {Observable<any>}
   */
  clear(): Observable<any> {
    return Observable.create((observer: any) => {
      const request = this._indexedDB.deleteDatabase(this._dbName);

      request.onsuccess = () => {
        observer.next('done');
        observer.complete();
      };
      request.onerror = errorEvent => {
        observer.error(errorEvent.target.errorCode);
      };
      request.onblocked = blockEvent => {
        observer.error(blockEvent.target.errorCode);
      };
    });
  }

  private open(): Observable<any> {
    return Observable.create((observer: any) => {
      const request = this._indexedDB.open(this._dbName);

      request.onsuccess = successEvent => {
        observer.next(successEvent.target.result);
        observer.complete();
      };
      request.onerror = errorEvent =>
        observer.error(errorEvent.target.errorCode);
    });
  }
}
