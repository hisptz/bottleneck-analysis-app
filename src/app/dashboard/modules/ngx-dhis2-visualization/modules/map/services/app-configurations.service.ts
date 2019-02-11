import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfigurationsService {
  constructor(private http: NgxDhis2HttpClientService, private httpClient: HttpClient) {}

  loadDashboardSettings() {
    return this.httpClient.get('./config/dashboard-settings.json');
  }

  initateAppConfigurations(): Observable<any> {
    return new Observable(observer => {
      const namespaces = ['dashboard-settings', 'dashboards', 'favourites', 'legendSets', 'functions'];
      let successProcess = 0;
      _.map(namespaces, namespace => {
        this.uploadingConfigurationsByNamespace(namespace).subscribe(
          () => {
            successProcess++;
            if (successProcess === namespaces.length) {
              this.loadDashboardSettings().subscribe(
                dashboardSettings => {
                  observer.next(dashboardSettings);
                  observer.complete();
                },
                error => {
                  console.log({ error });
                }
              );
            }
          },
          error => {
            observer.error(error);
          }
        );
      });
    });
  }

  uploadingConfigurationsByNamespace(namespace: string) {
    return new Observable(observer => {
      this.httpClient.get(`./config/${namespace}.json`).subscribe(configObject => {
        let successProcess = 0;
        _.map(Object.keys(configObject), key => {
          this.http.post(`dataStore/${namespace}/` + key, configObject[key]).subscribe(
            () => {
              successProcess++;
              if (successProcess === Object.keys(configObject).length) {
                observer.next();
                observer.complete();
              }
            },
            () => {
              observer.next();
              observer.complete();
            }
          );
        });
      });
    });
  }

  getDefaultLegends(): Observable<any> {
    return new Observable(observer => {
      this.httpClient.get(`./config/legendSets.json`).subscribe(
        (reposnse: any) => {
          const { configuration } = reposnse;
          const legendSets = configuration && configuration.legendSets ? configuration.legendSets : [];
          observer.next(legendSets);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  getDefaultFunction(): Observable<any> {
    return new Observable(observer => {
      this.httpClient.get(`./config/functions.json`).subscribe(
        (reposnse: any) => {
          const { whoMalariafn } = reposnse;
          observer.next(whoMalariafn);
          observer.complete();
        },
        error => {
          observer.next([]);
          observer.complete();
        }
      );
    });
  }
}
