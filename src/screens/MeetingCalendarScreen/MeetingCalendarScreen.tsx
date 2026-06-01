import React, {useEffect, useMemo, useState} from 'react';
import {Text, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import CustomButton from '../../components/CustomButton/CustomButton';
import CustomText from '../../components/CustomText/CustomText';
import {MatchCardType} from '../../components/MatchCard/MatchCard.type';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import HomeScreen from '../HomeScreen/HomeScreen';
import {styles} from './MeetingCalendarScreen.style';
import {SessionUser, getSessionUser} from '../../services/session';
import {
  formatHebrewDate,
  mapProfileToCard,
  normalizeMeetingTime,
} from '../../utils/generalFunction';
import {useLanguage} from '../../utils/LanguageProvider';
import api from '../../services/api';
import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';
import EditSvg from '../../assets/images/edit.svg';

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
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {language, t, isRTL} = useLanguage();
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [meetings, setMeetings] = useState<MatchCardType[]>([]);

  useEffect(() => {
    getSessionUser().then(setSessionUser);
  }, []);

  const fetchMeetings = React.useCallback(async () => {
    try {
      const response = await api.get('/api/profiles');

      const profiles = Array.isArray(response.data?.profiles)
        ? response.data.profiles
        : [];
      console.log(
        'CALENDAR DEBUG:',
        profiles.map((profile: any) => ({
          name: profile.fullName,
          meetingStatus: profile.meetingStatus,
          meetingDate: profile.meetingDate,
          meetingTime: profile.meetingTime,
          normalizedMeetingTime: normalizeMeetingTime(profile.meetingTime),
          matcherPhone: profile.matcherPhone,
        })),
      );
      setMeetings(profiles.map(mapProfileToCard));
    } catch (error) {
      console.log('CALENDAR FETCH ERROR:', error);
      setMeetings([]);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log('MEETING CALENDAR FOCUSED');

      fetchMeetings();
    }, [fetchMeetings]),
  );

  const scheduledMeetings = useMemo(
    () =>
      meetings
        .filter(meeting => meeting.meetingStatus === 'busy')
        .filter(meeting => {
          const sessionPhone = sessionUser?.phone.replace(/\D/g, '') ?? '';
          const matcherPhone = meeting.matcherPhone.replace(/\D/g, '');
          const candidatePhone = meeting.phone.replace(/\D/g, '');

          if (!sessionPhone) {
            return false;
          }

          if (sessionUser?.role === 'matchmaker') {
            return (
              matcherPhone === sessionPhone ||
              meeting.assignedMatchmaker === sessionUser?.id
            );
          }

          if (sessionUser?.role === 'admin') {
            return true;
          }

          return candidatePhone === sessionPhone;
        })
        .filter(
          (
            meeting,
          ): meeting is MatchCardType & {
            meetingDate: string;
          } => Boolean(meeting.meetingDate),
        )
        .filter(meeting => {
          const meetingDate = new Date(meeting.meetingDate);

          if (Number.isNaN(meetingDate.getTime())) {
            return false;
          }

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          meetingDate.setHours(0, 0, 0, 0);

          return meetingDate >= today;
        })
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
        {
          dateKey: string;
          dateValue: string;
          meetings: typeof scheduledMeetings;
        }[]
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
            <CustomText
              text="meetingsInCalendar"
              customStyle={styles.summaryLabel}
            />
          </View>
        </View>

        {meetingsByDate.length ? (
          meetingsByDate.map(group => (
            <View key={group.dateKey} style={styles.dayGroup}>
              <CustomText
                text={formatMeetingDayTitle(
                  group.dateValue,
                  language,
                  'notSet',
                )}
                customStyle={styles.dayTitle}
              />
              {group.meetings.map(meeting => (
                <WhiteCard
                  key={`${meeting.profileId}_${meeting.meetingDate}`}
                  customStyle={styles.meetingCard}>
                  <View
                    style={[
                      styles.meetingTopRow,
                      isRTL ? styles.meetingTopRowRtl : styles.meetingTopRowLtr,
                    ]}>
                    <CustomButton
                      customStyle={styles.editMeetingButton}
                      icon={<EditSvg width={18} height={18} />}
                      onPress={() =>
                        navigation.navigate('MatchCardsScreen', {
                          card: meeting,
                          openMeetingModal: true,
                        })
                      }
                    />

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
                        <CustomText
                          text="meetingLocation"
                          customStyle={styles.detailLabel}
                        />
                        <CustomText
                          text=": "
                          customStyle={styles.detailLabel}
                        />
                        <CustomText
                          text={meeting.meetingLocation || 'notSet'}
                          customStyle={styles.detailValue}
                        />
                      </View>
                    </View>
                    <View style={styles.timeBadge}>
                      <CustomText
                        text="meetingTime"
                        customStyle={styles.timeLabel}
                      />
                      <Text style={styles.timeText}>
                        {meeting.meetingTime || t('notSet')}
                      </Text>
                    </View>
                  </View>
                </WhiteCard>
              ))}
            </View>
          ))
        ) : (
          <WhiteCard customStyle={styles.emptyCard}>
            <CustomText
              text="noMeetingsInCalendar"
              customStyle={styles.emptyTitle}
            />
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
