import { FavoriteFilter } from '../models/favorite-filter.model';
import * as _ from 'lodash';

export function getStandardizedFavoriteItems(
  favoriteResult: any
): FavoriteFilter[] {
  return _.flatten(
    _.map(
      _.filter(_.keys(favoriteResult), favoriteKey =>
        _.isArray(favoriteResult[favoriteKey])
      ),
      favoriteKey => {
        const favorites: any = favoriteResult[favoriteKey];
        return _.map(favorites, favorite => {
          return {
            id: favorite.id || favorite.key,
            name: favorite.displayName || favorite.name,
            type: favoriteKey,
            user: favorite.user
          };
        });
      }
    )
  );
}
