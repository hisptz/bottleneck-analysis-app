import { Injectable } from '@angular/core';
import {HttpClientService} from './http-client.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ManifestService {

  constructor(private http: HttpClientService) { }

  getRootUrl(): Observable<string> {
    return this.http.get('assets/manifest.webapp').map(manifect => { return manifect.activities.dhis.href});
  }
}
