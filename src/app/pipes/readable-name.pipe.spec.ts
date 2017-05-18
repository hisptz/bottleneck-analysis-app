import { ReadableNamePipe } from './readable-name.pipe';

describe('ReadableNamePipe', () => {
  it('create an instance', () => {
    const pipe = new ReadableNamePipe();
    expect(pipe).toBeTruthy();
  });
});
