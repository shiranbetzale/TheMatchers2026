import qs from 'qs';
import { Linking } from 'react-native';

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

const isHebrewLeapYear = (year: number) => ((7 * year + 1) % 19) < 7;

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
  let day =
    1 + 29 * monthsElapsed + Math.floor(hoursElapsed / 24);
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
  getHebrewCalendarElapsedDays(year + 1) -
  getHebrewCalendarElapsedDays(year);

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
  let year =
    Math.floor(((julianDay - HEBREW_EPOCH) * 98496) / 35975351) + 1;

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
    const { ...rest } = item;
    const existingGroup = result.find((group: any) => group.title === collapseTitle);

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

export const sendEmail = async (to = "", subject = "", body = "") => {
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
