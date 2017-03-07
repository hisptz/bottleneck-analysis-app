import { Seed2Page } from './app.po';

describe('seed2 App', function() {
  let page: Seed2Page;

  beforeEach(() => {
    page = new Seed2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
