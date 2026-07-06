import {isNetworkError} from './api.helpers';

describe('isNetworkError', () => {
  it('detects axios network errors without a response', () => {
    expect(isNetworkError({code: 'ERR_NETWORK'})).toBe(true);
    expect(isNetworkError({message: 'Network Error'})).toBe(true);
  });

  it('does not treat server responses as network errors', () => {
    expect(isNetworkError({code: 'ERR_NETWORK', response: {status: 500}})).toBe(
      false,
    );
  });

  it('ignores unrelated errors', () => {
    expect(isNetworkError(new Error('Something else'))).toBe(false);
    expect(isNetworkError(null)).toBe(false);
  });
});
