const {toFirebasePhoneNumber} = require('./auth.helpers');

describe('toFirebasePhoneNumber', () => {
  it('converts a local value to international format', () => {
    expect(toFirebasePhoneNumber('0500000000')).toBe('+972500000000');
  });

  it('keeps values that already include the country prefix', () => {
    expect(toFirebasePhoneNumber('972500000000')).toBe('+972500000000');
  });

  it('strips separators before formatting', () => {
    expect(toFirebasePhoneNumber('050-000-0000')).toBe('+972500000000');
  });
});
