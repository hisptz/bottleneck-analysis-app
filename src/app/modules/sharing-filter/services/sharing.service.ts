import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../services/http-client.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SharingService {
  constructor(private httpClient: HttpClientService) {}

  searchSharingDetails(searchTerm: string) {
    return new Observable(observer => {
      this.httpClient
        .get('sharing/search?key=' + searchTerm + '&paging=false')
        .subscribe(
          (userGroupResponse: any) => {
            observer.next(userGroupResponse);
            observer.complete();
          },
          () => {
            observer.next(null);
            observer.complete();
          }
        );
    });
  }
}
