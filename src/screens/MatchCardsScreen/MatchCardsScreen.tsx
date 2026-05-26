import React, {useEffect, useState} from 'react';
import {Modal, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import DatePicker from 'react-native-date-picker';

import CurrentCard from '../../components/CurrentCard/CurrentCard';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomText from '../../components/CustomText/CustomText';
import MatchCard from '../../components/MatchCard/MatchCard';
import { MatchCardType } from '../../components/MatchCard/MatchCard.type';
import HomeScreen from '../HomeScreen/HomeScreen';
import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';
import {UserRole, getSessionRole} from '../../services/session';
import ClockSvg from '../../assets/images/clock.svg';
import DatePickerSvg from '../../assets/images/datePicker.svg';
import LocationSvg from '../../assets/images/location.svg';
import {useLanguage} from '../../utils/LanguageProvider';

import { styles } from './MatchCardsScreen.style';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type MeetingStatus = NonNullable<MatchCardType['meetingStatus']>;

const formatTimePart = (value: number) => String(value).padStart(2, '0');

const normalizeMeetingTime = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const match = value.trim().match(/^(\d{1,2}):(\d{1,2})$/);

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

const MatchCardsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {isRTL, language, t} = useLanguage();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isMeetingDateOpen, setIsMeetingDateOpen] = useState(false);
  const [isMeetingTimeOpen, setIsMeetingTimeOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [timePickerValue, setTimePickerValue] = useState('09:00');
  const [matchArray, setMatchArray] = useState<MatchCardType[]>([
    {
      city: 'cityBneiBrak',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      matcherName: 'matchmakerShiranBetzalel',
      name: 'XXX',
      offered: false,
      met: false,
      meetingStatus: 'available',
      gender: 'male',
      age: 50,
      numOfChildren: 0,
      height: '1.85',
      status: 'divorced',
      images: [
        'https://www.shutterstock.com/image-photo/cartoon-3d-icon-thai-tuk-600w-2251713231.jpg',
        'https://www.shutterstock.com/image-photo/3d-image-male-character-attacking-600w-2274399929.jpg',
      ],
    },
    {
      city: 'cityBneiBrak',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      matcherName: 'matchmakerShiranBetzalel',
      name: 'XXX',
      offered: false,
      met: false,
      meetingStatus: 'busy',
      meetingDate: new Date().toISOString(),
      gender: 'female',
      age: 54,
      numOfChildren: 0,
      height: '1.80',
      status: 'widower',
      images: [
        'https://www.shutterstock.com/image-photo/cartoon-3d-icon-thai-tuk-600w-2251713231.jpg',
        'https://www.shutterstock.com/image-photo/milk-chocolate-splash-smooth-abstract-600w-2259581367.jpg',
      ],
    },
    {
      city: 'cityBneiBrak',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      matcherName: 'matchmakerShiranBetzalel',
      name: 'XXX',
      offered: false,
      met: false,
      meetingStatus: 'available',
      gender: 'female',
      age: 50,
      numOfChildren: 0,
      height: '1.85',
      status: 'single',
      images: [
        'https://www.shutterstock.com/image-photo/origami-3d-image-graphic-600w-2284548165.jpg',
      ],
    },
    {
      city: 'cityBneiBrak',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      matcherName: 'matchmakerShiranBetzalel',
      name: 'XXX',
      offered: false,
      met: false,
      meetingStatus: 'available',
      gender: 'female',
      age: 54,
      numOfChildren: 0,
      height: '1.80',
      status: 'divorced',
      images: [
        'https://www.shutterstock.com/image-photo/cartoon-3d-icon-thai-tuk-600w-2251713231.jpg',
      ],
    },
    {
      city: 'cityBneiBrak',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      matcherName: 'matchmakerShiranBetzalel',
      name: 'XXX',
      offered: false,
      met: false,
      meetingStatus: 'available',
      gender: 'female',
      age: 50,
      numOfChildren: 0,
      height: '1.85',
      status: 'divorced',
      images: [
        'https://www.shutterstock.com/image-photo/3d-image-male-character-attacking-600w-2274399929.jpg',
      ],
    },
    {
      city: 'cityBneiBrak',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      matcherName: 'matchmakerShiranBetzalel',
      name: 'XXX',
      offered: false,
      met: false,
      meetingStatus: 'available',
      gender: 'male',
      age: 54,
      numOfChildren: 0,
      height: '1.80',
      status: 'widower',
      images: [
        'https://www.shutterstock.com/image-photo/milk-chocolate-splash-smooth-abstract-600w-2259581367.jpg',
      ],
    },
    {
      city: 'cityBneiBrak',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      matcherName: 'matchmakerShiranBetzalel',
      name: 'XXX',
      offered: false,
      met: false,
      meetingStatus: 'available',
      gender: 'male',
      age: 50,
      numOfChildren: 0,
      height: '1.85',
      status: 'single',
      images: [
        'https://www.shutterstock.com/image-photo/origami-3d-image-graphic-600w-2284548165.jpg',
      ],
    },
    {
      city: 'cityBneiBrak',
      matcherMail: 'shiranbetzalel1990@gmail.com',
      mail: 'shiranbetzalel1990@gmail.com',
      phone: '0549450954',
      matcherPhone: '0549450954',
      matcherName: 'matchmakerShiranBetzalel',
      name: 'XXX',
      offered: false,
      met: false,
      meetingStatus: 'available',
      gender: 'male',
      age: 54,
      numOfChildren: 0,
      height: '1.80',
      status: 'single',
      images: [
        'https://www.shutterstock.com/image-photo/cartoon-3d-icon-thai-tuk-600w-2251713231.jpg',
      ],
    },
  ]);
  const canManageMeetings = userRole === 'matchmaker' || userRole === 'admin';

  useEffect(() => {
    getSessionRole().then(setUserRole);
  }, []);

  const [currentCard, setCurrentCard] = useState<MatchCardType>({
    gender: 'female',
    name: 'XXX',
    age: 32,
    height: '1.57',
    status: 'widower',
    numOfChildren: 5,
    city: 'cityBneiBrak',
    images: [
      'https://www.shutterstock.com/image-photo/cartoon-3d-icon-thai-tuk-600w-2251713231.jpg',
      'https://www.shutterstock.com/image-photo/milk-chocolate-splash-smooth-abstract-600w-2259581367.jpg',
      'https://www.shutterstock.com/image-photo/origami-3d-image-career-woman-600w-2290557303.jpg',
    ],
    mail: 'shiranbetzalel1990@gmail.com',
    phone: '0549450954',
    matcherPhone: '0549450954',
    matcherName: 'matchmakerShiranBetzalel',
    meetingStatus: 'available',
  });
  const scheduledMeetings = currentCard.meetingDate ? [currentCard] : [];
  const isMeetingBusy = currentCard.meetingStatus === 'busy';
  const currentMeetingDate = currentCard.meetingDate
    ? new Date(currentCard.meetingDate)
    : undefined;
  const currentMeetingDateText =
    currentMeetingDate && !Number.isNaN(currentMeetingDate.getTime())
      ? currentMeetingDate.toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')
      : 'meetingDate';
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isValidMeetingTime = (value?: string) => {
    if (!value) {
      return true;
    }

    return normalizeMeetingTime(value) === value;
  };

  const updateCurrentMeetingStatus = (meetingStatus: MeetingStatus) => {
    if (!canManageMeetings) {
      return;
    }

    setCurrentCard(card => ({
      ...card,
      meetingStatus,
      ...(meetingStatus === 'available'
        ? {
            meetingDate: undefined,
            meetingTime: undefined,
            meetingLocation: undefined,
          }
        : {}),
    }));
  };

  const updateCurrentMeetingDate = (meetingDate: Date) => {
    if (!canManageMeetings) {
      return;
    }

    setCurrentCard(card => ({
      ...card,
      meetingDate: meetingDate.toISOString(),
      meetingStatus: card.meetingStatus ?? 'busy',
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
    Boolean(currentCard.meetingTime) && !isValidMeetingTime(currentCard.meetingTime);
  const currentMeetingTimeText =
    normalizeMeetingTime(currentCard.meetingTime) ?? 'meetingTime';
  const [selectedHour, selectedMinute] = timePickerValue.split(':').map(Number);

  const openMeetingTimePicker = () => {
    setTimePickerValue(normalizeMeetingTime(currentCard.meetingTime) ?? '09:00');
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

  return (
    <HomeScreen
      pinChildren={
        <View style={styles.pinContainer}>
          <View style={[styles.header, isRTL ? styles.rowReverse : styles.row]}>
            <View style={[styles.headerText, isRTL ? styles.alignEnd : styles.alignStart]}>
              <CustomText
                text="matchesBoard"
                customStyle={[styles.title, isRTL ? styles.textRight : styles.textLeft]}
              />
              <CustomText
                text="matchesBoardSubtitle"
                customStyle={[styles.subtitle, isRTL ? styles.textRight : styles.textLeft]}
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
            isShowMeetingButton={canManageMeetings}
            onMeetingPress={() => setIsMeetingModalOpen(true)}
          />
        </View>
      }>
      <View style={[styles.sectionHeader, isRTL ? styles.alignEnd : styles.alignStart]}>
        <CustomText
          text="suggestedMatches"
          customStyle={[styles.sectionTitle, isRTL ? styles.textRight : styles.textLeft]}
        />
      </View>
      {matchArray.map((matchItem, index) => (
        <View key={index} style={styles.card}>
          <MatchCard
            {...matchItem}
            isShowMoreInfo={false}
            isShowInfoButtons={false}
            isShowMeetingInfo={true}
            isImagePreviewEnabled={true}
          />
        </View>
      ))}
      <Modal
        transparent
        animationType="fade"
        visible={isMeetingModalOpen}
        onRequestClose={() => setIsMeetingModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.meetingModal}>
            <View style={[styles.modalHeader, isRTL ? styles.rowReverse : styles.row]}>
              <CustomText
                text="meetingManagement"
                customStyle={[styles.modalTitle, isRTL ? styles.textRight : styles.textLeft]}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  setIsMeetingTimeOpen(false);
                  setIsMeetingModalOpen(false);
                }}
              >
                <CustomText text="×" customStyle={styles.modalCloseText} />
              </TouchableOpacity>
            </View>

            <View style={[styles.meetingStatusRow, isRTL ? styles.rowReverse : styles.row]}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.statusButton,
                  currentCard.meetingStatus === 'available' &&
                    styles.statusButtonActive,
                ]}
                onPress={() => updateCurrentMeetingStatus('available')}
              >
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
                onPress={() => updateCurrentMeetingStatus('busy')}
              >
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
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.meetingField, isRTL ? styles.rowReverse : styles.row]}
                  onPress={() => setIsMeetingDateOpen(true)}
                >
                  <View style={styles.meetingIconBox}>
                    <DatePickerSvg width={22} height={22} />
                  </View>
                  <CustomText
                    text={currentMeetingDateText}
                    customStyle={[styles.meetingFieldText, isRTL ? styles.textRight : styles.textLeft]}
                  />
                </TouchableOpacity>
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
                  <CustomText
                    text={currentMeetingTimeText}
                    customStyle={[
                      styles.meetingFieldText,
                      currentMeetingTimeText !== 'meetingTime' &&
                        styles.meetingTimeText,
                      isRTL ? styles.textRight : styles.textLeft,
                    ]}
                  />
                </TouchableOpacity>
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
                <View style={[styles.meetingField, isRTL ? styles.rowReverse : styles.row]}>
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
              onPress={() => {
                setIsMeetingTimeOpen(false);
                setIsMeetingModalOpen(false);
              }}
              isDisabled={isMeetingBusy && hasInvalidMeetingTime}
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
        </View>
      </Modal>
    </HomeScreen>
  );
};

export default MatchCardsScreen;
