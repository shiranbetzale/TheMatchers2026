const Linking = {
  canOpenURL: jest.fn(),
  openURL: jest.fn(),
};

jest.mock('react-native', () => ({
  Image: {
    resolveAssetSource: jest.fn(asset => ({uri: `asset:${asset}`})),
  },
  Linking,
}));

const {
  getDefaultProfileImage,
  groupBy,
  sendEmail,
  getCardStatusText,
  normalizeImages,
  normalizeMeetingTime,
  mapProfileToCard,
} = require('./generalFunction');

describe('generalFunction utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns gender based default profile images', () => {
    expect(getDefaultProfileImage('male')).toBe('asset:test-file-stub');
    expect(getDefaultProfileImage('זכר')).toBe('asset:test-file-stub');
    expect(getDefaultProfileImage('female')).toBe('asset:test-file-stub');
  });

  it('groups records by a requested key while preserving item data', () => {
    expect(
      groupBy(
        [
          {city: 'Bnei Brak', name: 'A'},
          {city: 'Jerusalem', name: 'B'},
          {city: 'Bnei Brak', name: 'C'},
        ],
        'city',
      ),
    ).toEqual([
      {
        title: 'Bnei Brak',
        data: [
          {city: 'Bnei Brak', name: 'A'},
          {city: 'Bnei Brak', name: 'C'},
        ],
      },
      {
        title: 'Jerusalem',
        data: [{city: 'Jerusalem', name: 'B'}],
      },
    ]);
  });

  it('normalizes image inputs from strings, arrays, objects and base64 payloads', () => {
    expect(normalizeImages(' single-image.jpg ')).toEqual(['single-image.jpg']);
    expect(normalizeImages('["a.jpg", " b.jpg "]')).toEqual(['a.jpg', 'b.jpg']);
    expect(
      normalizeImages([
        {uri: ' uri.jpg '},
        {url: 'url.jpg'},
        {path: 'path.jpg'},
        {base64: 'abc123', type: 'image/png'},
        '',
        null,
      ]),
    ).toEqual([
      'uri.jpg',
      'url.jpg',
      'path.jpg',
      'data:image/png;base64,abc123',
    ]);
    expect(normalizeImages(undefined)).toEqual([]);
  });

  it('normalizes meeting times and rejects invalid values', () => {
    expect(normalizeMeetingTime('9')).toBe('09:00');
    expect(normalizeMeetingTime(7)).toBe('07:00');
    expect(normalizeMeetingTime('8:5')).toBe('08:05');
    expect(normalizeMeetingTime('23:59')).toBe('23:59');
    expect(normalizeMeetingTime('24:00')).toBeUndefined();
    expect(normalizeMeetingTime('12:60')).toBeUndefined();
    expect(normalizeMeetingTime('abc')).toBeUndefined();
  });

  it('builds gendered status labels and appends children count only when relevant', () => {
    const translate = key => key;

    expect(getCardStatusText('divorcedStatus', 2, translate, 'female')).toBe(
      'divorcedStatusFemale2',
    );
    expect(getCardStatusText('single', 0, translate, 'male')).toBe(
      'singleStatusMale',
    );
    expect(getCardStatusText('archived', 3, translate, 'male')).toBe('');
  });

  it('maps backend profile data to a match card model', () => {
    const card = mapProfileToCard({
      _id: 'profile-1',
      fullName: 'Lea Cohen',
      age: '27',
      hight: 165,
      gender: 'female',
      status: 'divorcedWithChildren',
      countOfChildren: '2',
      phone: '0501234567',
      matcherPhone: '0522222222',
      images: JSON.stringify([{url: 'profile.jpg'}]),
      meetingStatus: 'busy',
      meetingTime: '8:5',
      partnerOutsideApp: true,
    });

    expect(card).toMatchObject({
      profileId: 'profile-1',
      name: 'Lea Cohen',
      age: 27,
      height: '165',
      status: 'divorcedWithChildrenStatus',
      maritalStatus: 'divorcedWithChildrenStatus',
      images: ['profile.jpg'],
      numOfChildren: 2,
      gender: 'female',
      phone: '0501234567',
      matcherPhone: '0522222222',
      relationshipStatus: 'single',
      meetingStatus: 'busy',
      meetingTime: '08:05',
      partnerOutsideApp: true,
    });
  });

  it('opens a mailto link only when the device can handle it', async () => {
    Linking.canOpenURL.mockResolvedValueOnce(true);
    Linking.openURL.mockResolvedValueOnce(undefined);

    await expect(sendEmail('test@example.com', 'Hi', 'Body')).resolves.toBe(true);

    expect(Linking.openURL).toHaveBeenCalledWith(
      'mailto:test@example.com?subject=Hi&body=Body',
    );

    Linking.canOpenURL.mockResolvedValueOnce(false);
    await expect(sendEmail('test@example.com')).resolves.toBe(false);
  });
});
