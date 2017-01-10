import { Ng2SeedPage } from './app.po';

describe('ng2-seed App', function() {
  let page: Ng2SeedPage;

  beforeEach(() => {
    page = new Ng2SeedPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
