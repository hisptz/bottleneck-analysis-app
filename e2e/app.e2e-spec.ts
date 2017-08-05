import { IdashboardPage } from './app.po';

describe('idashboard App', () => {
  let page: IdashboardPage;

  beforeEach(() => {
    page = new IdashboardPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
