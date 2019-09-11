import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';

@Injectable({
  providedIn: 'root'
})
export class FavoriteFilterService {
  searchFields: string;
  constructor(private httpClient: NgxDhis2HttpClientService) {
    this.searchFields =
      '.json?max=USERS&max=MAP&max=REPORT_TABLE&max=CHART&' +
      'max=EVENT_CHART&max=EVENT_REPORT&max=RESOURCES&max=REPORTS&max=APP';
  }

  getFavoritesBasedOnSearchQuery(searchText: string) {
    return this.httpClient.get(
      `dashboards/q/${searchText}${this.searchFields}`
    );
  }
}
