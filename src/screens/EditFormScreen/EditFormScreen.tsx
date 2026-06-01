import React, {useEffect, useMemo, useState} from 'react';
import {Alert, TextInput, TouchableOpacity, View} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import CustomHeader from '../../components/CustomHeader/CustomHeader';
import CustomText from '../../components/CustomText/CustomText';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import SaveSvg from '../../assets/images/save.svg';
import detailsFormArray from '../../utils/DetailsFormFields';
import generateField from '../../utils/GenerateField';
import HomeScreen from '../HomeScreen/HomeScreen';
import {styles} from './EditFormScreen.style';
import {RootStackParamList} from '../../components/MainStackNavigation/MainStackNavigation.type';
import {MatchCardType} from '../../components/MatchCard/MatchCard.type';
import {Option} from '../../utils/FormFields.type';
import {calculateAge, formatHebrewDate} from '../../utils/generalFunction';
import {useLanguage} from '../../utils/LanguageProvider';
import api from '../../services/api';

type EditFormRouteProp = RouteProp<RootStackParamList, 'EditFormScreen'>;
type EditFormNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const normalizeStatus = (status?: string) => {
  const statusMap: Record<string, string> = {
    single: 'singleStatus',
    divorced: 'divorcedStatus',
    widower: 'widowedStatus',
  };

  return status ? (statusMap[status] ?? status) : '';
};

const denormalizeStatus = (status?: string) => {
  const statusMap: Record<string, string> = {
    singleStatus: 'single',
    divorcedStatus: 'divorced',
    widowedStatus: 'widower',
    single: 'single',
    divorced: 'divorced',
    widower: 'widower',
  };

  return status ? (statusMap[status] ?? status) : '';
};

const normalizeGender = (gender?: string) => {
  const genderMap: Record<string, string> = {
    male: 'male',
    female: 'female',
  };

  return gender ? (genderMap[gender] ?? gender) : '';
};

const denormalizeGender = (gender?: string) => {
  const genderMap: Record<string, string> = {
    male: 'male',
    female: 'female',
    זכר: 'male',
    נקבה: 'female',
  };

  return gender ? (genderMap[gender] ?? gender) : '';
};

const normalizePhone = (phone?: string) =>
  String(phone || '').replace(/\D/g, '');

const normalizeName = (value?: string) =>
  String(value || '')
    .trim()
    .toLowerCase();

const safeNumber = (value?: string) => {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : 0;
};

const getInitialFormValues = (card?: MatchCardType) =>
  detailsFormArray.reduce<Record<string, string>>(
    (values, item) => {
      if (item.fieldType === 'input' && item.defaultValue !== undefined) {
        values[item.id] = String(item.defaultValue);
      }

      return values;
    },
    {
      fullName: card?.name ?? '',
      gender: normalizeGender(card?.gender),
      age: card?.age !== undefined ? String(card.age) : '',
      hight: card?.height ?? '',
      city: card?.city ?? '',
      status: normalizeStatus(card?.status),
      countOfChildren:
        card?.numOfChildren !== undefined ? String(card.numOfChildren) : '',
      phone: card?.phone ?? '',
      mail: card?.mail ?? '',
      isEngaged: String(card?.relationshipStatus === 'engaged'),
      isMarried: String(card?.relationshipStatus === 'married'),
      partnerName: card?.partnerName ?? '',
      partnerOutsideApp: String(Boolean(card?.partnerOutsideApp)),
    },
  );

const getProfileFormValues = (profile: Record<string, unknown>) => {
  const fieldIds = new Set(detailsFormArray.map(field => field.id));
  const statusValue = String(profile.status || '');
  const relationshipStatus = String(profile.relationshipStatus || '');
  const values: Record<string, string> = {};

  fieldIds.forEach(fieldId => {
    const rawValue = profile[fieldId];

    if (rawValue === undefined || rawValue === null) {
      return;
    }

    if (typeof rawValue === 'boolean') {
      values[fieldId] = String(rawValue);
      return;
    }

    if (Array.isArray(rawValue)) {
      values[fieldId] = JSON.stringify(rawValue);
      return;
    }

    values[fieldId] = String(rawValue);
  });

  return {
    ...values,
    fullName: String(profile.fullName || profile.name || ''),
    gender: normalizeGender(String(profile.gender || '')),
    age:
      profile.age !== undefined && profile.age !== null
        ? String(profile.age)
        : '',
    hight: String(profile.hight || profile.height || ''),
    city: String(profile.city || ''),
    status: normalizeStatus(statusValue),
    countOfChildren:
      profile.countOfChildren !== undefined && profile.countOfChildren !== null
        ? String(profile.countOfChildren)
        : '',
    phone: String(profile.phone || ''),
    mail: String(profile.mail || profile.email || ''),
    birthDate: profile.birthDate
      ? String(profile.birthDate)
      : values.birthDate || '',
    birthDateHe: String(profile.birthDateHe || values.birthDateHe || ''),
    isEngaged: String(relationshipStatus === 'engaged'),
    isMarried: String(relationshipStatus === 'married'),
    partnerName: String(profile.partnerName || ''),
    partnerOutsideApp:
      profile.partnerOutsideApp !== undefined
        ? String(Boolean(profile.partnerOutsideApp))
        : 'false',
  };
};

const EditFormScreen = () => {
  const route = useRoute<EditFormRouteProp>();
  const navigation = useNavigation<EditFormNavigationProp>();
  const {t, isRTL} = useLanguage();

  const card = route.params?.card;
  const isEditable = true;

  const [isSaving, setIsSaving] = useState(false);
  const [isPartnerSearchFocused, setIsPartnerSearchFocused] = useState(false);
  const [profilesCache, setProfilesCache] = useState<any[]>([]);
  const [formValues, setFormValues] = useState<Record<string, string>>(() =>
    getInitialFormValues(card),
  );

  useEffect(() => {
    setFormValues(getInitialFormValues(card));
  }, [card]);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/profiles');
        const profiles = Array.isArray(response.data?.profiles)
          ? response.data.profiles
          : [];

        let profile: Record<string, unknown> | undefined;

        if (card?.profileId) {
          profile = profiles.find(
            (item: any) =>
              String(item._id || item.id || '') === String(card.profileId),
          );
        } else if (card?.phone) {
          profile = profiles.find(
            (item: any) =>
              normalizePhone(item.phone) === normalizePhone(card.phone),
          );
        }

        if (!isMounted) {
          return;
        }

        setProfilesCache(profiles);

        if (profile) {
          setFormValues(prev => ({
            ...prev,
            ...getProfileFormValues(profile),
          }));
        }
      } catch (error) {
        console.warn('Failed to load profile for edit', error);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [card?.phone, card?.profileId]);

  const updateField = (id: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const updateBirthDate = (date: Date) => {
    setFormValues(prev => ({
      ...prev,
      birthDate: date.toISOString(),
      birthDateHe: formatHebrewDate(date),
      age: String(calculateAge(date)),
    }));
  };

  const updateRelationshipStatus = (status: 'engaged' | 'married') => {
    if (!isEditable) {
      return;
    }

    const shouldClear =
      status === 'engaged'
        ? formValues.isEngaged === 'true'
        : formValues.isMarried === 'true';

    if (shouldClear) {
      updateField('isEngaged', 'false');
      updateField('isMarried', 'false');
      updateField('partnerName', '');
      updateField('partnerOutsideApp', 'false');
      return;
    }

    updateField('isEngaged', String(status === 'engaged'));
    updateField('isMarried', String(status === 'married'));
  };

  const resolveProfileId = () => {
    if (card?.profileId) {
      return card.profileId;
    }

    if (!card?.phone) {
      return '';
    }

    const matched = profilesCache.find(
      (item: any) => normalizePhone(item.phone) === normalizePhone(card.phone),
    );

    return String(matched?._id || matched?.id || '');
  };

  const partnerSuggestions = useMemo(() => {
    const currentProfileId = String(card?.profileId || '');
    const currentPhone = normalizePhone(card?.phone);

    return profilesCache
      .filter(profile => {
        const profileId = String(profile._id || profile.id || '');
        const phone = normalizePhone(profile.phone);
        const relationshipStatus = String(profile.relationshipStatus || '');

        return (
          profileId !== currentProfileId &&
          phone !== currentPhone &&
          relationshipStatus !== 'engaged' &&
          relationshipStatus !== 'married'
        );
      })
      .map(profile => String(profile.fullName || profile.name || '').trim())
      .filter(Boolean);
  }, [card?.phone, card?.profileId, profilesCache]);

  const checkPartnerOutsideApp = (
    relationshipStatus: string,
    partnerName: string,
  ) => {
    if (!relationshipStatus || !partnerName) {
      return false;
    }

    const partnerExists = profilesCache.some(
      (item: any) =>
        normalizeName(item.fullName) === normalizeName(partnerName),
    );

    return !partnerExists;
  };

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    try {
      setIsSaving(true);

      const profileId = resolveProfileId();

      if (!profileId) {
        Alert.alert(t('error'), t('profileNotFoundForUpdate'));
        return;
      }

      const relationshipStatus =
        formValues.isMarried === 'true'
          ? 'married'
          : formValues.isEngaged === 'true'
            ? 'engaged'
            : '';

      const partnerName = String(formValues.partnerName || '').trim();

      if (relationshipStatus && !partnerName) {
        Alert.alert(t('error'), t('partnerRequired'));
        return;
      }

      const partnerOutsideApp = checkPartnerOutsideApp(
        relationshipStatus,
        partnerName,
      );

      const payload: Record<string, unknown> = {
        ...formValues,
        fullName: formValues.fullName || '',
        gender: denormalizeGender(formValues.gender),
        status: denormalizeStatus(formValues.status),
        countOfChildren: safeNumber(formValues.countOfChildren),
        age: safeNumber(formValues.age),
        relationshipStatus: relationshipStatus || undefined,
        partnerName: partnerName || '',
        partnerOutsideApp,
      };

      delete payload.isEngaged;
      delete payload.isMarried;

      await api.put(`/api/profiles/${profileId}`, payload);

      Alert.alert(t('success'), t('saveChangesSuccess'));

      if (navigation.canGoBack()) {
        navigation.goBack();
        return;
      }

      navigation.navigate('MainScreen');
    } catch (error) {
      console.warn('Failed to save profile edit', error);
      Alert.alert(t('error'), t('saveChangesError'));
    } finally {
      setIsSaving(false);
    }
  };

  const isEngaged = formValues.isEngaged === 'true';
  const isMarried = formValues.isMarried === 'true';
  const relationshipStatus = isMarried ? 'married' : isEngaged ? 'engaged' : '';
  const shouldShowPartnerSearch = isEngaged || isMarried;

  const filteredPartnerSuggestions = partnerSuggestions.filter(partnerName => {
    const searchValue = normalizeName(formValues.partnerName);

    if (!searchValue) {
      return true;
    }

    return normalizeName(partnerName).includes(searchValue);
  });

  const selectPartner = (partnerName: string) => {
    updateField('partnerName', partnerName);
    setIsPartnerSearchFocused(false);
  };

  const headerBtns = [{comp: <SaveSvg />, onPress: handleSave}];

  return (
    <HomeScreen pinChildren={<CustomHeader headerBtns={headerBtns} />}>
      <WhiteCard customStyle={styles.whiteCardContainer}>
        <View style={styles.relationshipHeader}>
          <CustomText
            text="relationshipStatus"
            customStyle={styles.relationshipTitle}
          />

          {relationshipStatus && (
            <CustomText
              text={
                relationshipStatus === 'married'
                  ? 'marriedStatus'
                  : 'engagedStatus'
              }
              customStyle={styles.relationshipBadge}
            />
          )}
        </View>

        <View
          style={[
            styles.statusOptions,
            isRTL ? styles.rowReverse : styles.row,
          ]}>
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!isEditable || isSaving}
            onPress={() => updateRelationshipStatus('engaged')}
            style={[
              styles.statusOption,
              isEngaged && styles.statusOptionActive,
              (!isEditable || isSaving) && styles.disabledOption,
            ]}>
            <CustomText
              text="engagedStatus"
              customStyle={[
                styles.statusOptionText,
                isEngaged && styles.statusOptionTextActive,
              ]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!isEditable || isSaving}
            onPress={() => updateRelationshipStatus('married')}
            style={[
              styles.statusOption,
              isMarried && styles.statusOptionActive,
              (!isEditable || isSaving) && styles.disabledOption,
            ]}>
            <CustomText
              text="marriedStatus"
              customStyle={[
                styles.statusOptionText,
                isMarried && styles.statusOptionTextActive,
              ]}
            />
          </TouchableOpacity>
        </View>

        {shouldShowPartnerSearch && (
          <View style={styles.partnerSearchContainer}>
            <CustomText
              text="partnerLink"
              customStyle={[
                styles.partnerSearchLabel,
                isRTL ? styles.textRight : styles.textLeft,
              ]}
            />

            <TextInput
              style={[
                styles.partnerSearchInput,
                isRTL ? styles.textRight : styles.textLeft,
                (!isEditable || isSaving) && styles.readOnlyInput,
              ]}
              editable={isEditable && !isSaving}
              value={formValues.partnerName}
              placeholder={t('partnerSearchPlaceholder')}
              placeholderTextColor="#A8ADB7"
              onFocus={() => setIsPartnerSearchFocused(true)}
              onChangeText={value => {
                updateField('partnerName', value);
                setIsPartnerSearchFocused(true);
              }}
            />

            {isEditable && !isSaving && isPartnerSearchFocused && (
              <View style={styles.suggestionsPanel}>
                {filteredPartnerSuggestions.length > 0 ? (
                  filteredPartnerSuggestions.slice(0, 5).map(partnerName => (
                    <TouchableOpacity
                      key={partnerName}
                      activeOpacity={0.82}
                      onPress={() => selectPartner(partnerName)}
                      style={styles.suggestionItem}>
                      <CustomText
                        text={partnerName}
                        customStyle={[
                          styles.suggestionText,
                          isRTL ? styles.textRight : styles.textLeft,
                        ]}
                      />
                    </TouchableOpacity>
                  ))
                ) : (
                  <CustomText
                    text="noPartnerResults"
                    customStyle={[
                      styles.emptySuggestion,
                      isRTL ? styles.textRight : styles.textLeft,
                    ]}
                  />
                )}
              </View>
            )}
          </View>
        )}
      </WhiteCard>

      {detailsFormArray.map((item, index) => {
        const itemIsEditable =
          item.isEditable === false ? false : isEditable && !isSaving;

        const fieldProps =
          item.fieldType === 'input' || item.fieldType === 'autocomplete'
            ? {
                ...item,
                value: formValues[item.id] ?? '',
                isEditable: itemIsEditable,
                onChangeText: (value: string) => updateField(item.id, value),
              }
            : item.fieldType === 'datePicker'
              ? {
                  ...item,
                  value: formValues[item.id] ?? '',
                  isEditable: itemIsEditable,
                  onChangeDate:
                    item.id === 'birthDate'
                      ? updateBirthDate
                      : (date: Date) =>
                          updateField(item.id, date.toISOString()),
                }
              : {
                  ...item,
                  value: formValues[item.id] ?? '',
                  isEditable: itemIsEditable,
                  handlePress: (option?: Option | boolean) => {
                    if (!itemIsEditable) {
                      return;
                    }

                    if (typeof option === 'boolean') {
                      updateField(item.id, String(option));
                      return;
                    }

                    if (option && typeof option !== 'boolean') {
                      updateField(item.id, option.label);
                    }
                  },
                };

        return (
          <WhiteCard
            key={item.id || index}
            customStyle={styles.whiteCardContainer}>
            {generateField(fieldProps)}
          </WhiteCard>
        );
      })}
    </HomeScreen>
  );
};

export default EditFormScreen;
