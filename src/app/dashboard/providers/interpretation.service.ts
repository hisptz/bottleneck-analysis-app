import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {Constants} from "../../shared/constants";
import {Observable} from "rxjs";
import {UtilitiesService} from "./utilities.service";

@Injectable()
export class InterpretationService {

  constructor(
    private http: Http,
    private constants: Constants,
    private util: UtilitiesService
  ) {}

  getInterpretation(itemType, itemId): Observable<any> {
     return this.http.get(this.constants.root_url + 'api/interpretations.json?fields=name,id,user[id,name],comments[:all,user[id,name]],likes,likedBy[id,name],*&filter=' + itemType + '.id:eq:' + itemId + '&paging=false')
       .map(res => res.json())
       .catch(this.util.handleError)
  }

  createInterpretation(itemType, itemId, interpretationText): Observable<any> {
    let headers = new Headers({'Content-Type': 'text/html'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(this.constants.root_url + 'api/interpretations/' + itemType + '/' + itemId, interpretationText, options)
      .map(res => res.json())
      .catch(this.util.handleError)

  }

  createComment(comment, interprtationId): Observable<any> {
    return this.http.post(this.constants.root_url + 'api/interpretations/' + interprtationId + '/comments',comment)
      .map(res => res.json())
      .catch(this.util.handleError)
  }

}
