import { Injectable } from '@angular/core';
import {HttpClientService} from './http-client.service';
import {Observable} from 'rxjs/Observable';
import {ManifestService} from './manifest.service';
export interface SystemInfo {
  rootUrl: string;
  currentVersion: number;
}
@Injectable()
export class SystemInfoService {

  constructor(
    private http: HttpClientService,
    private manifestService: ManifestService
  ) { }

  load(): Observable<SystemInfo> {
    return Observable.create(observer => {
      this.manifestService.getRootUrl().subscribe((rootUrl: string) => {
        this.http.get(rootUrl + 'api/system/info')
          .subscribe((systemInfo: any) => {
            observer.next({
              rootUrl: rootUrl,
              currentVersion: systemInfo.version
            });
            observer.complete();
          }, systemInfoError => observer.error(systemInfoError))
      }, manifestError => observer.error(manifestError))
    })
  }
}
