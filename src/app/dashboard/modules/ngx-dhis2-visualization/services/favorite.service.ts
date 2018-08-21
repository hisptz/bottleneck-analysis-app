import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';

import { getFavoriteUrl } from '../helpers';
import { map } from 'rxjs/operators';
import { FavoriteConfiguration } from '../models/favorite-configurations.model';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  constructor(private http: NgxDhis2HttpClientService) {}

  getFavorite(
    favorite: { id: string; type: string },
    configurations: FavoriteConfiguration = { useDataStoreAsSource: true },
    namespace: string = 'favourites'
  ): Observable<any> {
    const favoriteUrl = getFavoriteUrl(favorite);
    return favoriteUrl !== ''
      ? configurations.useDataStoreAsSource
        ? this.http.get(`dataStore/${namespace}/${favorite.id}`)
        : this.http.get(favoriteUrl)
      : of(null);
  }

  create(favoriteUrl: string, favorite: any) {
    return this.http.post(favoriteUrl, favorite).pipe(map(() => favorite));
  }

  update(favoriteUrl: string, favorite: any) {
    return this.http.put(`${favoriteUrl}/${favorite.id}`, favorite).pipe(map(() => favorite));
  }

  delete(favoriteId: string, favoriteType: string) {
    return this.http.delete(`${favoriteType}s/${favoriteId}`);
  }
}
