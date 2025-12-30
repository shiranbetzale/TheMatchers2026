import qs from 'qs';
import { Linking } from 'react-native';

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

  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) {
    throw new Error('Provided URL cannot be handled');
  }

  return Linking.openURL(url);
};
