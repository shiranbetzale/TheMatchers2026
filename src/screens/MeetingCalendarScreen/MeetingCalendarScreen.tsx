import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';

import CustomText from '../../components/CustomText/CustomText';
import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';
import {MatchCardType} from '../../components/MatchCard/MatchCard.type';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import HomeScreen from '../HomeScreen/HomeScreen';
import {styles} from './MeetingCalendarScreen.style';
import {SessionUser, getSessionUser} from '../../services/session';
import {formatHebrewDate} from '../../utils/generalFunction';
import {useLanguage} from '../../utils/LanguageProvider';

type MeetingCalendarRouteProp = RouteProp<
  RootStackParamList,
  'MeetingCalendarScreen'
>;

const defaultMeetings: MatchCardType[] = [
  {
    name: 'XXX',
    age: 32,
    height: '1.57',
    status: 'widower',
    numOfChildren: 5,
    gender: 'female',
    city: 'cityBneiBrak',
    phone: '0549450954',
    matcherPhone: '0549450954',
    matcherName: 'matchmakerShiranBetzalel',
    meetingStatus: 'busy',
    meetingDate: new Date('2026-08-31T09:30:00').toISOString(),
    meetingTime: '09:30',
    meetingLocation: 'meetingLocationVizhnitzHotelBneiBrak',
    partnerName: 'YYY',
    images: [
      'https://www.shutterstock.com/image-photo/cartoon-3d-icon-thai-tuk-600w-2251713231.jpg',
    ],
  },
  {
    name: 'David Levi',
    age: 29,
    height: '1.78',
    status: 'single',
    numOfChildren: 0,
    gender: 'male',
    city: 'cityJerusalem',
    phone: '0521111111',
    matcherPhone: '0549450954',
    matcherName: 'matchmakerShiranBetzalel',
    meetingDate: new Date('2026-08-31T20:15:00').toISOString(),
    meetingTime: '20:15',
    meetingLocation: 'meetingLocationRamadaLobbyJerusalem',
    partnerName: 'Miriam Cohen',
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    ],
  },
];

const formatGregorianShortDate = (date: Date, locale: string) =>
  date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'numeric',
  });

const formatHebrewDateWithoutYear = (date: Date) =>
  formatHebrewDate(date).replace(/\s+\S+$/, '');

const formatMeetingDayTitle = (
  value: string | undefined,
  language: string,
  fallback: string,
) => {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  const locale = language === 'he' ? 'he-IL' : 'en-US';
  const weekday = date.toLocaleDateString(locale, {weekday: 'long'});

  if (language === 'he') {
    return `${weekday} ${formatHebrewDateWithoutYear(date)} ${formatGregorianShortDate(date, locale)}`;
  }

  return `${weekday}, ${date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
  })}`;
};

const getMeetingDayKey = (value: string) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const MeetingCalendarScreen = () => {
  const route = useRoute<MeetingCalendarRouteProp>();
  const {language, t, isRTL} = useLanguage();
  const meetings = route.params?.meetings ?? defaultMeetings;
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    getSessionUser().then(setSessionUser);
  }, []);

  const scheduledMeetings = useMemo(
    () =>
      meetings
        .filter(meeting => {
          const sessionPhone = sessionUser?.phone.replace(/\D/g, '') ?? '';
          const matcherPhone = meeting.matcherPhone.replace(/\D/g, '');
          const candidatePhone = meeting.phone.replace(/\D/g, '');

          if (!sessionPhone) {
            return false;
          }

          if (sessionUser?.role === 'matchmaker') {
            return matcherPhone === sessionPhone;
          }

          return candidatePhone === sessionPhone;
        })
        .filter((meeting): meeting is MatchCardType & {meetingDate: string} =>
          Boolean(meeting.meetingDate),
        )
        .sort(
          (meetingA, meetingB) =>
            new Date(meetingA.meetingDate).getTime() -
            new Date(meetingB.meetingDate).getTime(),
        ),
    [meetings, sessionUser],
  );

  const meetingsByDate = useMemo(
    () =>
      scheduledMeetings.reduce<
        {dateKey: string; dateValue: string; meetings: typeof scheduledMeetings}[]
      >((groups, meeting) => {
        const dateKey = getMeetingDayKey(meeting.meetingDate);
        const existingGroup = groups.find(group => group.dateKey === dateKey);

        if (existingGroup) {
          existingGroup.meetings.push(meeting);
          return groups;
        }

        groups.push({
          dateKey,
          dateValue: meeting.meetingDate,
          meetings: [meeting],
        });
        return groups;
      }, []),
    [scheduledMeetings],
  );

  return (
    <HomeScreen>
      <View style={styles.container}>
        <WhiteCard customStyle={styles.headerCard}>
          <CustomText text="matchmakerCalendar" customStyle={styles.title} />
          <CustomText
            text="meetingCalendarSubtitle"
            customStyle={styles.subtitle}
          />
        </WhiteCard>

        <View style={styles.summaryRow}>
          <View style={styles.summaryChip}>
            <CustomText
              text={`${scheduledMeetings.length}`}
              customStyle={styles.summaryValue}
            />
            <CustomText text="meetingsInCalendar" customStyle={styles.summaryLabel} />
          </View>
        </View>

        {meetingsByDate.length ? (
          meetingsByDate.map(group => (
            <View key={group.dateKey} style={styles.dayGroup}>
              <CustomText
                text={formatMeetingDayTitle(group.dateValue, language, 'notSet')}
                customStyle={styles.dayTitle}
              />
              {group.meetings.map((meeting, index) => (
                <WhiteCard
                  key={`${meeting.name}_${index}`}
                  customStyle={styles.meetingCard}>
                  <View style={styles.meetingTopRow}>
                    <View style={styles.timeBadge}>
                      <CustomText
                        text={meeting.meetingTime || 'notSet'}
                        customStyle={styles.timeText}
                      />
                    </View>
                    <View style={styles.meetingMain}>
                      <CustomText
                        text={
                          isRTL
                            ? `${meeting.name} ו${meeting.partnerName || t('partner')}`
                            : `${meeting.name} and ${meeting.partnerName || t('partner')}`
                        }
                        customStyle={styles.meetingName}
                      />
                      <View style={styles.detailRow}>
                        <CustomText text="meetingLocation" customStyle={styles.detailText} />
                        <CustomText text=": " customStyle={styles.detailText} />
                        <CustomText
                          text={meeting.meetingLocation || 'notSet'}
                          customStyle={styles.detailText}
                        />
                      </View>
                      <View style={styles.detailRow}>
                        <CustomText text="cardCityShort" customStyle={styles.detailText} />
                        <CustomText text=": " customStyle={styles.detailText} />
                        <CustomText
                          text={meeting.city || 'notSpecified'}
                          customStyle={styles.detailText}
                        />
                      </View>
                      <View style={styles.detailRow}>
                        <CustomText text="cardMatchmaker" customStyle={styles.detailText} />
                        <CustomText text=": " customStyle={styles.detailText} />
                        <CustomText
                          text={meeting.matcherName || meeting.matcherPhone}
                          customStyle={styles.detailText}
                        />
                      </View>
                    </View>
                  </View>
                </WhiteCard>
              ))}
            </View>
          ))
        ) : (
          <WhiteCard customStyle={styles.emptyCard}>
            <CustomText text="noMeetingsInCalendar" customStyle={styles.emptyTitle} />
            <CustomText
              text="meetingCalendarEmptyText"
              customStyle={styles.emptyText}
            />
          </WhiteCard>
        )}
      </View>
    </HomeScreen>
  );
};

export default MeetingCalendarScreen;
