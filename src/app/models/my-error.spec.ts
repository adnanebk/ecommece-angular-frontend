import {MyError} from './my-error';

describe('MyError', () => {
  it('should create an instance', () => {
    expect(new MyError()).toBeTruthy();
  });
});
