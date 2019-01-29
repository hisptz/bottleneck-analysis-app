import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';

import { getFavoriteUrl, getStandardizedVisualizationType } from '../helpers';
import { map, catchError } from 'rxjs/operators';
import { FavoriteConfiguration } from '../models/favorite-configurations.model';
import { getFavoritePayload } from '../helpers/get-favorite-payload.helpers';
import { VisualizationLayer } from '../models';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  constructor(private http: NgxDhis2HttpClientService) {}

  getFavorite(
    favorite: any,
    configurations: FavoriteConfiguration = {
      useDataStoreAsSource: true,
      autoCreateFavorite: true
    },
    namespace: string = 'favorites'
  ): Observable<any> {
    return this.get(favorite, configurations, namespace).pipe(
      catchError((error: any) => {
        if (error.status !== 404 || !configurations.autoCreateFavorite) {
          return throwError(error);
        }
        const visualizationLayers: VisualizationLayer[] = [
          { id: favorite.id, dataSelections: favorite.dataSelections }
        ];

        const favoriteType = getStandardizedVisualizationType(
          favorite.visualizationType
        );

        const favoritePayload = getFavoritePayload(
          visualizationLayers,
          favorite.visualizationType,
          favoriteType
        );

        return this.create(
          favoritePayload.url,
          favoritePayload.favorite,
          configurations,
          namespace
        ).pipe(map(() => favoritePayload.favorite));
      })
    );
  }

  get(favorite: any, configurations: FavoriteConfiguration, namespace: string) {
    const favoriteUrl = getFavoriteUrl(favorite);
    return favoriteUrl !== ''
      ? configurations.useDataStoreAsSource
        ? this.http.get(`dataStore/${namespace}/${favorite.id}`)
        : this.http.get(favoriteUrl)
      : of(null);
  }

  create(
    favoriteUrl: string,
    favorite: any,
    configurations?: FavoriteConfiguration,
    namespace?: string
  ) {
    return configurations && configurations.useDataStoreAsSource
      ? this.http.post(`dataStore/${namespace}/${favorite.id}`, favorite)
      : this.http.post(favoriteUrl, favorite).pipe(map(() => favorite));
  }

  update(
    favoriteUrl: string,
    favorite: any,
    configurations?: FavoriteConfiguration,
    namespace?: string
  ) {
    return configurations && configurations.useDataStoreAsSource
      ? this.http
          .put(`dataStore/${namespace}/${favorite.id}`, favorite)
          .pipe(map(() => favorite))
      : this.http.put(favoriteUrl, favorite).pipe(map(() => favorite));
  }

  delete(favoriteId: string, favoriteType: string) {
    return this.http.delete(`${favoriteType}s/${favoriteId}`);
  }
}
