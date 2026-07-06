import React, {useEffect, useMemo, useState} from 'react';
import {ScrollView, Text, TextInput, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import DatePicker from 'react-native-date-picker';
import Colors from '../../utils/Colors';

import CustomButton, {
  BUTTON_ICON_SIZE,
} from '../../components/CustomButton/CustomButton';
import CustomModal from '../../components/CustomModal/CustomModal';
import CloseIcon from '../../components/CloseIcon/CloseIcon';
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
import {useMessage} from '../../utils/MessageProvider';
import api from '../../services/api';
import EditSvg from '../../assets/images/edit.svg';
import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';

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

const getMeetingPairKey = (meeting: MatchCardType) => {
  const profileIds = [meeting.profileId, meeting.partnerProfileId]
    .map(value => String(value || '').trim())
    .filter(Boolean)
    .sort();

  if (profileIds.length === 2) {
    return profileIds.join('|');
  }

  return [meeting.name, meeting.partnerName]
    .map(value =>
      String(value || '')
        .trim()
        .toLowerCase(),
    )
    .filter(Boolean)
    .sort()
    .join('|');
};

const isMeetingDateTimeInPast = (dateValue?: string, timeValue?: string) => {
  const normalizedTime = normalizeMeetingTime(timeValue);

  if (!dateValue || !normalizedTime) {
    return false;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const [hours, minutes] = normalizedTime.split(':').map(Number);
  const meetingDateTime = new Date(date);
  meetingDateTime.setHours(hours, minutes, 0, 0);

  return meetingDateTime.getTime() <= Date.now();
};

const MeetingCalendarScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {language, t, isRTL} = useLanguage();
  const {showMessage} = useMessage();
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [meetings, setMeetings] = useState<MatchCardType[]>([]);
  const [hasLoadedMeetings, setHasLoadedMeetings] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<MatchCardType | null>(
    null,
  );
  const [editMeetingDate, setEditMeetingDate] = useState('');
  const [editMeetingTime, setEditMeetingTime] = useState('');
  const [editMeetingLocation, setEditMeetingLocation] = useState('');
  const [isEditDateOpen, setIsEditDateOpen] = useState(false);
  const canEditMeetings =
    sessionUser?.role === 'admin' || sessionUser?.role === 'matchmaker';

  useEffect(() => {
    getSessionUser().then(setSessionUser);
  }, []);

  const fetchMeetings = React.useCallback(async () => {
    setHasLoadedMeetings(false);

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
    } finally {
      setHasLoadedMeetings(true);
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
          const partnerProfileId = String(
            meeting.partnerProfileId || '',
          ).trim();

          if (!partnerProfileId) {
            return true;
          }

          const partner = meetings.find(
            candidate => String(candidate.profileId || '') === partnerProfileId,
          );

          return (
            !partner ||
            String(partner.partnerProfileId || '') ===
              String(meeting.profileId || '')
          );
        })
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
              meeting.assignedMatchmaker === sessionUser?.id ||
              meeting.collaborationMatchmaker === sessionUser?.id
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
        .filter(
          (meeting, index, filteredMeetings) =>
            filteredMeetings.findIndex(
              candidateMeeting =>
                getMeetingPairKey(candidateMeeting) ===
                getMeetingPairKey(meeting),
            ) === index,
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

  const today = useMemo(() => {
    const nextToday = new Date();
    nextToday.setHours(0, 0, 0, 0);
    return nextToday;
  }, []);

  const editMeetingDateValue = editMeetingDate
    ? new Date(editMeetingDate)
    : new Date();
  const editMeetingDateText = editMeetingDate
    ? formatMeetingDayTitle(editMeetingDate, language, 'meetingDate')
    : t('meetingDate');
  const hasInvalidEditMeetingTime =
    Boolean(editMeetingTime) &&
    normalizeMeetingTime(editMeetingTime) !== editMeetingTime;
  const hasPastEditMeetingTime = isMeetingDateTimeInPast(
    editMeetingDate,
    editMeetingTime,
  );

  const openEditMeeting = (meeting: MatchCardType) => {
    if (!canEditMeetings) {
      showMessage({type: 'error', message: t('errorProfileAccessDenied')});
      return;
    }

    navigation.navigate('MatchCardsScreen', {
      card: meeting,
      openMeetingModal: true,
      meetingEditToken: Date.now(),
    });
  };

  const openProfile = (profileId?: string) => {
    const normalizedProfileId = String(profileId || '').trim();
    const profile = meetings.find(
      meeting => String(meeting.profileId || '') === normalizedProfileId,
    );

    if (!profile) {
      showMessage({type: 'error', message: t('profileNotFoundForUpdate')});
      return;
    }

    navigation.navigate('MatchCardsScreen', {card: profile});
  };

  const closeEditMeeting = () => {
    setEditingMeeting(null);
    setEditMeetingDate('');
    setEditMeetingTime('');
    setEditMeetingLocation('');
    setIsEditDateOpen(false);
  };

  const saveEditMeeting = async () => {
    if (!editingMeeting?.profileId) {
      showMessage({type: 'error', message: t('errorGeneric')});
      return;
    }

    const normalizedMeetingTime = normalizeMeetingTime(editMeetingTime);

    if (!editMeetingDate) {
      showMessage({type: 'error', message: t('meetingDateRequired')});
      return;
    }

    if (!normalizedMeetingTime) {
      showMessage({type: 'error', message: t('meetingTimeRequired')});
      return;
    }

    if (isMeetingDateTimeInPast(editMeetingDate, normalizedMeetingTime)) {
      showMessage({type: 'error', message: t('meetingTimeInPast')});
      return;
    }

    if (!editMeetingLocation.trim()) {
      showMessage({type: 'error', message: t('meetingLocationRequired')});
      return;
    }

    try {
      await api.put(`/api/profiles/${editingMeeting.profileId}`, {
        meetingStatus: 'busy',
        meetingDate: editMeetingDate,
        meetingTime: normalizedMeetingTime,
        meetingLocation: editMeetingLocation.trim(),
      });

      closeEditMeeting();
      await fetchMeetings();
    } catch (error) {
      console.warn('Failed to update meeting from calendar', error);
      showMessage({type: 'error', message: t('errorServer')});
    }
  };

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

        {!hasLoadedMeetings ? null : meetingsByDate.length ? (
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
              {group.meetings.map(meeting => {
                const hasMet =
                  meeting.met ||
                  isMeetingDateTimeInPast(
                    meeting.meetingDate,
                    meeting.meetingTime,
                  );

                return (
                  <WhiteCard
                    key={`${meeting.profileId}_${meeting.meetingDate}`}
                    customStyle={styles.meetingCard}>
                    <View
                      style={[
                        styles.meetingTopRow,
                        isRTL
                          ? styles.meetingTopRowRtl
                          : styles.meetingTopRowLtr,
                      ]}>
                      <CustomButton
                        accessibilityLabel={t('editMeeting')}
                        customStyle={styles.editMeetingButton}
                        icon={
                          <EditSvg
                            width={BUTTON_ICON_SIZE}
                            height={BUTTON_ICON_SIZE}
                          />
                        }
                        onPress={() => openEditMeeting(meeting)}
                      />

                      <View style={styles.meetingMain}>
                        <View
                          style={[
                            styles.meetingNamesRow,
                            isRTL
                              ? styles.meetingNamesRowRtl
                              : styles.meetingNamesRowLtr,
                          ]}>
                          <CustomButton
                            unstyled
                            accessibilityLabel={meeting.name}
                            onPress={() => openProfile(meeting.profileId)}>
                            <CustomText
                              text={meeting.name}
                              customStyle={styles.meetingNameLink}
                            />
                          </CustomButton>

                          {meeting.partnerName ? (
                            <>
                              <CustomText
                                text={isRTL ? 'ו' : 'and'}
                                customStyle={styles.meetingNameSeparator}
                              />
                              {meeting.partnerProfileId ? (
                                <CustomButton
                                  unstyled
                                  accessibilityLabel={meeting.partnerName}
                                  onPress={() =>
                                    openProfile(meeting.partnerProfileId)
                                  }>
                                  <CustomText
                                    text={meeting.partnerName}
                                    customStyle={styles.meetingNameLink}
                                  />
                                </CustomButton>
                              ) : (
                                <CustomText
                                  text={meeting.partnerName}
                                  customStyle={styles.meetingName}
                                />
                              )}
                            </>
                          ) : null}
                        </View>
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
                        <View
                          style={[
                            styles.meetingStatusBadge,
                            hasMet
                              ? styles.meetingStatusMet
                              : styles.meetingStatusPending,
                          ]}>
                          <CustomText
                            text={hasMet ? 'meetingMet' : 'meetingNotMetYet'}
                            customStyle={[
                              styles.meetingStatusText,
                              hasMet
                                ? styles.meetingStatusMetText
                                : styles.meetingStatusPendingText,
                            ]}
                          />
                        </View>
                      </View>
                    </View>
                  </WhiteCard>
                );
              })}
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

      <CustomModal
        transparent
        animationType="fade"
        visible={Boolean(editingMeeting)}
        onRequestClose={closeEditMeeting}>
        <View style={styles.modalOverlay}>
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled">
            <View style={styles.editModal}>
              <View
                style={[
                  styles.modalHeader,
                  isRTL ? styles.modalHeaderRtl : styles.modalHeaderLtr,
                ]}>
                <CustomText
                  text="meetingManagement"
                  customStyle={styles.modalTitle}
                />
                <CustomButton
                  variant="icon"
                  style={styles.modalCloseButton}
                  onPress={closeEditMeeting}>
                  <CloseIcon />
                </CustomButton>
              </View>

              <View style={styles.modalField}>
                <CustomText
                  text="meetingDate"
                  customStyle={[
                    styles.modalFieldLabel,
                    isRTL ? styles.textRtl : styles.textLtr,
                  ]}
                />
                <CustomButton
                  unstyled
                  activeOpacity={0.85}
                  style={styles.modalInputBox}
                  onPress={() => setIsEditDateOpen(true)}>
                  <Text
                    style={[
                      styles.modalInputText,
                      isRTL ? styles.textRtl : styles.textLtr,
                    ]}>
                    {editMeetingDateText}
                  </Text>
                </CustomButton>
              </View>

              <View style={styles.modalField}>
                <CustomText
                  text="meetingTime"
                  customStyle={[
                    styles.modalFieldLabel,
                    isRTL ? styles.textRtl : styles.textLtr,
                  ]}
                />
                <TextInput
                  value={editMeetingTime}
                  onChangeText={setEditMeetingTime}
                  style={[
                    styles.modalTextInput,
                    isRTL ? styles.textRtl : styles.textLtr,
                  ]}
                  placeholder="HH:mm"
                  placeholderTextColor={Colors.placeholder}
                  keyboardType="default"
                />
                {hasInvalidEditMeetingTime && (
                  <CustomText
                    text="invalidMeetingTime"
                    customStyle={styles.validationText}
                  />
                )}
                {hasPastEditMeetingTime && (
                  <CustomText
                    text="meetingTimeInPast"
                    customStyle={styles.validationText}
                  />
                )}
              </View>

              <View style={styles.modalField}>
                <CustomText
                  text="meetingLocation"
                  customStyle={[
                    styles.modalFieldLabel,
                    isRTL ? styles.textRtl : styles.textLtr,
                  ]}
                />
                <TextInput
                  value={editMeetingLocation}
                  onChangeText={setEditMeetingLocation}
                  style={[
                    styles.modalTextInput,
                    isRTL ? styles.textRtl : styles.textLtr,
                  ]}
                  placeholder={t('meetingLocation')}
                  placeholderTextColor={Colors.placeholder}
                />
              </View>

              <View
                style={[
                  styles.modalActions,
                  isRTL ? styles.modalActionsRtl : styles.modalActionsLtr,
                ]}>
                <CustomButton
                  text="save"
                  customStyle={styles.saveButton}
                  customTextStyle={styles.saveButtonText}
                  onPress={saveEditMeeting}
                  isDisabled={
                    hasInvalidEditMeetingTime || hasPastEditMeetingTime
                  }
                />
                <CustomButton
                  variant="secondary"
                  text="cancel"
                  customStyle={styles.cancelButton}
                  customTextStyle={styles.cancelButtonText}
                  onPress={closeEditMeeting}
                />
              </View>

              <DatePicker
                modal
                open={isEditDateOpen}
                date={
                  Number.isNaN(editMeetingDateValue.getTime())
                    ? new Date()
                    : editMeetingDateValue
                }
                minimumDate={today}
                mode="date"
                onConfirm={date => {
                  setIsEditDateOpen(false);
                  setEditMeetingDate(date.toISOString());
                }}
                onCancel={() => setIsEditDateOpen(false)}
              />
            </View>
          </ScrollView>
        </View>
      </CustomModal>
    </HomeScreen>
  );
};

export default MeetingCalendarScreen;
