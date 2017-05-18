import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Constants} from "./constants";

@Injectable()
export class SearchService {

  constructor(
    private constant: Constants,
    private http: Http
  ) {

  }

  getMessageCount(): Observable<number> {
    return Observable.create(observer => {
      this.http.get(this.constant.api + 'messageConversations.json?fields=none&paging=true&pageSize=1')
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
      .get(this.constant.api + 'dashboards/q/' + term + '.json')
      .map(res => res.json());
  }



}
