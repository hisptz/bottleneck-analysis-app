import { HasRootCauseDataPipe } from './has-root-cause-data.pipe';

describe('HasRootCauseDataPipe', () => {
  it('create an instance', () => {
    const pipe = new HasRootCauseDataPipe();
    expect(pipe).toBeTruthy();
  });
});
