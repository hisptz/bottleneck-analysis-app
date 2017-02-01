import { Injectable } from '@angular/core';
import {Constants} from "../../shared/constants";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class DashboardSearchService {

  constructor(
    private constant: Constants,
    private http: Http
  ) {

  }

  getMessageCount(): Observable<number> {
    return Observable.create(observer => {
      this.http.get(this.constant.root_url + '/api/messageConversations.json?fields=none&paging=true&pageSize=1')
        .map((res: Response) => res.json())
        .subscribe(
          message => {
            observer.next(message.pager.total);
            observer.complete()
          }, error => {
            observer.next(error);
          })
    })
  }
  search(terms: Observable<string>) {
    return terms.debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.searchEntries(term));
  }

  searchEntries(term) {
    return this.http
      .get(this.constant.root_url + 'api/dashboards/q/' + term + '.json')
      .map(res => res.json());
  }

}
