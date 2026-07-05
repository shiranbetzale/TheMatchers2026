import React, {useEffect, useMemo, useState} from 'react';
import {TextInput, View} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import CustomHeader from '../../components/CustomHeader/CustomHeader';
import CustomSelect from '../../components/CustomSelect/CustomSelect';
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
import Colors from '../../utils/Colors';
import {useLanguage} from '../../utils/LanguageProvider';
import {useMessage} from '../../utils/MessageProvider';
import {
  getVisibleFields,
  getVisibleOptions,
  isRequiredFormField,
} from '../../utils/formCompletion';
import i18n from '../../utils/i18n';
import api from '../../services/api';
import CustomButton from '../../components/CustomButton/CustomButton';

type EditFormRouteProp = RouteProp<RootStackParamList, 'EditFormScreen'>;
type EditFormNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const normalizeStatus = (status?: string) => {
  const statusMap: Record<string, string> = {
    single: 'singleStatus',
    divorced: 'divorcedStatus',
    widower: 'widowedStatus',
    active: '',
    archived: '',
  };

  return status ? (statusMap[status] ?? status) : '';
};

const denormalizeStatus = (status?: string) => {
  const statusMap: Record<string, string> = {
    '': '',
    '1': 'single',
    '2': 'widower',
    '3': 'divorced',
    '4': 'widowerWithChildren',
    '5': 'divorcedWithChildren',
    singleStatus: 'single',
    divorcedStatus: 'divorced',
    widowedStatus: 'widower',
    widowedWithChildrenStatus: 'widowerWithChildren',
    divorcedWithChildrenStatus: 'divorcedWithChildren',
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
    '1': 'male',
    '2': 'female',
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

const getGenderKey = (gender?: string) => {
  const normalizedGender = denormalizeGender(gender);

  return normalizedGender === 'male' || normalizedGender === 'female'
    ? normalizedGender
    : undefined;
};

const getProfileId = (profile?: Record<string, unknown> | MatchCardType) =>
  String(
    (profile as any)?.profileId ||
      (profile as any)?._id ||
      (profile as any)?.id ||
      '',
  ).trim();

const getRelationshipStatusTextKey = (
  status: 'engaged' | 'married' | '',
  gender?: string,
) => {
  const genderKey = getGenderKey(gender);

  if (status === 'engaged') {
    return genderKey === 'male'
      ? 'engagedStatusMale'
      : genderKey === 'female'
        ? 'engagedStatusFemale'
        : 'engagedStatus';
  }

  if (status === 'married') {
    return genderKey === 'male'
      ? 'marriedStatusMale'
      : genderKey === 'female'
        ? 'marriedStatusFemale'
        : 'marriedStatus';
  }

  return '';
};

const safeNumber = (value?: string) => {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : 0;
};

const buildMatchmakerOptions = (users: any[], profiles: any[]): Option[] => {
  const matchmakerMap = new Map<string, string>();

  users.forEach(user => {
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

  profiles.forEach(profile => {
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

const getInitialFormValues = (card?: MatchCardType) =>
  normalizeFormOptionValues(detailsFormArray.reduce<Record<string, string>>(
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
      status: normalizeStatus((card as any)?.maritalStatus || card?.status),
      countOfChildren:
        card?.numOfChildren !== undefined ? String(card.numOfChildren) : '',
      phone: card?.phone ?? '',
      mail: card?.mail ?? '',
      isEngaged: String(card?.relationshipStatus === 'engaged'),
      isMarried: String(card?.relationshipStatus === 'married'),
      partnerName: card?.partnerName ?? '',
      partnerOutsideApp: String(Boolean(card?.partnerOutsideApp)),
      collaborationMatchmaker: card?.collaborationMatchmaker ?? '',
    },
  ));

const parseOptionValues = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.map(item => String(item)).filter(Boolean);
  }

  const rawValue = String(value || '').trim();

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);

    if (Array.isArray(parsed)) {
      return parsed.map(item => String(item)).filter(Boolean);
    }
  } catch {
    // Fall through to separator parsing.
  }

  return rawValue
    .split(/[\n,;]+/)
    .map(item => item.trim())
    .filter(Boolean);
};

const getOptionComparableValues = (option: Option) =>
  [
    String(option.id),
    option.label,
    option.name,
    option.genderLabels?.male,
    option.genderLabels?.female,
    i18n.t(option.label),
    option.genderLabels?.male ? i18n.t(option.genderLabels.male) : undefined,
    option.genderLabels?.female ? i18n.t(option.genderLabels.female) : undefined,
  ]
    .filter(Boolean)
    .map(item => String(item));

const normalizeFormOptionValues = (values: Record<string, string>) => {
  const nextValues = {...values};

  detailsFormArray.forEach(field => {
    if (!field.options?.length) {
      return;
    }

    if (field.fieldType === 'checkbox') {
      const selectedValues = parseOptionValues(nextValues[field.id]);

      if (!selectedValues.length) {
        return;
      }

      const selectedOptionIds = selectedValues.map(value => {
        const option = field.options?.find(
          nextOption => getOptionComparableValues(nextOption).includes(value),
        );

        return option ? String(option.id) : value;
      });

      nextValues[field.id] = JSON.stringify(selectedOptionIds);
      return;
    }

    if (field.fieldType !== 'select' && field.fieldType !== 'radioButton') {
      return;
    }

    const value = String(nextValues[field.id] || '').trim();

    if (!value) {
      return;
    }

    const selectedOption = field.options.find(
      option => getOptionComparableValues(option).includes(value),
    );

    if (selectedOption) {
      nextValues[field.id] = String(selectedOption.id);
      nextValues[`${field.id}OptionId`] = String(selectedOption.id);
    }
  });

  if (nextValues.gender === '1') {
    nextValues.gender = 'male';
    nextValues.genderOptionId = '1';
  }

  if (nextValues.gender === '2') {
    nextValues.gender = 'female';
    nextValues.genderOptionId = '2';
  }

  return nextValues;
};

const getProfileFormValues = (profile: Record<string, unknown>) => {
  const fieldIds = new Set(detailsFormArray.map(field => field.id));
  const statusValue = String(profile.maritalStatus || profile.status || '');
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

  return normalizeFormOptionValues({
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
    collaborationMatchmaker: String(profile.collaborationMatchmaker || ''),
  });
};

const EditFormScreen = () => {
  const route = useRoute<EditFormRouteProp>();
  const navigation = useNavigation<EditFormNavigationProp>();
  const {t, isRTL} = useLanguage();
  const {showMessage} = useMessage();

  const card = route.params?.card;
  const isEditable = true;

  const [isSaving, setIsSaving] = useState(false);
  const [loadedProfileId, setLoadedProfileId] = useState('');
  const [isPartnerSearchFocused, setIsPartnerSearchFocused] = useState(false);
  const [profilesCache, setProfilesCache] = useState<any[]>([]);
  const [matchmakerOptions, setMatchmakerOptions] = useState<Option[]>([]);
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

        let profile: Record<string, unknown> | undefined;

        const cardProfileId = getProfileId(card);

        if (cardProfileId) {
          profile = profiles.find(
            (item: any) =>
              String(item._id || item.id || '') === String(cardProfileId),
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
        setMatchmakerOptions(buildMatchmakerOptions(matchmakers, profiles));

        if (profile) {
          setLoadedProfileId(getProfileId(profile));
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
  }, [card]);

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
      updateField('collaborationMatchmaker', '');
      return;
    }

    updateField('isEngaged', String(status === 'engaged'));
    updateField('isMarried', String(status === 'married'));
  };

  const resolveProfileId = () => {
    const cardProfileId = getProfileId(card);

    if (cardProfileId) {
      return cardProfileId;
    }

    if (loadedProfileId) {
      return loadedProfileId;
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
    const selectedMatchmakerId = String(
      formValues.collaborationMatchmaker || '',
    ).trim();

    return profilesCache
      .filter(profile => {
        const profileId = String(profile._id || profile.id || '');
        const phone = normalizePhone(profile.phone);
        const relationshipStatus = String(profile.relationshipStatus || '');
        const assignedMatchmaker = String(
          profile.assignedMatchmaker || '',
        ).trim();

        return (
          profileId !== currentProfileId &&
          phone !== currentPhone &&
          (!selectedMatchmakerId ||
            assignedMatchmaker === selectedMatchmakerId) &&
          relationshipStatus !== 'engaged' &&
          relationshipStatus !== 'married'
        );
      })
      .map(profile => String(profile.fullName || profile.name || '').trim())
      .filter(Boolean);
  }, [
    card?.phone,
    card?.profileId,
    formValues.collaborationMatchmaker,
    profilesCache,
  ]);

  const partnerProfileByName = useMemo(
    () =>
      profilesCache.reduce<Record<string, string>>((profilesByName, profile) => {
        const name = normalizeName(profile.fullName || profile.name);
        const profileId = String(profile._id || profile.id || '');

        if (name && profileId) {
          profilesByName[name] = profileId;
        }

        return profilesByName;
      }, {}),
    [profilesCache],
  );

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
        showMessage({type: 'error', message: t('profileNotFoundForUpdate')});
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
        showMessage({type: 'error', message: t('partnerRequired')});
        return;
      }

      const partnerOutsideApp = checkPartnerOutsideApp(
        relationshipStatus,
        partnerName,
      );
      const partnerProfileId =
        partnerProfileByName[normalizeName(partnerName)] || undefined;

      const payload: Record<string, unknown> = {
        ...formValues,
        fullName: formValues.fullName || '',
        gender: denormalizeGender(formValues.gender),
        status: denormalizeStatus(formValues.status),
        maritalStatus: denormalizeStatus(formValues.status),
        countOfChildren: safeNumber(formValues.countOfChildren),
        age: safeNumber(formValues.age),
        relationshipStatus: relationshipStatus || undefined,
        partnerName: partnerName || '',
        partnerProfileId,
        partnerOutsideApp,
        collaborationMatchmaker: formValues.collaborationMatchmaker || undefined,
      };

      Object.keys(payload).forEach(key => {
        if (key.endsWith('OptionId')) {
          delete payload[key];
        }
      });

      delete payload.isEngaged;
      delete payload.isMarried;

      await api.put(`/api/profiles/${profileId}`, payload);

      showMessage({type: 'success', message: t('saveChangesSuccess')});

      if (navigation.canGoBack()) {
        navigation.goBack();
        return;
      }

      navigation.navigate('MainScreen');
    } catch (error) {
      console.warn('Failed to save profile edit', error);
      const status = (error as any)?.response?.status;
      const messageKey =
        status === 403
          ? 'errorProfileAccessDenied'
          : status === 404
            ? 'profileNotFoundForUpdate'
            : 'saveChangesError';

      showMessage({type: 'error', message: t(messageKey)});
    } finally {
      setIsSaving(false);
    }
  };

  const isEngaged = formValues.isEngaged === 'true';
  const isMarried = formValues.isMarried === 'true';
  const relationshipStatus = isMarried ? 'married' : isEngaged ? 'engaged' : '';
  const relationshipStatusTextKey = getRelationshipStatusTextKey(
    relationshipStatus,
    formValues.gender,
  );
  const engagedStatusTextKey = getRelationshipStatusTextKey(
    'engaged',
    formValues.gender,
  );
  const marriedStatusTextKey = getRelationshipStatusTextKey(
    'married',
    formValues.gender,
  );
  const selectedCollaborationMatchmakerLabel =
    matchmakerOptions.find(
      option => String(option.value || '') === formValues.collaborationMatchmaker,
    )?.label || '';
  const shouldShowPartnerSearch = isEngaged || isMarried;
  const visibleDetailsFields = useMemo(
    () => getVisibleFields(detailsFormArray, formValues, detailsFormArray),
    [formValues],
  );

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
              text={relationshipStatusTextKey}
              customStyle={styles.relationshipBadge}
            />
          )}
        </View>

        <View
          style={[
            styles.statusOptions,
            isRTL ? styles.rowReverse : styles.row,
          ]}>
          <CustomButton unstyled
            activeOpacity={0.85}
            disabled={!isEditable || isSaving}
            onPress={() => updateRelationshipStatus('engaged')}
            style={[
              styles.statusOption,
              isEngaged && styles.statusOptionActive,
              (!isEditable || isSaving) && styles.disabledOption,
            ]}>
            <CustomText
              text={engagedStatusTextKey}
              customStyle={[
                styles.statusOptionText,
                isEngaged && styles.statusOptionTextActive,
              ]}
            />
          </CustomButton>

          <CustomButton unstyled
            activeOpacity={0.85}
            disabled={!isEditable || isSaving}
            onPress={() => updateRelationshipStatus('married')}
            style={[
              styles.statusOption,
              isMarried && styles.statusOptionActive,
              (!isEditable || isSaving) && styles.disabledOption,
            ]}>
            <CustomText
              text={marriedStatusTextKey}
              customStyle={[
                styles.statusOptionText,
                isMarried && styles.statusOptionTextActive,
              ]}
            />
          </CustomButton>
        </View>

        {shouldShowPartnerSearch && (
          <View style={styles.partnerSearchContainer}>
            <CustomSelect
              layout="column"
              text="collaborationMatchmaker"
              value={selectedCollaborationMatchmakerLabel}
              options={matchmakerOptions}
              onSelect={option =>
                setFormValues(prev => ({
                  ...prev,
                  collaborationMatchmaker: option?.value || '',
                  partnerName: '',
                  partnerProfileId: '',
                  partnerOutsideApp: 'false',
                }))
              }
            />

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
              placeholderTextColor={Colors.placeholder}
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
                    <CustomButton unstyled
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
                    </CustomButton>
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

      {visibleDetailsFields.map((item, index) => {
        const itemIsEditable =
          item.isEditable === false ? false : isEditable && !isSaving;
        const visibleOptions = getVisibleOptions(
          item,
          formValues,
          detailsFormArray,
        );

        const fieldProps =
          item.fieldType === 'input' || item.fieldType === 'autocomplete'
            ? {
                ...item,
                isRequired: isRequiredFormField(item),
                options: visibleOptions,
                value: formValues[item.id] ?? '',
                isEditable: itemIsEditable,
                onChangeText: (value: string) => updateField(item.id, value),
              }
            : item.fieldType === 'datePicker'
              ? {
                  ...item,
                  isRequired: isRequiredFormField(item),
                  options: visibleOptions,
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
                  isRequired: isRequiredFormField(item),
                  options: visibleOptions,
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
                      setFormValues(prev => ({
                        ...prev,
                        [item.id]:
                          item.id === 'gender'
                            ? denormalizeGender(String(option.id))
                            : String(option.id),
                        [`${item.id}OptionId`]: String(option.id),
                      }));
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
