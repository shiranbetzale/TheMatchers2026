import React, {useEffect, useState} from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import DatePicker from 'react-native-date-picker';

import CurrentCard from '../../components/CurrentCard/CurrentCard';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomSelect from '../../components/CustomSelect/CustomSelect';
import CustomText from '../../components/CustomText/CustomText';
import MatchCard from '../../components/MatchCard/MatchCard';
import {MatchCardType} from '../../components/MatchCard/MatchCard.type';
import HomeScreen from '../HomeScreen/HomeScreen';
import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';
import {UserRole, getSessionRole, getSessionUser} from '../../services/session';
import ClockSvg from '../../assets/images/clock.svg';
import DatePickerSvg from '../../assets/images/datePicker.svg';
import LocationSvg from '../../assets/images/location.svg';
import {useLanguage} from '../../utils/LanguageProvider';
import {useMessage} from '../../utils/MessageProvider';
import api from '../../services/api';
import {isArchivedCard} from '../../utils/archiveCards';
import {Option} from '../../utils/FormFields.type';

import {styles} from './MatchCardsScreen.style';
import {SelectOptionWithValue} from './MatchCardsScreen.type';
import {
  formatTimePart,
  getDefaultProfileImage,
  mapProfileToCard,
  normalizeMeetingTime,
} from '../../utils/generalFunction';
import {buildAiSortedMatches} from '../../utils/matchScoring';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type MatchCardsRouteProp = RouteProp<RootStackParamList, 'MatchCardsScreen'>;
type MeetingStatus = NonNullable<MatchCardType['meetingStatus']>;

const buildMatchmakerOptions = (
  profiles: any[],
  users: any[],
): SelectOptionWithValue[] => {
  const matchmakerMap = new Map<string, string>();

  users.forEach((user: any) => {
    const userId = String(user.id || user._id || '').trim();
    const userName = String(user.fullName || user.name || '').trim();
    const userRole = String(user.role || '').trim();

    if (
      userId &&
      userName &&
      (userRole === 'matchmaker' || userRole === 'admin')
    ) {
      matchmakerMap.set(userId, userName);
    }
  });

  profiles.forEach((profile: any) => {
    const assignedMatchmaker = String(profile.assignedMatchmaker || '').trim();
    const matcherName = String(profile.matcherName || '').trim();

    if (assignedMatchmaker && matcherName) {
      matchmakerMap.set(assignedMatchmaker, matcherName);
    }
  });

  return Array.from(matchmakerMap.entries()).map(
    ([matchmakerId, matcherName], index) => ({
      id: index + 1,
      name: 'collaborationMatchmaker',
      label: matcherName,
      value: matchmakerId,
    }),
  );
};

const buildMatchmakerEmailMap = (users: any[]) =>
  users.reduce<Record<string, string>>((acc, user: any) => {
    const userId = String(user.id || user._id || '').trim();
    const userEmail = String(user.email || '').trim();

    if (userId && userEmail) {
      acc[userId] = userEmail;
    }

    return acc;
  }, {});

const DEFAULT_CURRENT_CARD: MatchCardType = {
  gender: 'female',
  name: 'XXX',
  age: 32,
  height: '1.57',
  status: 'widower',
  numOfChildren: 5,
  city: 'cityBneiBrak',
  images: [getDefaultProfileImage('female')],
  mail: '',
  phone: '',
  matcherPhone: '',
  matcherName: '',
  meetingStatus: 'available',
};
const MatchCardsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<MatchCardsRouteProp>();
  const {isRTL, language, t} = useLanguage();
  const {showMessage} = useMessage();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [isMeetingDateOpen, setIsMeetingDateOpen] = useState(false);
  const [isMeetingTimeOpen, setIsMeetingTimeOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [timePickerValue, setTimePickerValue] = useState('09:00');
  const [matchArray, setMatchArray] = useState<MatchCardType[]>([]);
  const [hasLoadedMatches, setHasLoadedMatches] = useState(false);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [matchmakerOptions, setMatchmakerOptions] = useState<
    SelectOptionWithValue[]
  >([]);
  const [partnerOptions, setPartnerOptions] = useState<Option[]>([]);
  const [partnerByName, setPartnerByName] = useState<Record<string, string>>(
    {},
  );
  const [partnerMatchmakerById, setPartnerMatchmakerById] = useState<
    Record<string, string>
  >({});
  const [matchmakerEmailById, setMatchmakerEmailById] = useState<
    Record<string, string>
  >({});
  const canManageMeetings = userRole === 'matchmaker' || userRole === 'admin';

  useEffect(() => {
    getSessionRole().then(setUserRole);
    getSessionUser().then(sessionUser => {
      setCurrentUserId(sessionUser?.id ?? '');
    });
  }, []);

  const [currentCard, setCurrentCard] = useState<MatchCardType>(
    route.params?.card ?? DEFAULT_CURRENT_CARD,
  );

  useEffect(() => {
    if (route.params?.card) {
      setCurrentCard(route.params.card);
    }
  }, [route.params?.card]);

  useEffect(() => {
    if (!route.params?.openMeetingModal || userRole === null) {
      return;
    }

    if (!canManageMeetings) {
      showMessage({type: 'error', message: t('errorProfileAccessDenied')});
      return;
    }

    setIsMeetingModalOpen(true);
  }, [
    canManageMeetings,
    route.params?.meetingEditToken,
    route.params?.openMeetingModal,
    showMessage,
    t,
    userRole,
  ]);

  const fetchCurrentCardDetails = React.useCallback(async () => {
    try {
      const profileId = currentCard.profileId;
      let profile: any;

      if (profileId) {
        try {
          const response = await api.get(`/api/profiles/${profileId}`);
          profile = response.data?.profile;
        } catch (error: any) {
          if (error?.response?.status !== 404) {
            throw error;
          }
        }
      }

      if (!profile && currentCard.phone) {
        const response = await api.get('/api/profiles');
        const profiles = Array.isArray(response.data?.profiles)
          ? response.data.profiles
          : [];

        profile = profiles.find(
          (item: any) =>
            String(item.phone || '').replace(/\D/g, '') ===
            String(currentCard.phone || '').replace(/\D/g, ''),
        );
      }

      if (profile) {
        setCurrentCard(prev => ({
          ...prev,
          ...mapProfileToCard(profile),
        }));
      }
    } catch (error) {
      console.warn('Failed to fetch current card details', error);
    }
  }, [currentCard.phone, currentCard.profileId]);

  useEffect(() => {
    fetchCurrentCardDetails();
  }, [fetchCurrentCardDetails]);

  const buildPartnerOptions = React.useCallback(
    (profiles: any[], selectedMatchmakerId?: string) => {
      const filteredPartners = profiles.filter((profile: any) => {
        const profileId = String(profile._id || profile.id || '');
        const relationshipStatus = String(profile.relationshipStatus || '');
        const assignedMatchmaker = String(profile.assignedMatchmaker || '');

        return (
          profileId !== currentCard.profileId &&
          relationshipStatus !== 'engaged' &&
          relationshipStatus !== 'married' &&
          (!selectedMatchmakerId || assignedMatchmaker === selectedMatchmakerId)
        );
      });

      setPartnerOptions(
        filteredPartners.map((profile: any, index: number) => ({
          id: index + 1,
          name: 'partner',
          label: String(profile.fullName || '—'),
          value: String(profile._id || profile.id || ''),
        })),
      );

      setPartnerByName(
        filteredPartners.reduce((acc: Record<string, string>, profile: any) => {
          const label = String(profile.fullName || '—');
          acc[label] = String(profile._id || profile.id || '');
          return acc;
        }, {}),
      );

      setPartnerMatchmakerById(
        filteredPartners.reduce((acc: Record<string, string>, profile: any) => {
          const profileId = String(profile._id || profile.id || '');
          const assignedMatchmaker = String(
            profile.assignedMatchmaker || '',
          ).trim();

          if (profileId && assignedMatchmaker) {
            acc[profileId] = assignedMatchmaker;
          }

          return acc;
        }, {}),
      );
    },
    [currentCard.profileId],
  );

  const fetchMatches = React.useCallback(async () => {
    setHasLoadedMatches(false);

    try {
      const [profilesResponse, matchmakersResponse] = await Promise.all([
        api.get('/api/profiles'),
        api.get('/api/users/matchmakers'),
      ]);
      const profiles = Array.isArray(profilesResponse.data?.profiles)
        ? profilesResponse.data.profiles
        : [];
      const matchmakers = Array.isArray(matchmakersResponse.data?.users)
        ? matchmakersResponse.data.users
        : [];
      const matchmakerEmailMap = buildMatchmakerEmailMap(matchmakers);
      setAllProfiles(profiles);
      setMatchmakerEmailById(matchmakerEmailMap);

      buildPartnerOptions(profiles, currentCard.collaborationMatchmaker);
      setMatchmakerOptions(buildMatchmakerOptions(profiles, matchmakers));

      const eligibleMatches: MatchCardType[] = buildAiSortedMatches(
        currentCard,
        profiles,
        {minScore: 0},
      )
        .filter((card: MatchCardType) => !isArchivedCard(card))
        .filter((card: MatchCardType) => {
          if (currentCard.profileId) {
            return card.profileId !== currentCard.profileId;
          }
          return card.phone !== currentCard.phone;
        })
        .filter((card: MatchCardType) => {
          const relationshipStatus = String(card.relationshipStatus || '');

          if (
            relationshipStatus === 'engaged' ||
            relationshipStatus === 'married'
          ) {
            return false;
          }

          if (!currentCard.gender) {
            return true;
          }

          return card.gender !== currentCard.gender;
        });
      const visibleMatches = eligibleMatches.filter(
        card => (card.aiMatchScore || 0) >= 70,
      );
      const mapped = visibleMatches.length
        ? visibleMatches
        : eligibleMatches.slice(0, 1);

      setMatchArray(
        mapped.map(card => ({
          ...card,
          matcherMail:
            card.matcherMail ||
            matchmakerEmailMap[String(card.assignedMatchmaker || '')] ||
            '',
        })),
      );
    } catch {
      setMatchArray([]);
    } finally {
      setHasLoadedMatches(true);
    }
  }, [
    buildPartnerOptions,
    currentCard.collaborationMatchmaker,
    currentCard.gender,
    currentCard.phone,
    currentCard.profileId,
  ]);

  useFocusEffect(
    React.useCallback(() => {
      fetchMatches();
    }, [fetchMatches]),
  );

  useEffect(() => {
    if (
      currentCard.collaborationMatchmaker ||
      (!currentCard.partnerProfileId && !currentCard.partnerName) ||
      allProfiles.length === 0
    ) {
      return;
    }

    const partnerProfile = allProfiles.find((profile: any) => {
      const profileId = String(profile._id || profile.id || '');
      const profileName = String(profile.fullName || '').trim();

      return currentCard.partnerProfileId
        ? profileId === currentCard.partnerProfileId
        : profileName === String(currentCard.partnerName || '').trim();
    });

    const assignedMatchmaker = String(
      partnerProfile?.assignedMatchmaker || '',
    ).trim();

    if (assignedMatchmaker) {
      setCurrentCard(card => ({
        ...card,
        collaborationMatchmaker: assignedMatchmaker,
        partnerProfileId:
          card.partnerProfileId ||
          String(partnerProfile?._id || partnerProfile?.id || '') ||
          undefined,
      }));
      buildPartnerOptions(allProfiles, assignedMatchmaker);
    }
  }, [
    allProfiles,
    buildPartnerOptions,
    currentCard.collaborationMatchmaker,
    currentCard.partnerName,
    currentCard.partnerProfileId,
  ]);

  const isMeetingBusy = currentCard.meetingStatus === 'busy';
  const selectedPartnerLabel =
    partnerOptions.find(
      option =>
        String((option as SelectOptionWithValue).value || '') ===
        String(currentCard.partnerProfileId || ''),
    )?.label ||
    allProfiles
      .map(profile => ({
        id: String(profile._id || profile.id || ''),
        name: String(profile.fullName || profile.name || '').trim(),
      }))
      .find(profile => profile.id === String(currentCard.partnerProfileId || ''))
      ?.name ||
    currentCard.partnerName ||
    '';
  const currentMeetingDate = currentCard.meetingDate
    ? new Date(currentCard.meetingDate)
    : undefined;
  const currentMeetingDateText =
    currentMeetingDate && !Number.isNaN(currentMeetingDate.getTime())
      ? currentMeetingDate.toLocaleDateString(
          language === 'he' ? 'he-IL' : 'en-US',
        )
      : 'meetingDate';
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isValidMeetingTime = (value?: string) => {
    if (!value) {
      return true;
    }

    return normalizeMeetingTime(value) === value;
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

  const updateCurrentMeetingStatus = (meetingStatus: MeetingStatus) => {
    if (!canManageMeetings) {
      return;
    }

    setCurrentCard(card => {
      const shouldResetMeetingForm =
        meetingStatus === 'available' ||
        (meetingStatus === 'busy' && card.meetingStatus !== 'busy');

      return {
        ...card,
        meetingStatus,
        ...(shouldResetMeetingForm
          ? {
              meetingDate: undefined,
              meetingTime: undefined,
              meetingLocation: undefined,
              collaborationMatchmaker: undefined,
              partnerName: undefined,
              partnerProfileId: undefined,
            }
          : {}),
      };
    });
  };

  const updateCurrentMeetingDate = (meetingDate: Date) => {
    if (!canManageMeetings) {
      return;
    }

    setCurrentCard(card => ({
      ...card,
      meetingDate: meetingDate.toISOString(),
      meetingStatus: 'busy',
    }));
  };

  const updateCurrentMeetingField = (
    field: 'meetingTime' | 'meetingLocation',
    value: string,
  ) => {
    if (!canManageMeetings) {
      return;
    }

    setCurrentCard(card => ({...card, [field]: value}));
  };

  const hasInvalidMeetingTime =
    Boolean(currentCard.meetingTime) &&
    !isValidMeetingTime(currentCard.meetingTime);
  const hasPastMeetingDateTime =
    currentCard.meetingStatus === 'busy' &&
    isMeetingDateTimeInPast(currentCard.meetingDate, currentCard.meetingTime);
  const currentMeetingTimeText =
    normalizeMeetingTime(currentCard.meetingTime) ?? 'meetingTime';
  const [selectedHour, selectedMinute] = timePickerValue.split(':').map(Number);

  const openMeetingTimePicker = () => {
    setTimePickerValue(
      normalizeMeetingTime(currentCard.meetingTime) ?? '09:00',
    );
    setIsMeetingTimeOpen(true);
  };

  const updateTimePickerValue = (field: 'hour' | 'minute', step: number) => {
    setTimePickerValue(currentValue => {
      const [currentHour, currentMinute] = currentValue.split(':').map(Number);
      const nextHour =
        field === 'hour' ? (currentHour + step + 24) % 24 : currentHour;
      const nextMinute =
        field === 'minute' ? (currentMinute + step + 60) % 60 : currentMinute;

      return `${formatTimePart(nextHour)}:${formatTimePart(nextMinute)}`;
    });
  };

  const saveMeetingTime = () => {
    updateCurrentMeetingField('meetingTime', timePickerValue);
    setIsMeetingTimeOpen(false);
  };

  const saveMeetingToServer = async () => {
    try {
      let profileId = currentCard.profileId;

      if (!profileId && currentCard.phone) {
        const response = await api.get('/api/profiles');
        const profiles = Array.isArray(response.data?.profiles)
          ? response.data.profiles
          : [];

        const matched = profiles.find(
          (item: any) =>
            String(item.phone || '').replace(/\D/g, '') ===
            String(currentCard.phone || '').replace(/\D/g, ''),
        );

        profileId = String(matched?._id || matched?.id || '');
      }

      if (!profileId) {
        showMessage({type: 'error', message: t('errorGeneric')});
        return false;
      }

      const normalizedMeetingTime = normalizeMeetingTime(
        currentCard.meetingTime,
      );

      if (currentCard.meetingStatus === 'busy') {
        if (!currentCard.meetingDate) {
          showMessage({type: 'error', message: t('meetingDateRequired')});
          return false;
        }

        if (!normalizedMeetingTime) {
          showMessage({type: 'error', message: t('meetingTimeRequired')});
          return false;
        }

        if (
          isMeetingDateTimeInPast(
            currentCard.meetingDate,
            normalizedMeetingTime,
          )
        ) {
          showMessage({type: 'error', message: t('meetingTimeInPast')});
          return false;
        }

        if (!currentCard.meetingLocation?.trim()) {
          showMessage({type: 'error', message: t('meetingLocationRequired')});
          return false;
        }

        if (!currentCard.partnerName?.trim()) {
          showMessage({type: 'error', message: t('partnerRequired')});
          return false;
        }
      }

      await api.put(`/api/profiles/${profileId}`, {
        meetingStatus: currentCard.meetingStatus || 'available',
        meetingDate:
          currentCard.meetingStatus === 'busy'
            ? currentCard.meetingDate
            : '',
        meetingTime:
          currentCard.meetingStatus === 'busy'
            ? normalizedMeetingTime
            : '',
        meetingLocation:
          currentCard.meetingStatus === 'busy'
            ? currentCard.meetingLocation?.trim()
            : '',
        collaborationMatchmaker:
          currentCard.meetingStatus === 'busy'
            ? currentCard.collaborationMatchmaker || ''
            : '',
        partnerName:
          currentCard.meetingStatus === 'busy'
            ? currentCard.partnerName?.trim()
            : '',
        partnerProfileId:
          currentCard.meetingStatus === 'busy'
            ? currentCard.partnerProfileId || ''
            : '',
      });

      await fetchCurrentCardDetails();
      return true;
    } catch (error) {
      console.warn('Failed to save meeting', error);
      const status = (error as any)?.response?.status;
      const messageKey =
        status === 403
          ? 'errorProfileAccessDenied'
          : status === 404
            ? 'profileNotFoundForUpdate'
            : 'errorServer';

      showMessage({type: 'error', message: t(messageKey)});
      return false;
    }
  };

  return (
    <HomeScreen
      pinChildren={
        <View style={styles.pinContainer}>
          <View style={[styles.header, isRTL ? styles.rowReverse : styles.row]}>
            <View
              style={[
                styles.headerText,
                isRTL ? styles.alignEnd : styles.alignStart,
              ]}>
              <CustomText
                text="matchesBoard"
                customStyle={[
                  styles.title,
                  isRTL ? styles.textRight : styles.textLeft,
                ]}
              />
              <CustomText
                text="matchesBoardSubtitle"
                customStyle={[
                  styles.subtitle,
                  isRTL ? styles.textRight : styles.textLeft,
                ]}
              />
            </View>
            <View style={styles.countBadge}>
              <CustomText
                text={`${matchArray.length}`}
                customStyle={styles.countText}
              />
              <CustomText text="matchesCount" customStyle={styles.countLabel} />
            </View>
          </View>
          <CurrentCard
            {...currentCard}
            isShowCardActions={true}
            isShowMeetingButton={canManageMeetings}
            onMeetingPress={() => setIsMeetingModalOpen(true)}
            isShowInfoButtons={false}
            currentUserRole={userRole || undefined}
            currentUserId={currentUserId}
          />
        </View>
      }>
      <View
        style={[
          styles.sectionHeader,
          isRTL ? styles.alignEnd : styles.alignStart,
        ]}>
        <CustomText
          text="suggestedMatches"
          customStyle={[
            styles.sectionTitle,
            isRTL ? styles.textRight : styles.textLeft,
          ]}
        />
      </View>
      {matchArray.map((matchItem, index) => (
        <TouchableOpacity
          key={matchItem.profileId || matchItem.phone || String(index)}
          activeOpacity={0.9}
          style={styles.card}
          onPress={() =>
            navigation.navigate('MatchCardsScreen', {
              card: matchItem,
            })
          }>
          <View
            style={[
              styles.aiScoreBar,
              isRTL ? styles.rowReverse : styles.row,
            ]}>
            <View style={styles.aiScoreBadge}>
              <CustomText
                text={`${matchItem.aiMatchScore || 1}%`}
                customStyle={styles.aiScoreValue}
              />
              <CustomText text="aiMatch" customStyle={styles.aiScoreLabel} />
            </View>

            <View
              style={[
                styles.aiReasons,
                isRTL ? styles.alignEnd : styles.alignStart,
              ]}>
              <CustomText
                text="aiMatchRecommended"
                customStyle={[
                  styles.aiReasonsTitle,
                  isRTL ? styles.textRight : styles.textLeft,
                ]}
              />
              {matchItem.aiMatchReasons?.length ? (
                <CustomText
                  text={matchItem.aiMatchReasons.join(' • ')}
                  customStyle={[
                    styles.aiReasonsText,
                    isRTL ? styles.textRight : styles.textLeft,
                  ]}
                />
              ) : null}
            </View>
          </View>
          <MatchCard
            {...matchItem}
            matcherMail={
              matchItem.matcherMail ||
              matchmakerEmailById[String(matchItem.assignedMatchmaker || '')] ||
              ''
            }
            pairedCard={currentCard}
            isShowMoreInfo={false}
            isShowInfoButtons={true}
            isShowMeetingInfo={true}
            isImagePreviewEnabled={true}
            currentUserRole={userRole || undefined}
            currentUserId={currentUserId}
          />
        </TouchableOpacity>
      ))}
      {hasLoadedMatches && matchArray.length === 0 && (
        <View
          style={[
            styles.sectionHeader,
            isRTL ? styles.alignEnd : styles.alignStart,
          ]}>
          <CustomText
            text="noMatchesCurrently"
            customStyle={[
              styles.subtitle,
              isRTL ? styles.textRight : styles.textLeft,
            ]}
          />
        </View>
      )}
      <Modal
        transparent
        animationType="fade"
        visible={isMeetingModalOpen}
        onRequestClose={() => setIsMeetingModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <ScrollView
            style={styles.meetingModalScroll}
            contentContainerStyle={styles.meetingModalScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.meetingModal}>
              <View
                style={[
                  styles.modalHeader,
                  isRTL ? styles.rowReverse : styles.row,
                ]}>
                <CustomText
                  text="meetingManagement"
                  customStyle={[
                    styles.modalTitle,
                    isRTL ? styles.textRight : styles.textLeft,
                  ]}
                />
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => {
                    setIsMeetingTimeOpen(false);
                    setIsMeetingModalOpen(false);
                  }}>
                  <CustomText text="×" customStyle={styles.modalCloseText} />
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.meetingStatusRow,
                  isRTL ? styles.rowReverse : styles.row,
                ]}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[
                    styles.statusButton,
                    currentCard.meetingStatus === 'available' &&
                      styles.statusButtonActive,
                  ]}
                  onPress={() => updateCurrentMeetingStatus('available')}>
                  <View style={styles.statusDot} />
                  <CustomText
                    text="available"
                    customStyle={[
                      styles.statusButtonText,
                      currentCard.meetingStatus === 'available' &&
                        styles.statusButtonTextActive,
                    ]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[
                    styles.statusButton,
                    currentCard.meetingStatus === 'busy' &&
                      styles.statusButtonActive,
                  ]}
                  onPress={() => updateCurrentMeetingStatus('busy')}>
                  <View style={styles.statusDot} />
                  <CustomText
                    text="busy"
                    customStyle={[
                      styles.statusButtonText,
                      currentCard.meetingStatus === 'busy' &&
                        styles.statusButtonTextActive,
                    ]}
                  />
                </TouchableOpacity>
              </View>

              {isMeetingBusy ? (
                <>
                  <View style={styles.fieldGroup}>
                    <CustomText
                      text="meetingDate"
                      customStyle={[
                        styles.fieldLabel,
                        isRTL ? styles.textRight : styles.textLeft,
                      ]}
                    />
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[
                        styles.meetingField,
                        isRTL ? styles.rowReverse : styles.row,
                      ]}
                      onPress={() => setIsMeetingDateOpen(true)}>
                      <View style={styles.meetingIconBox}>
                        <DatePickerSvg width={22} height={22} />
                      </View>
                      <Text
                        style={[
                          styles.meetingFieldText,
                          isRTL ? styles.textRight : styles.textLeft,
                        ]}>
                        {currentMeetingDateText === 'meetingDate'
                          ? t('meetingDate')
                          : currentMeetingDateText}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.fieldGroup}>
                    <CustomText
                      text="meetingTime"
                      customStyle={[
                        styles.fieldLabel,
                        isRTL ? styles.textRight : styles.textLeft,
                      ]}
                    />
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[
                        styles.meetingField,
                        isRTL ? styles.rowReverse : styles.row,
                        hasInvalidMeetingTime && styles.invalidMeetingField,
                      ]}
                      onPress={openMeetingTimePicker}>
                      <View style={styles.meetingIconBox}>
                        <ClockSvg width={22} height={22} />
                      </View>
                      <Text
                        style={[
                          styles.meetingFieldText,
                          currentMeetingTimeText !== 'meetingTime' &&
                            styles.meetingTimeText,
                          isRTL ? styles.textRight : styles.textLeft,
                        ]}>
                        {currentMeetingTimeText === 'meetingTime'
                          ? t('meetingTime')
                          : currentMeetingTimeText}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {isMeetingTimeOpen && (
                    <View style={styles.inlineTimePicker}>
                      <Text style={styles.timePickerValue}>
                        {timePickerValue}
                      </Text>

                      <View style={styles.timePickerColumns}>
                        <View style={styles.timePickerColumn}>
                          <CustomText
                            text="minutes"
                            customStyle={styles.timePickerLabel}
                          />
                          <TouchableOpacity
                            style={styles.timePickerButton}
                            onPress={() => updateTimePickerValue('minute', 5)}>
                            <CustomText
                              text="+"
                              customStyle={styles.timePickerButtonText}
                            />
                          </TouchableOpacity>
                          <Text style={styles.timePickerPart}>
                            {formatTimePart(selectedMinute)}
                          </Text>
                          <TouchableOpacity
                            style={styles.timePickerButton}
                            onPress={() => updateTimePickerValue('minute', -5)}>
                            <CustomText
                              text="-"
                              customStyle={styles.timePickerButtonText}
                            />
                          </TouchableOpacity>
                        </View>

                        <View style={styles.timePickerSeparator} />

                        <View style={styles.timePickerColumn}>
                          <CustomText
                            text="hour"
                            customStyle={styles.timePickerLabel}
                          />
                          <TouchableOpacity
                            style={styles.timePickerButton}
                            onPress={() => updateTimePickerValue('hour', 1)}>
                            <CustomText
                              text="+"
                              customStyle={styles.timePickerButtonText}
                            />
                          </TouchableOpacity>
                          <Text style={styles.timePickerPart}>
                            {formatTimePart(selectedHour)}
                          </Text>
                          <TouchableOpacity
                            style={styles.timePickerButton}
                            onPress={() => updateTimePickerValue('hour', -1)}>
                            <CustomText
                              text="-"
                              customStyle={styles.timePickerButtonText}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <CustomButton
                        text="confirmTime"
                        customStyle={styles.timePickerConfirmButton}
                        customTextStyle={styles.modalSaveText}
                        onPress={saveMeetingTime}
                      />
                    </View>
                  )}
                  {hasInvalidMeetingTime && (
                    <CustomText
                      text="invalidMeetingTime"
                      customStyle={styles.validationText}
                    />
                  )}
                  {hasPastMeetingDateTime && (
                    <CustomText
                      text="meetingTimeInPast"
                      customStyle={styles.validationText}
                    />
                  )}
                  <View style={styles.fieldGroup}>
                    <CustomText
                      text="meetingLocation"
                      customStyle={[
                        styles.fieldLabel,
                        isRTL ? styles.textRight : styles.textLeft,
                      ]}
                    />
                    <View
                      style={[
                        styles.meetingField,
                        isRTL ? styles.rowReverse : styles.row,
                      ]}>
                      <View style={styles.meetingIconBox}>
                        <LocationSvg width={22} height={22} />
                      </View>
                      <TextInput
                        style={[
                          styles.meetingInput,
                          isRTL ? styles.textRight : styles.textLeft,
                        ]}
                        placeholder={t('meetingLocation')}
                        placeholderTextColor="#9CA3AF"
                        value={currentCard.meetingLocation ?? ''}
                        onChangeText={value =>
                          updateCurrentMeetingField('meetingLocation', value)
                        }
                      />
                    </View>
                  </View>
                  <View style={styles.selectFieldContainer}>
                    <CustomSelect
                      layout="column"
                      presentation="inline"
                      text="collaborationMatchmaker"
                      value={
                        matchmakerOptions.find(
                          option =>
                            option.value ===
                            currentCard.collaborationMatchmaker,
                        )?.label || ''
                      }
                      options={matchmakerOptions}
                      onSelect={option => {
                        const selectedOption = option as
                          | SelectOptionWithValue
                          | undefined;
                        const selectedMatchmakerId =
                          selectedOption?.value || '';

                        setCurrentCard(card => ({
                          ...card,
                          collaborationMatchmaker: selectedMatchmakerId,
                          partnerName: '',
                          partnerProfileId: undefined,
                        }));

                        buildPartnerOptions(allProfiles, selectedMatchmakerId);
                      }}
                    />
                  </View>
                  <View style={styles.selectFieldContainer}>
                    <CustomSelect
                      layout="column"
                      presentation="inline"
                      text="partner"
                      value={selectedPartnerLabel}
                      options={partnerOptions}
                      onSelect={option => {
                        const selectedOption = option as
                          | SelectOptionWithValue
                          | undefined;
                        const partnerProfileId =
                          selectedOption?.value ||
                          (option?.label
                            ? partnerByName[option.label] || ''
                            : '');
                        const collaborationMatchmaker =
                          partnerProfileId
                            ? partnerMatchmakerById[partnerProfileId] || ''
                            : '';

                        setCurrentCard(card => ({
                          ...card,
                          partnerName: option?.label || '',
                          partnerProfileId: partnerProfileId || undefined,
                          collaborationMatchmaker:
                            collaborationMatchmaker ||
                            card.collaborationMatchmaker,
                        }));

                        if (collaborationMatchmaker) {
                          buildPartnerOptions(
                            allProfiles,
                            collaborationMatchmaker,
                          );
                        }
                      }}
                    />
                  </View>
                </>
              ) : (
                <View style={styles.availableMessage}>
                  <CustomText
                    text="meetingAvailableMessage"
                    customStyle={[
                      styles.availableMessageText,
                      isRTL ? styles.textRight : styles.textLeft,
                    ]}
                  />
                </View>
              )}
              <CustomButton
                text="save"
                customStyle={styles.modalSaveButton}
                customTextStyle={styles.modalSaveText}
                onPress={async () => {
                  const didSave = await saveMeetingToServer();

                  if (!didSave) {
                    return;
                  }

                  setIsMeetingTimeOpen(false);
                  setIsMeetingModalOpen(false);
                }}
                isDisabled={
                  isMeetingBusy &&
                  (hasInvalidMeetingTime || hasPastMeetingDateTime)
                }
              />
              <DatePicker
                modal
                open={isMeetingDateOpen}
                date={currentMeetingDate || new Date()}
                minimumDate={today}
                mode="date"
                onConfirm={date => {
                  setIsMeetingDateOpen(false);
                  updateCurrentMeetingDate(date);
                }}
                onCancel={() => setIsMeetingDateOpen(false)}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </HomeScreen>
  );
};

export default MatchCardsScreen;
