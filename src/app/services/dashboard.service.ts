import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Utilities} from "./utilities";

@Injectable()
export class DashboardService {
  url: string;
  constructor(
    private http: Http,
    private utilities: Utilities
  ) {
    this.url = '../../../api/dashboards';
  }

  loadAll(): Observable<any> {
    return this.http.get(this.url +  '.json?paging=false&fields=id,name,dashboardItems[*]')
      .map((res: Response) => res.json())
      .catch(error => Observable.throw(new Error(error)));
  }

  update(dashboard): Observable<any> {
    return this.http.put(this.url + '/'+ dashboard.id, dashboard)
      .map((res: Response) => {
        return dashboard
        })
      .catch(error => Observable.throw(new Error(error)));
  }

  add(name): Observable<any> {
    return Observable.create(observer => {
      this.utilities.getUniqueId().subscribe(uniqueId => {
        const dashboardData = {
          id: uniqueId,
          name: name,
          dashboardItems: []
        };

        return this.http.post(this.url, dashboardData)
          .map(res => res.json())
          .catch(this.utilities.handleError)
          .subscribe(response => {
            observer.next(dashboardData);
            observer.complete();
          })
      })
    })
  }

  delete(id): Observable<any> {
    return this.http.delete(this.url + '/' + id)
      .map((res: Response) => {return id})
      .catch(this.utilities.handleError);
  }

}
