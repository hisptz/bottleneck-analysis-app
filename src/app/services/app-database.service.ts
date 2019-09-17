import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppDatabaseService extends Dexie {
  constructor() {
    super('dashboard');
    this.version(1).stores({
      indicators: 'id',
      indicatorGroups: 'id',
      functions: 'id'
    });
  }

  getAll(schemaName: string): Observable<any> {
    return new Observable(observer => {
      this.table(schemaName)
        .toArray()
        .then(
          (data: any[]) => {
            observer.next(data);
            observer.complete();
          },
          (error: any) => {
            observer.next(error);
          }
        );
    });
  }

  saveBulk(schemaName: string, data: any[]): Observable<any[]> {
    return new Observable(observer => {
      this.table(schemaName)
        .bulkPut(data)
        .then(
          () => {
            observer.next(data);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
    });
  }
}
