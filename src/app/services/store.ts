import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Http, Response} from "@angular/http";
@Injectable()
export class Store {
  private dataStore: any = {
    dashboardItems: [],
  };

  constructor(private http: Http) {}

  /**
   *
   * @param item
   * @param url
   * @param resultKey
   * @returns {any}
   */
  public select(item:string, url: string, resultKey: string =  null): Observable<any> {
    return Observable.create(observer => {
      if(this.dataStore[item].length > 0) {
        observer.next(this.dataStore[item]);
        observer.complete();
      } else {
        //observer.next([{loading: true, message: 'Moving ' + item + ' into position....'}]);
        this.loadAndSave(item, url, 'array', null, resultKey).subscribe(data => {
          observer.next(data);
          observer.complete();
        }, error => {
          console.log('Error Notification');
          observer.error();
        })
      }
    });
  }

  public selectByField(item: string, field: string, value: any): Observable<any> {
    let result = this.dataStore[item].filter(data => data[field] == value);
    if(result.length == 0) {
      result = 'Not found';
    } else if(result.length == 1) {
      result = result[0]
    }
    return Observable.of(result);
  }

  /**
   *
   * @param item
   * @param id
   * @param url
   * @param resultType
   * @returns {any}
   */
  public selectById(item: string, id: any, url: string, resultKey: string = null, resultType: string = 'object'): Observable<any> {
    return Observable.create(observer => {
      let result = this.dataStore[item].filter(data => data.id == id);
      if(result.length == 0) {
        this.loadAndSave(item, url, resultType ,id, resultKey).subscribe(data => {
          let result = resultType == 'array' ? data.filter(dataValue => dataValue.id == id)[0]: data;
          observer.next(result);
          observer.complete();
        }, error => {
          console.log('Error Notification');
          observer.error();
        });
      } else {
        observer.next(result[0]);
        observer.complete();
      }
    })
  }

  public createOrUpdate(item: string, data: any): Observable<any> {
    let responseMessage: string;
    let index = this.getItemIndex(this.dataStore[item],data.id);
    if(index >= 0) {
      this.dataStore[item][index] = data;
      responseMessage = 'Item updated';
    } else {
      this.dataStore[item].push(data);
      responseMessage = 'Item created';
    }
    return Observable.of(responseMessage);
  }

  public delete(item, id): Observable<any> {
    this.dataStore[item].splice(this.getItemIndex(this.dataStore[item],id), 1);
    return Observable.of('item deleted');
  }

  /**
   *
   * @param item
   * @param id
   * @returns {number}
   */
  private getItemIndex(item: any, id: any): number {
    let index: number = -1;
    item.forEach((dataValue,dataIndex) => {
      if (dataValue.id == id) {
        index = dataIndex;
      }
    });
    return index;
  }

  /**
   *
   * @param item
   * @param url
   * @param resultType
   * @param id
   * @param resultKey
   * @returns {any}
   */
  private loadAndSave(item: string, url: string, resultType: string, id: any, resultKey: string = null): Observable<any> {
      return Observable.create(observer => {
        this.http.get(url)
          .map((res: Response) => res.json())
          .catch(error => Observable.throw( new Error(error)))
          .subscribe(response => {
            /**
             * Check if data has to be retrieved from result key and return it
             * @type {R}
             */
            let data: any = resultKey === null ? response : response[resultKey];
            /**
             * save the data to the store, saving is based on type of expected result
             */
            if(resultType == 'array') {
              this.dataStore[item] = data;
            } else {
              /**
               * Set id if not present, for easy accessibility in the future
               */
              if(!data.hasOwnProperty('id')) {
                data.id = id;
              }
              this.dataStore[item].push(data);
            }

            /**
             * also return the data back to the requesting client
             */
            observer.next(data);
            observer.complete();
          }, error => {
            observer.error();
          })
      })
  }


}
