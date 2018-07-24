import { FavoriteFilterModule } from './favorite-filter.module';

describe('FavoriteFilterModule', () => {
  let favoriteFilterModule: FavoriteFilterModule;

  beforeEach(() => {
    favoriteFilterModule = new FavoriteFilterModule();
  });

  it('should create an instance', () => {
    expect(favoriteFilterModule).toBeTruthy();
  });
});
