import { Idashboard2Page } from './app.po';

describe('idashboard2 App', () => {
  let page: Idashboard2Page;

  beforeEach(() => {
    page = new Idashboard2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
