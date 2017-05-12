import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class DashboardService {
  url: string;
  constructor(private http: Http) {
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

}
