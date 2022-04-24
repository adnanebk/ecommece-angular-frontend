import {ApiError} from './api-error';

describe('MyError', () => {
  it('should create an instance', () => {
    expect(new ApiError()).toBeTruthy();
  });
});
