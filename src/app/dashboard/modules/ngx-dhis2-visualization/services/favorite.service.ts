import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';

import { getFavoriteUrl } from '../helpers/index';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  constructor(private http: NgxDhis2HttpClientService) {}

  getFavorite(favorite: { id: string; type: string }): Observable<any> {
    const favoriteUrl = getFavoriteUrl(favorite);
    return favoriteUrl !== '' ? this.http.get(favoriteUrl) : of(null);
  }

  create(favoriteUrl: string, favorite: any) {
    return this.http.post(favoriteUrl, favorite).pipe(map(() => favorite));
  }

  update(favoriteUrl: string, favorite: any) {
    return this.http
      .put(`${favoriteUrl}/${favorite.id}`, favorite)
      .pipe(map(() => favorite));
  }
}
