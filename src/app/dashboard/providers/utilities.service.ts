import { Injectable } from '@angular/core';
import {Response, Http} from "@angular/http";
import {Observable} from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Constants} from "../../shared/constants";

@Injectable()
export class UtilitiesService {

  constructor(
    private constants: Constants,
    private http: Http
  ) { }

  formatEnumString(enumString){
    enumString = enumString.replace(/_/g,' ');
    enumString=enumString.toLowerCase();
    return enumString.substr(0,1)+enumString.replace(/(\b)([a-zA-Z])/g,
            function(firstLetter){
              return   firstLetter.toUpperCase();
            }).replace(/ /g,'').substr(1);
  }

  handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }

  readableName(name: string, hasUnderscore: boolean) {
    let readableName: any = [];
    let count: number = 0;
    for (let i = 0; i <= name.length-1; i++) {
      if(i == 0) {
        readableName[count] = name[i].toUpperCase();
        count++;
      } else {
        if(name[i] == name[i].toUpperCase()) {
          if(hasUnderscore) {
            readableName[count] = '_';
            count++;
            readableName[count] = name[i];
            count++;
          } else {
            readableName[count] = ' ';
            count++;
            readableName[count] = name[i].toLowerCase();
            count++;
          }

        } else{
          readableName[count] = name[i];
          count++;
        }
      }
    }
    return hasUnderscore ? readableName.join("").toUpperCase() : readableName.join("");
  }

  camelCaseName(name) {
    let camelCaseName: any = [];
    let count: number = 0;
    for (let i = 0; i <= name.length-1; i++) {
      if(i == 0) {
        camelCaseName[count] = name[i].toLowerCase();
        count++;
      } else {
        if(name[i] == '_' || name[i] == '') {
          camelCaseName[count] = name[i+1].toUpperCase();
          count++;
          i++;

        } else{
          camelCaseName[count] = name[i].toLowerCase();
          count++;
        }
      }
    }
    return camelCaseName.join("");
  }

  getUniqueId(): Observable<string> {
    return Observable.create(observer => {
      this.http.get(this.constants.root_url + 'api/system/id.json?n=1')
        .map(res => res.json())
        .catch(this.handleError)
        .subscribe(
          response => {
          observer.next(response['codes'][0]);
          observer.complete();
          }, error => {
            observer.error(error);
          })
    })
  }

}
