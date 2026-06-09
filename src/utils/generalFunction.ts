import qs from 'qs';
import {Image, Linking} from 'react-native';
import {MatchCardType} from '../components/MatchCard/MatchCard.type';

const DEFAULT_MALE_PROFILE_IMAGE = Image.resolveAssetSource(
  require('../assets/images/anonymous-man.png'),
).uri;
const DEFAULT_FEMALE_PROFILE_IMAGE = Image.resolveAssetSource(
  require('../assets/images/anonymous-woman.png'),
).uri;

export const getDefaultProfileImage = (gender?: string) => {
  const normalizedGender = String(gender || '')
    .trim()
    .toLowerCase();

  return normalizedGender === 'male' || normalizedGender === 'זכר'
    ? DEFAULT_MALE_PROFILE_IMAGE
    : DEFAULT_FEMALE_PROFILE_IMAGE;
};

const HEBREW_NUMERAL_LETTERS = [
  {value: 400, letter: 'ת'},
  {value: 300, letter: 'ש'},
  {value: 200, letter: 'ר'},
  {value: 100, letter: 'ק'},
  {value: 90, letter: 'צ'},
  {value: 80, letter: 'פ'},
  {value: 70, letter: 'ע'},
  {value: 60, letter: 'ס'},
  {value: 50, letter: 'נ'},
  {value: 40, letter: 'מ'},
  {value: 30, letter: 'ל'},
  {value: 20, letter: 'כ'},
  {value: 10, letter: 'י'},
  {value: 9, letter: 'ט'},
  {value: 8, letter: 'ח'},
  {value: 7, letter: 'ז'},
  {value: 6, letter: 'ו'},
  {value: 5, letter: 'ה'},
  {value: 4, letter: 'ד'},
  {value: 3, letter: 'ג'},
  {value: 2, letter: 'ב'},
  {value: 1, letter: 'א'},
];

const toHebrewNumeral = (value: number) => {
  let remaining = value % 1000;

  if (remaining === 15) {
    return 'טו';
  }

  if (remaining === 16) {
    return 'טז';
  }

  return HEBREW_NUMERAL_LETTERS.reduce((result, current) => {
    while (remaining >= current.value) {
      result += current.letter;
      remaining -= current.value;
    }

    return result;
  }, '');
};

const HEBREW_EPOCH = 347997;

const HEBREW_MONTHS: Record<number, string> = {
  1: 'ניסן',
  2: 'אייר',
  3: 'סיון',
  4: 'תמוז',
  5: 'אב',
  6: 'אלול',
  7: 'תשרי',
  8: 'חשון',
  9: 'כסלו',
  10: 'טבת',
  11: 'שבט',
  12: 'אדר',
  13: 'אדר ב',
};

const getHebrewMonthName = (year: number, month: number) => {
  if (month === 12 && isHebrewLeapYear(year)) {
    return 'אדר א';
  }

  return HEBREW_MONTHS[month] ?? '';
};

const isHebrewLeapYear = (year: number) => (7 * year + 1) % 19 < 7;

const getHebrewCalendarElapsedDays = (year: number) => {
  const monthsElapsed =
    235 * Math.floor((year - 1) / 19) +
    12 * ((year - 1) % 19) +
    Math.floor((7 * ((year - 1) % 19) + 1) / 19);
  const partsElapsed = 204 + 793 * (monthsElapsed % 1080);
  const hoursElapsed =
    5 +
    12 * monthsElapsed +
    793 * Math.floor(monthsElapsed / 1080) +
    Math.floor(partsElapsed / 1080);
  let day = 1 + 29 * monthsElapsed + Math.floor(hoursElapsed / 24);
  const parts = 1080 * (hoursElapsed % 24) + (partsElapsed % 1080);

  if (
    parts >= 19440 ||
    (day % 7 === 2 && parts >= 9924 && !isHebrewLeapYear(year)) ||
    (day % 7 === 1 && parts >= 16789 && isHebrewLeapYear(year - 1))
  ) {
    day += 1;
  }

  if ([0, 3, 5].includes(day % 7)) {
    day += 1;
  }

  return day;
};

const getHebrewYearDays = (year: number) =>
  getHebrewCalendarElapsedDays(year + 1) - getHebrewCalendarElapsedDays(year);

const hasLongHeshvan = (year: number) => getHebrewYearDays(year) % 10 === 5;

const hasShortKislev = (year: number) => getHebrewYearDays(year) % 10 === 3;

const getHebrewMonthsInYear = (year: number) =>
  isHebrewLeapYear(year) ? 13 : 12;

const getHebrewMonthDays = (year: number, month: number) => {
  if ([1, 3, 5, 7, 11].includes(month)) {
    return 30;
  }

  if ([2, 4, 6, 10, 13].includes(month)) {
    return 29;
  }

  if (month === 8) {
    return hasLongHeshvan(year) ? 30 : 29;
  }

  if (month === 9) {
    return hasShortKislev(year) ? 29 : 30;
  }

  if (month === 12) {
    return isHebrewLeapYear(year) ? 30 : 29;
  }

  return 29;
};

const gregorianToJulianDay = (date: Date) => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();

  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const century = Math.floor(year / 100);
  const correction = 2 - century + Math.floor(century / 4);

  return Math.floor(
    Math.floor(365.25 * (year + 4716)) +
      Math.floor(30.6001 * (month + 1)) +
      day +
      correction -
      1524.5 +
      0.5,
  );
};

const hebrewToJulianDay = (year: number, month: number, day: number) => {
  let julianDay = HEBREW_EPOCH + getHebrewCalendarElapsedDays(year) + day - 1;

  if (month < 7) {
    for (
      let currentMonth = 7;
      currentMonth <= getHebrewMonthsInYear(year);
      currentMonth += 1
    ) {
      julianDay += getHebrewMonthDays(year, currentMonth);
    }

    for (let currentMonth = 1; currentMonth < month; currentMonth += 1) {
      julianDay += getHebrewMonthDays(year, currentMonth);
    }
  } else {
    for (let currentMonth = 7; currentMonth < month; currentMonth += 1) {
      julianDay += getHebrewMonthDays(year, currentMonth);
    }
  }

  return julianDay;
};

const getHebrewDateParts = (date: Date) => {
  const julianDay = gregorianToJulianDay(date);
  let year = Math.floor(((julianDay - HEBREW_EPOCH) * 98496) / 35975351) + 1;

  while (julianDay >= hebrewToJulianDay(year + 1, 7, 1)) {
    year += 1;
  }

  while (julianDay < hebrewToJulianDay(year, 7, 1)) {
    year -= 1;
  }

  let month = julianDay < hebrewToJulianDay(year, 1, 1) ? 7 : 1;

  while (
    julianDay > hebrewToJulianDay(year, month, getHebrewMonthDays(year, month))
  ) {
    month += 1;
  }

  const day = julianDay - hebrewToJulianDay(year, month, 1) + 1;

  return {day, month, year};
};

export const formatHebrewDate = (date: Date) => {
  const {day, month, year} = getHebrewDateParts(date);
  const monthName = getHebrewMonthName(year, month);

  if (!Number.isFinite(day) || !Number.isFinite(year) || !monthName) {
    return '';
  }

  return `${toHebrewNumeral(day)} ${monthName} ${toHebrewNumeral(year)}`;
};

export const calculateAge = (date: Date) => {
  const today = new Date();
  const birthDate = new Date(date);
  let age_now = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age_now--;
  }
  return age_now;
};

export const getDateBefore = (years: number) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return date;
};

export const groupBy = (array: any[], key: string) => {
  return array.reduce((result: any[], item: any) => {
    const collapseTitle = item[key];
    const {...rest} = item;
    const existingGroup = result.find(
      (group: any) => group.title === collapseTitle,
    );

    if (existingGroup) {
      existingGroup.data.push(rest);
    } else {
      result.push({
        title: collapseTitle,
        data: [rest],
      });
    }
    return result;
  }, []);
};

export const sendEmail = async (to = '', subject = '', body = '') => {
  let url = `mailto:${to}`;

  const query = qs.stringify({
    subject,
    body,
  });

  if (query.length) {
    url += `?${query}`;
  }

  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      return false;
    }

    await Linking.openURL(url);
    return true;
  } catch (error) {
    console.warn('Unable to open email client:', error);
    return false;
  }
};

const getRelationshipStatus = (profile: any) =>
  profile.relationshipStatus ||
  (profile.archivedReason === 'married'
    ? 'married'
    : profile.archivedReason === 'engaged'
      ? 'engaged'
      : 'single');

const normalizeLookupKey = (value: unknown) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');

const PROFILE_STATUS_ALIASES: Record<string, string[]> = {
  single: ['single'],
  singleStatus: [
    'singleStatus',
    'singleStatusMale',
    'singleStatusFemale',
  ],
  divorced: ['divorced'],
  divorcedStatus: [
    'divorcedStatus',
    'divorcedStatusMale',
    'divorcedStatusFemale',
  ],
  widower: ['widower'],
  widowedStatus: [
    'widowedStatus',
    'widowedStatusMale',
    'widowedStatusFemale',
  ],
  widowedWithChildrenStatus: [
    'widowerWithChildren',
    'widowedWithChildrenStatus',
    'widowedWithChildrenStatusMale',
    'widowedWithChildrenStatusFemale',
  ],
  divorcedWithChildrenStatus: [
    'divorcedWithChildren',
    'divorcedWithChildrenStatus',
    'divorcedWithChildrenStatusMale',
    'divorcedWithChildrenStatusFemale',
  ],
};

const PROFILE_STATUS_ALIAS_MAP = Object.entries(PROFILE_STATUS_ALIASES).reduce<
  Record<string, string>
>((result, [status, aliases]) => {
  aliases.forEach(alias => {
    result[normalizeLookupKey(alias)] = status;
  });

  return result;
}, {});

const normalizeProfileStatus = (status: unknown) => {
  const normalized = String(status || '').trim();
  const statusKey = normalizeLookupKey(normalized);

  if (!normalized || statusKey === 'active' || statusKey === 'archived') {
    return '';
  }

  return PROFILE_STATUS_ALIAS_MAP[statusKey] ?? normalized;
};

const normalizeGenderKey = (gender: unknown): 'male' | 'female' | undefined => {
  const normalizedGender = String(gender || '').trim().toLowerCase();

  if (normalizedGender === 'male' || normalizedGender === '1') {
    return 'male';
  }

  if (normalizedGender === 'female' || normalizedGender === '2') {
    return 'female';
  }

  return undefined;
};

const getGenderedStatusKey = (status: string, gender: unknown) => {
  const genderKey = normalizeGenderKey(gender);

  if (!genderKey) {
    return status;
  }

  const statusMap: Record<string, Record<'male' | 'female', string>> = {
    single: {
      male: 'singleStatusMale',
      female: 'singleStatusFemale',
    },
    singleStatus: {
      male: 'singleStatusMale',
      female: 'singleStatusFemale',
    },
    divorced: {
      male: 'divorcedStatusMale',
      female: 'divorcedStatusFemale',
    },
    divorcedStatus: {
      male: 'divorcedStatusMale',
      female: 'divorcedStatusFemale',
    },
    widower: {
      male: 'widowedStatusMale',
      female: 'widowedStatusFemale',
    },
    widowedStatus: {
      male: 'widowedStatusMale',
      female: 'widowedStatusFemale',
    },
    widowedWithChildrenStatus: {
      male: 'widowedWithChildrenStatusMale',
      female: 'widowedWithChildrenStatusFemale',
    },
    divorcedWithChildrenStatus: {
      male: 'divorcedWithChildrenStatusMale',
      female: 'divorcedWithChildrenStatusFemale',
    },
  };

  return statusMap[status]?.[genderKey] ?? status;
};

const getProfileCardStatus = (profile: any) => {
  const status = normalizeProfileStatus(
    profile.maritalStatus || profile.familyStatus || profile.status,
  );

  if (status) {
    return status;
  }

  const relationshipStatus = String(profile.relationshipStatus || '').trim();

  return relationshipStatus === 'single' ? 'singleStatus' : '';
};

export const getCardStatusText = (
  status: unknown,
  numOfChildren: number | undefined,
  translate: (key: string) => string,
  gender?: unknown,
) => {
  const normalizedStatus = normalizeProfileStatus(status);
  const statusKey = normalizedStatus
    ? getGenderedStatusKey(normalizedStatus, gender)
    : '';
  const statusText = statusKey ? translate(statusKey) : '';

  return `${statusText}${
    statusText && Number(numOfChildren) > 0 ? Number(numOfChildren) : ''
  }`;
};

export const normalizeImages = (images: unknown): string[] => {
  if (typeof images === 'string') {
    try {
      return normalizeImages(JSON.parse(images));
    } catch {
      return images.trim() ? [images.trim()] : [];
    }
  }

  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .map(image => {
      if (typeof image === 'string') {
        return image.trim();
      }

      if (image && typeof image === 'object') {
        const imageObject = image as {
          uri?: string;
          url?: string;
          path?: string;
          base64?: string;
          type?: string;
        };
        const directUri = imageObject.uri || imageObject.url || imageObject.path;

        if (directUri) {
          return String(directUri).trim();
        }

        if (imageObject.base64) {
          return `data:${imageObject.type || 'image/jpeg'};base64,${
            imageObject.base64
          }`;
        }
      }

      return '';
    })
    .filter(Boolean);
};

export const formatTimePart = (value: number) => String(value).padStart(2, '0');

export const normalizeMeetingTime = (value?: string | number) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const text = String(value).trim();

  if (/^\d{1,2}$/.test(text)) {
    const hours = Number(text);

    if (hours > 23) {
      return undefined;
    }

    return `${formatTimePart(hours)}:00`;
  }

  const match = text.match(/^(\d{1,2}):(\d{1,2})$/);

  if (!match) {
    return undefined;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) {
    return undefined;
  }

  return `${formatTimePart(hours)}:${formatTimePart(minutes)}`;
};

export const mapProfileToCard = (profile: any): MatchCardType => {
  const relationshipStatus = getRelationshipStatus(profile);
  const normalizedImages = normalizeImages(profile.images);
  const gender = String(profile.gender || 'female');

  return {
    profileId: String(profile._id || profile.id || ''),
    createdAt: profile.createdAt ? String(profile.createdAt) : undefined,
    name: profile.fullName || profile.name || '—',
    age: Number(profile.age) || 0,
    height: String(profile.hight || profile.height || ''),
    status: getProfileCardStatus(profile),
    maritalStatus: normalizeProfileStatus(
      profile.maritalStatus || profile.familyStatus || profile.status,
    ),
    images: normalizedImages.length
      ? normalizedImages
      : [getDefaultProfileImage(gender)],
    numOfChildren: Number(profile.countOfChildren) || 0,
    gender,
    phone: String(profile.phone || ''),
    matcherPhone: String(profile.matcherPhone || ''),
    matcherMail: profile.matcherMail,
    matcherName: profile.matcherName,
    mail: profile.mail,
    city: profile.city,
    tribe: profile.tribe ? String(profile.tribe) : undefined,
    hashkafa: profile.hashkafa ? String(profile.hashkafa) : undefined,
    whatWorks: profile.whatWorks ? String(profile.whatWorks) : undefined,
    education: profile.education ? String(profile.education) : undefined,
    importantInfo: profile.importantInfo
      ? String(profile.importantInfo)
      : undefined,
    familyInfo: profile.familyInfo ? String(profile.familyInfo) : undefined,
    matchImportantInfo: profile.matchImportantInfo
      ? String(profile.matchImportantInfo)
      : undefined,
    helpWithMoney: profile.helpWithMoney
      ? String(profile.helpWithMoney)
      : undefined,
    helpWithMoneyDetails: profile.helpWithMoneyDetails
      ? String(profile.helpWithMoneyDetails)
      : undefined,
    hobbies: profile.hobbies ? String(profile.hobbies) : undefined,
    relationshipStatus,
    partnerProfileId: profile.partnerProfileId
      ? String(profile.partnerProfileId)
      : undefined,
    partnerName: profile.partnerName,
    partnerOutsideApp: Boolean(profile.partnerOutsideApp),
    assignedMatchmaker: profile.assignedMatchmaker
      ? String(profile.assignedMatchmaker)
      : undefined,
    offered: false,
    met: false,
    isShowInfoButtons: false,
    isShowMeetingInfo: false,
    collaborationMatchmaker: profile.collaborationMatchmaker
      ? String(profile.collaborationMatchmaker)
      : undefined,
    meetingStatus:
      profile.meetingStatus === 'busy' || profile.meetingStatus === 'available'
        ? profile.meetingStatus
        : 'available',
    meetingDate: profile.meetingDate ? String(profile.meetingDate) : undefined,
    meetingTime: normalizeMeetingTime(profile.meetingTime),
    meetingLocation: profile.meetingLocation
      ? String(profile.meetingLocation)
      : undefined,
  };
};
