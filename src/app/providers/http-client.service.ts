import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/timeout';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class HttpClientService {
  constructor(private http: Http) {}

  createAuthorizationHeader(headers: Headers, options?) {
    if (options) {
      for (let key in options) {
        headers.append(key, options[key]);
      }
    }
  }

  get(url) {
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {headers: headers})
      .timeout(120000)
      .map(this.responseHandler())
      .catch(this.handleError);
  }

  post(url, data, options?) {
    const headers = new Headers();
    this.createAuthorizationHeader(headers, options);
    return this.http.post(url, data, {headers: headers})
      .map(this.responseHandler())
      .catch(this.handleError);
  }
  put(url, data, options?) {
    const headers = new Headers();
    this.createAuthorizationHeader(headers, options);
    return this.http.put(url, data, {
      headers: headers
    }).map(this.responseHandler());
  }

  delete(url, options?) {
    const headers = new Headers();
    this.createAuthorizationHeader(headers, options);
    return this.http.delete(url, {headers: headers})
      .map(this.responseHandler())
      .catch(this.handleError);
  }

  responseHandler() {
    return (res) => {
      try {
        return res.json();
      } catch (e) {
        return null;
      }
    }
  }

  handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      errMsg = error.toString();
    } else {
      const newErrorObject: any = Object.assign({}, error);
      let sanitizedError = newErrorObject.message ? newErrorObject.message : newErrorObject._body ? newErrorObject._body : newErrorObject.toString();
      try {
        sanitizedError = (new Function('return ' + sanitizedError))();
        errMsg = sanitizedError.message;
      } catch (e) {
        errMsg = sanitizedError
      }
    }
    return Observable.throw(errMsg);
  }
}
