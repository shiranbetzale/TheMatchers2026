import React, {useEffect, useMemo, useState} from 'react';
import {Image, Modal, TextInput, TouchableOpacity, View} from 'react-native';
import {AxiosError} from 'axios';
import {
  CommonActions,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {styles} from './Wizard.style';
import {
  WizardBtnType,
  WizardFormValues,
  WizardTxtType,
  WizardStep,
} from './Wizard.type';
import {MatchCardType} from '../MatchCard/MatchCard.type';
import WizardHeader from './WizardHeader';
import Step1Screen from '../../screens/Step1Screen/Step1Screen';
import Step2Screen from '../../screens/Step2Screen/Step2Screen';
import Step3Screen from '../../screens/Step3Screen/Step3Screen';
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import detailsFormArray from '../../utils/DetailsFormFields';
import matchFormArray from '../../utils/MatchFormFields';
import {
  hasVisibleFieldErrors,
  isFormComplete,
  normalizeWizardFieldValue,
  validateWizardField,
} from '../../utils/formCompletion';
import {RootStackParamList} from '../MainStackNavigation/MainStackNavigation.type';
import {FormField, Option} from '../../utils/FormFields.type';
import ErrorBanner from '../ErrorBanner/ErrorBanner';
import {useLanguage} from '../../utils/LanguageProvider';
import {useMessage} from '../../utils/MessageProvider';
import CustomSelect from '../CustomSelect/CustomSelect';
import CustomText from '../CustomText/CustomText';
import RingImage from '../../assets/images/ring.png';
import api from '../../services/api';
import {clearSession, getSessionRole} from '../../services/session';

type WizardNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type WizardRouteProp = RouteProp<RootStackParamList, 'Wizard'>;

const getInitialWizardValues = (fields: FormField[]) =>
  fields.reduce<WizardFormValues>((initialValues, field) => {
    if (field.defaultValue !== undefined) {
      initialValues[field.id] = String(field.defaultValue);
    }

    if (field.fieldType === 'radioButton' && field.options?.length) {
      const defaultOption = field.options[0];
      initialValues[field.id] = defaultOption.label;
      initialValues[`${field.id}OptionId`] = String(defaultOption.id);
    }

    return initialValues;
  }, {});

const getAllWizardFields = () => [...detailsFormArray, ...matchFormArray];

const normalizeStatusForWizard = (status?: string) => {
  const normalizedStatus = String(status || '').trim();
  const statusKey = normalizedStatus.toLowerCase();

  if (statusKey === 'archived' || statusKey === 'active') {
    return '';
  }

  const statusMap: Record<string, string> = {
    single: 'singleStatus',
    divorced: 'divorcedStatus',
    widower: 'widowedStatus',
    widowerWithChildren: 'widowedWithChildrenStatus',
    divorcedWithChildren: 'divorcedWithChildrenStatus',
  };

  return normalizedStatus
    ? (statusMap[normalizedStatus] ?? normalizedStatus)
    : '';
};

const normalizeName = (value?: string) =>
  String(value || '')
    .trim()
    .toLowerCase();

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

const getGenderKey = (gender?: string) => {
  const normalizedGender = String(gender || '').trim().toLowerCase();

  if (normalizedGender === 'male' || normalizedGender === 'זכר' || normalizedGender === '1') {
    return 'male';
  }

  if (
    normalizedGender === 'female' ||
    normalizedGender === 'נקבה' ||
    normalizedGender === '2'
  ) {
    return 'female';
  }

  return undefined;
};

const getOppositeGender = (gender?: string) => {
  const genderKey = getGenderKey(gender);

  return genderKey === 'male'
    ? 'female'
    : genderKey === 'female'
      ? 'male'
      : undefined;
};

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

const getPartnerGenderFromValues = (values: WizardFormValues) => {
  const genderOptionId = String(values.genderOptionId || '').trim();
  const gender = String(values.gender || '').trim().toLowerCase();

  if (genderOptionId === '1' || gender === 'male' || gender === 'זכר') {
    return 'female';
  }

  if (genderOptionId === '2' || gender === 'female' || gender === 'נקבה') {
    return 'male';
  }

  return undefined;
};

const clearRelationshipValues = (values: WizardFormValues): WizardFormValues => ({
  ...values,
  status:
    values.status === 'archived' || values.status === 'ARCHIVED'
      ? ''
      : values.status || '',
  statusOptionId:
    values.status === 'archived' || values.status === 'ARCHIVED'
      ? ''
      : values.statusOptionId || '',
  isEngaged: 'false',
  isMarried: 'false',
  partnerName: '',
  partnerProfileId: '',
  partnerOutsideApp: 'false',
  collaborationMatchmaker: '',
});

const getRelationshipValues = (values: WizardFormValues): WizardFormValues => ({
  isEngaged: values.isEngaged || 'false',
  isMarried: values.isMarried || 'false',
  partnerName: values.partnerName || '',
  partnerProfileId: values.partnerProfileId || '',
  partnerOutsideApp: values.partnerOutsideApp || 'false',
  collaborationMatchmaker: values.collaborationMatchmaker || '',
});

const normalizeGenderForPayload = (values: WizardFormValues) => {
  const genderOptionId = String(values.genderOptionId || '');
  const gender = String(values.gender || '').trim().toLowerCase();

  if (genderOptionId === '1' || gender === 'male' || gender === 'זכר') {
    return 'male';
  }

  if (genderOptionId === '2' || gender === 'female' || gender === 'נקבה') {
    return 'female';
  }

  return values.gender;
};

const normalizeStatusForPayload = (values: WizardFormValues) => {
  const statusByOptionId: Record<string, string> = {
    '1': 'singleStatus',
    '2': 'widowedStatus',
    '3': 'divorcedStatus',
    '4': 'widowedWithChildrenStatus',
    '5': 'divorcedWithChildrenStatus',
  };
  const statusOptionId = String(values.statusOptionId || '');

  return statusByOptionId[statusOptionId] ?? normalizeStatusForWizard(values.status);
};

const applyWizardOptionIds = (
  values: WizardFormValues,
  fields = getAllWizardFields(),
) => {
  const nextValues = {...values};

  fields.forEach(field => {
    if (
      (field.fieldType !== 'radioButton' && field.fieldType !== 'select') ||
      !field.options?.length
    ) {
      return;
    }

    const value = nextValues[field.id];

    if (!value) {
      return;
    }

    const selectedOption = field.options.find(
      option =>
        option.label === value ||
        option.name === value ||
        String(option.id) === String(value),
    );

    if (selectedOption) {
      nextValues[`${field.id}OptionId`] = String(selectedOption.id);
    }
  });

  return nextValues;
};

const stringifyProfileImages = (images: unknown) => {
  if (!Array.isArray(images)) {
    return undefined;
  }

  return JSON.stringify(
    images
      .map(image => {
        if (typeof image === 'string') {
          return {uri: image};
        }

        if (image && typeof image === 'object' && 'uri' in image) {
          return image;
        }

        return null;
      })
      .filter(Boolean),
  );
};

const parsePositiveInteger = (value?: string | number) => {
  const numberValue = Number(String(value || '').replace(/[^\d]/g, ''));

  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null;
};

const parseHeightInCm = (value?: string | number) => {
  const cleanValue = String(value || '').trim();

  if (!cleanValue) {
    return null;
  }

  if (/^\d{3}$/.test(cleanValue)) {
    return Number(cleanValue);
  }

  if (/^[1-2]\.\d{1,2}$/.test(cleanValue)) {
    return Math.round(Number(cleanValue) * 100);
  }

  const digits = cleanValue.replace(/[^\d]/g, '');

  return digits.length === 3 ? Number(digits) : null;
};

const hasRangeValue = (value?: string) => {
  if (!value) {
    return false;
  }

  try {
    const parsed = JSON.parse(value);

    return Array.isArray(parsed) && parsed.length === 2;
  } catch {
    return String(value).trim().length > 0;
  }
};

const applyCandidateRangeDefaults = (
  values: WizardFormValues,
): WizardFormValues => {
  const nextValues = {...values};
  const age = parsePositiveInteger(nextValues.age);
  const heightInCm = parseHeightInCm(nextValues.hight);

  if (age && !hasRangeValue(nextValues.matchRangeAges)) {
    nextValues.matchRangeAges = JSON.stringify([age, Math.min(age + 10, 90)]);
  }

  if (heightInCm && !hasRangeValue(nextValues.matchRangeHeights)) {
    nextValues.matchRangeHeights = JSON.stringify([
      heightInCm,
      Math.min(heightInCm + 10, 200),
    ]);
  }

  return nextValues;
};

const getWizardValuesFromCard = (card?: MatchCardType): WizardFormValues => {
  if (!card) {
    return {};
  }

  return applyCandidateRangeDefaults(applyWizardOptionIds({
    fullName: card.name || '',
    age: card.age ? String(card.age) : '',
    hight: card.height || '',
    city: card.city || '',
    gender: card.gender || '',
    status: normalizeStatusForWizard(card.maritalStatus || card.status),
    countOfChildren:
      card.numOfChildren !== undefined ? String(card.numOfChildren) : '',
    phone: card.phone || '',
    mail: card.mail || '',
    isEngaged: String(card.relationshipStatus === 'engaged'),
    isMarried: String(card.relationshipStatus === 'married'),
    partnerName: card.partnerName || '',
    partnerProfileId: card.partnerProfileId || '',
    partnerOutsideApp: String(Boolean(card.partnerOutsideApp)),
    collaborationMatchmaker: card.collaborationMatchmaker || '',
    matchRangeAges: card.matchRangeAges || '',
    matchRangeHeights: card.matchRangeHeights || '',
    ...(stringifyProfileImages(card.images)
      ? {images: stringifyProfileImages(card.images)}
      : {}),
  }));
};

const getWizardValuesFromProfile = (
  profile: Record<string, unknown>,
): WizardFormValues => {
  const fields = getAllWizardFields();
  const fieldIds = new Set(fields.map(field => field.id));
  const relationshipStatus = String(profile.relationshipStatus || '');
  const values: WizardFormValues = {};

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

  return applyCandidateRangeDefaults(applyWizardOptionIds({
    ...values,
    fullName: String(profile.fullName || profile.name || values.fullName || ''),
    gender: String(profile.gender || values.gender || ''),
    age:
      profile.age !== undefined && profile.age !== null
        ? String(profile.age)
        : values.age || '',
    hight: String(profile.hight || profile.height || values.hight || ''),
    city: String(profile.city || values.city || ''),
    status: normalizeStatusForWizard(
      String(profile.maritalStatus || profile.status || values.status || ''),
    ),
    countOfChildren:
      profile.countOfChildren !== undefined && profile.countOfChildren !== null
        ? String(profile.countOfChildren)
        : values.countOfChildren || '',
    phone: String(profile.phone || values.phone || ''),
    mail: String(profile.mail || profile.email || values.mail || ''),
    isEngaged: String(relationshipStatus === 'engaged'),
    isMarried: String(relationshipStatus === 'married'),
    partnerName: String(profile.partnerName || ''),
    partnerProfileId: String(profile.partnerProfileId || ''),
    partnerOutsideApp:
      profile.partnerOutsideApp !== undefined
        ? String(Boolean(profile.partnerOutsideApp))
        : 'false',
    collaborationMatchmaker: String(profile.collaborationMatchmaker || ''),
    ...(stringifyProfileImages(profile.images)
      ? {images: stringifyProfileImages(profile.images)}
      : {}),
  }));
};

type ProfilePayload = Record<string, unknown>;

const buildProfilePayload = (values: WizardFormValues): ProfilePayload => {
  const entries = Object.entries(values).filter(([key, value]) => {
    if (key.endsWith('OptionId')) {
      return false;
    }

    if (value === undefined || value === null) {
      return false;
    }

    return String(value).trim().length > 0;
  });

  const payload: ProfilePayload = Object.fromEntries(
    entries.map(([key, value]) => [
      key,
      normalizeWizardFieldValue(key, String(value)),
    ]),
  );

  if (typeof payload.images === 'string') {
    try {
      payload.images = JSON.parse(payload.images);
    } catch {
      payload.images = [];
    }
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (typeof value !== 'string' || key === 'images') {
      return;
    }

    try {
      const parsedValue = JSON.parse(value);

      if (Array.isArray(parsedValue)) {
        payload[key] = parsedValue;
      }
    } catch {
      // Keep regular strings as-is.
    }
  });

  if (values.gender) {
    payload.gender = normalizeGenderForPayload(values);
  }

  if (values.status) {
    const normalizedStatus = normalizeStatusForPayload(values);

    payload.status = normalizedStatus;
    payload.maritalStatus = normalizedStatus;
  }

  const relationshipStatus =
    values.isMarried === 'true'
      ? 'married'
      : values.isEngaged === 'true'
        ? 'engaged'
        : '';
  const partnerName = String(values.partnerName || '').trim();

  if (relationshipStatus) {
    payload.relationshipStatus = relationshipStatus;
    payload.partnerName = partnerName;
    payload.partnerProfileId = values.partnerProfileId || undefined;
    payload.partnerOutsideApp = values.partnerOutsideApp === 'true';
    payload.collaborationMatchmaker =
      values.collaborationMatchmaker || undefined;
  } else {
    payload.relationshipStatus = undefined;
    payload.partnerName = '';
    payload.partnerProfileId = undefined;
    payload.partnerOutsideApp = false;
    payload.collaborationMatchmaker = undefined;
  }

  delete payload.isEngaged;
  delete payload.isMarried;

  return payload;
};

const validateWizardValues = (values: WizardFormValues) =>
  Object.fromEntries(
    Object.entries(values).map(([id, value]) => [
      id,
      validateWizardField(id, value, values),
    ]),
  );

const Wizard = () => {
  const navigation = useNavigation<WizardNavigationProp>();
  const route = useRoute<WizardRouteProp>();
  const {t, isRTL} = useLanguage();
  const {showMessage} = useMessage();
  const routeParams = route.params;
  const isEditMode = routeParams?.mode === 'edit';
  const shouldRestoreToAvailable = Boolean(routeParams?.restoreToAvailable);
  const editProfileId = routeParams?.profileId || routeParams?.card?.profileId || '';
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [submitErrorKey, setSubmitErrorKey] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<WizardFormValues>(() =>
    applyCandidateRangeDefaults({
      ...getInitialWizardValues(getAllWizardFields()),
      ...(routeParams?.restoreToAvailable
        ? clearRelationshipValues(getWizardValuesFromCard(routeParams?.card))
        : getWizardValuesFromCard(routeParams?.card)),
      ...(routeParams?.candidatePhone ? {phone: routeParams.candidatePhone} : {}),
      ...(routeParams?.matchmakerPhone
        ? {matcherPhone: routeParams.matchmakerPhone}
        : {}),
    }),
  );
  const [fieldErrors, setFieldErrors] = useState<WizardFormValues>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPartnerSearchFocused, setIsPartnerSearchFocused] = useState(false);
  const [isRelationshipModalOpen, setIsRelationshipModalOpen] = useState(false);
  const [profilesCache, setProfilesCache] = useState<any[]>([]);
  const [matchmakerOptions, setMatchmakerOptions] = useState<Option[]>([]);
  const [relationshipDraft, setRelationshipDraft] = useState<WizardFormValues>(
    () => getRelationshipValues(formValues),
  );

  const wizardSteps: WizardStep[] = [
    {id: 1, name: 'Step1', title: 'wizardAboutMe', comp: Step1Screen},
    {id: 2, name: 'Step2', title: 'wizardPartner', comp: Step2Screen},
    {id: 3, name: 'Step3', title: 'uploadPictures', comp: Step3Screen},
  ];

  const currentStep =
    wizardSteps.find(step => step.id === wizardStep) ?? wizardSteps[0];

  useFocusEffect(
    React.useCallback(() => {
      setWizardStep(1);
    }, []),
  );

  useEffect(() => {
    if (!routeParams?.resetToken || isEditMode) {
      return;
    }

    setWizardStep(1);
    setSubmitErrorKey(null);
    setFieldErrors({});
    setFormValues({
      ...applyCandidateRangeDefaults({
        ...getInitialWizardValues(getAllWizardFields()),
        ...(routeParams?.candidatePhone ? {phone: routeParams.candidatePhone} : {}),
        ...(routeParams?.matchmakerPhone
          ? {matcherPhone: routeParams.matchmakerPhone}
          : {}),
      }),
    });
  }, [isEditMode, routeParams?.resetToken]);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    setWizardStep(1);
    setSubmitErrorKey(null);
    setFormValues(currentValues => ({
      ...currentValues,
      ...(shouldRestoreToAvailable
        ? clearRelationshipValues(getWizardValuesFromCard(routeParams?.card))
        : getWizardValuesFromCard(routeParams?.card)),
    }));
  }, [isEditMode, routeParams?.card, editProfileId, shouldRestoreToAvailable]);

  useEffect(() => {
    if (!isEditMode || !editProfileId) {
      return;
    }

    let isMounted = true;

    const loadProfileForEdit = async () => {
      try {
        const response = await api.get(`/api/profiles/${editProfileId}`);
        const profile = response.data?.profile;

        if (!isMounted || !profile) {
          return;
        }

        setFormValues(currentValues => ({
          ...currentValues,
          ...(shouldRestoreToAvailable
            ? clearRelationshipValues(getWizardValuesFromProfile(profile))
            : getWizardValuesFromProfile(profile)),
        }));
      } catch (error) {
        console.warn('Failed to load profile for wizard edit', error);
        if (isMounted) {
          setSubmitErrorKey('profileNotFoundForUpdate');
        }
      }
    };

    loadProfileForEdit();

    return () => {
      isMounted = false;
    };
  }, [editProfileId, isEditMode, shouldRestoreToAvailable]);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    let isMounted = true;

    const loadProfilesForPartnerSearch = async () => {
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

        if (isMounted) {
          setProfilesCache(profiles);
          setMatchmakerOptions(buildMatchmakerOptions(matchmakers, profiles));
        }
      } catch (error) {
        console.warn('Failed to load profiles for partner search', error);
      }
    };

    loadProfilesForPartnerSearch();

    return () => {
      isMounted = false;
    };
  }, [isEditMode]);

  useEffect(() => {
    setFieldErrors(validateWizardValues(formValues));
  }, [formValues]);

  const isStepComplete = (step: number) => {
    if (step === 1) {
      return (
        isFormComplete(detailsFormArray, formValues) &&
        !hasVisibleFieldErrors(detailsFormArray, formValues, fieldErrors)
      );
    }

    if (step === 2) {
      return (
        isFormComplete(matchFormArray, formValues) &&
        !hasVisibleFieldErrors(matchFormArray, formValues, fieldErrors)
      );
    }

    return step === 3;
  };

  const updateFormValue = (id: string, value: string) => {
    setFormValues(currentValues => {
      const normalizedValue = normalizeWizardFieldValue(id, value);
      const nextValues = applyCandidateRangeDefaults({
        ...currentValues,
        [id]: normalizedValue,
      });

      return nextValues;
    });
  };

  const updateFormValues = (values: WizardFormValues) => {
    setFormValues(currentValues => {
      const normalizedValues = Object.fromEntries(
        Object.entries(values).map(([id, value]) => [
          id,
          normalizeWizardFieldValue(id, value),
        ]),
      );

      const nextValues = applyCandidateRangeDefaults({
        ...currentValues,
        ...normalizedValues,
      });

      return nextValues;
    });
  };

  const openRelationshipModal = () => {
    setRelationshipDraft(getRelationshipValues(formValues));
    setIsPartnerSearchFocused(false);
    setIsRelationshipModalOpen(true);
  };

  const closeRelationshipModal = () => {
    setRelationshipDraft(getRelationshipValues(formValues));
    setIsPartnerSearchFocused(false);
    setIsRelationshipModalOpen(false);
  };

  const saveRelationshipDraft = () => {
    updateFormValues(relationshipDraft);
    setIsPartnerSearchFocused(false);
    setIsRelationshipModalOpen(false);
  };

  const updateRelationshipStatus = (status: 'engaged' | 'married') => {
    const shouldClear =
      status === 'engaged'
        ? relationshipDraft.isEngaged === 'true'
        : relationshipDraft.isMarried === 'true';

    if (shouldClear) {
      setRelationshipDraft(currentDraft => ({
        ...currentDraft,
        isEngaged: 'false',
        isMarried: 'false',
        partnerName: '',
        partnerProfileId: '',
        partnerOutsideApp: 'false',
        collaborationMatchmaker: '',
      }));
      setIsPartnerSearchFocused(false);
      return;
    }

    setRelationshipDraft(currentDraft => ({
      ...currentDraft,
      isEngaged: String(status === 'engaged'),
      isMarried: String(status === 'married'),
    }));
  };

  const partnerSuggestions = useMemo(() => {
    const currentProfileId = String(editProfileId || '');

    return profilesCache
      .filter(profile => {
        const profileId = String(profile._id || profile.id || '');
        const relationshipStatus = String(profile.relationshipStatus || '');

        return (
          profileId !== currentProfileId &&
          relationshipStatus !== 'engaged' &&
          relationshipStatus !== 'married'
        );
      })
      .map(profile => String(profile.fullName || profile.name || '').trim())
      .filter(Boolean);
  }, [editProfileId, profilesCache]);

  const filteredPartnerSuggestions = useMemo(() => {
    const searchValue = normalizeName(relationshipDraft.partnerName);

    return partnerSuggestions.filter(partnerName => {
      if (!searchValue) {
        return true;
      }

      return normalizeName(partnerName).includes(searchValue);
    });
  }, [relationshipDraft.partnerName, partnerSuggestions]);

  const partnerProfileByName = useMemo(() => {
    return profilesCache.reduce<Record<string, string>>((profilesByName, profile) => {
      const name = normalizeName(profile.fullName || profile.name);
      const profileId = String(profile._id || profile.id || '');

      if (name && profileId) {
        profilesByName[name] = profileId;
      }

      return profilesByName;
    }, {});
  }, [profilesCache]);

  const partnerGenderByName = useMemo(
    () =>
      profilesCache.reduce<Record<string, string>>((profilesByName, profile) => {
        const name = normalizeName(profile.fullName || profile.name);
        const gender = getGenderKey(String(profile.gender || ''));

        if (name && gender) {
          profilesByName[name] = gender;
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
        normalizeName(item.fullName || item.name) === normalizeName(partnerName),
    );

    return !partnerExists;
  };

  const selectPartner = (partnerName: string) => {
    const partnerProfileId = partnerProfileByName[normalizeName(partnerName)] || '';

    setRelationshipDraft(currentDraft => ({
      ...currentDraft,
      partnerName,
      partnerProfileId,
      partnerOutsideApp: 'false',
    }));
    setIsPartnerSearchFocused(false);
  };

  const isEngaged = formValues.isEngaged === 'true';
  const isMarried = formValues.isMarried === 'true';
  const relationshipStatus = isMarried ? 'married' : isEngaged ? 'engaged' : '';
  const isDraftEngaged = relationshipDraft.isEngaged === 'true';
  const isDraftMarried = relationshipDraft.isMarried === 'true';
  const draftRelationshipStatus = isDraftMarried
    ? 'married'
    : isDraftEngaged
      ? 'engaged'
      : '';
  const selectedPartnerGender =
    partnerGenderByName[normalizeName(relationshipDraft.partnerName)] ||
    getOppositeGender(formValues.gender);
  const draftRelationshipStatusTextKey = getRelationshipStatusTextKey(
    draftRelationshipStatus,
    selectedPartnerGender,
  );
  const engagedStatusTextKey = getRelationshipStatusTextKey(
    'engaged',
    selectedPartnerGender,
  );
  const marriedStatusTextKey = getRelationshipStatusTextKey(
    'married',
    selectedPartnerGender,
  );
  const selectedCollaborationMatchmakerLabel =
    matchmakerOptions.find(
      option =>
        String(option.value || '') === relationshipDraft.collaborationMatchmaker,
    )?.label || '';
  const shouldShowPartnerSearch = isEditMode && Boolean(draftRelationshipStatus);

  const renderRelationshipSection = () => {
    if (!isEditMode) {
      return null;
    }

    return (
      <Modal
        transparent
        visible={isRelationshipModalOpen}
        animationType="fade"
        onRequestClose={closeRelationshipModal}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.relationshipOverlay}
          onPress={closeRelationshipModal}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.relationshipModal}
            onPress={() => {}}>
            <View style={styles.relationshipHeader}>
              <View style={styles.relationshipTitleBlock}>
                <CustomText
                  text="relationshipStatus"
                  customStyle={[
                    styles.relationshipTitle,
                    isRTL ? styles.textRight : styles.textLeft,
                  ]}
                />
                {draftRelationshipStatus ? (
                  <CustomText
                    text={draftRelationshipStatusTextKey}
                    customStyle={[
                      styles.relationshipSubtitle,
                      isRTL ? styles.textRight : styles.textLeft,
                    ]}
                  />
                ) : null}
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.relationshipCloseButton}
                onPress={closeRelationshipModal}>
                <CustomText
                  text="×"
                  customStyle={styles.relationshipCloseText}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.statusOptions}>
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={isSubmitting}
                onPress={() => updateRelationshipStatus('engaged')}
                style={[
                  styles.statusOption,
                  isDraftEngaged && styles.statusOptionActive,
                  isSubmitting && styles.disabledOption,
                ]}>
                <CustomText
                  text={engagedStatusTextKey}
                  customStyle={[
                    styles.statusOptionText,
                    isDraftEngaged && styles.statusOptionTextActive,
                  ]}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                disabled={isSubmitting}
                onPress={() => updateRelationshipStatus('married')}
                style={[
                  styles.statusOption,
                  isDraftMarried && styles.statusOptionActive,
                  isSubmitting && styles.disabledOption,
                ]}>
                <CustomText
                  text={marriedStatusTextKey}
                  customStyle={[
                    styles.statusOptionText,
                    isDraftMarried && styles.statusOptionTextActive,
                  ]}
                />
              </TouchableOpacity>
            </View>

            {shouldShowPartnerSearch ? (
              <View style={styles.partnerSearchContainer}>
                <CustomSelect
                  layout="column"
                  text="collaborationMatchmaker"
                  value={selectedCollaborationMatchmakerLabel}
                  options={matchmakerOptions}
                  onSelect={option =>
                    setRelationshipDraft(currentDraft => ({
                      ...currentDraft,
                      collaborationMatchmaker: option?.value || '',
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
                    isSubmitting && styles.readOnlyInput,
                  ]}
                  editable={!isSubmitting}
                  value={String(relationshipDraft.partnerName || '')}
                  placeholder={t('partnerSearchPlaceholder')}
                  placeholderTextColor="#A8ADB7"
                  onFocus={() => setIsPartnerSearchFocused(true)}
                  onChangeText={value => {
                    const matchedPartnerProfileId =
                      partnerProfileByName[normalizeName(value)] || '';

                    setRelationshipDraft(currentDraft => ({
                      ...currentDraft,
                      partnerName: value,
                      partnerProfileId: matchedPartnerProfileId,
                      partnerOutsideApp: String(
                        checkPartnerOutsideApp(
                          draftRelationshipStatus,
                          value.trim(),
                        ),
                      ),
                    }));
                    setIsPartnerSearchFocused(true);
                  }}
                />

                {!isSubmitting && isPartnerSearchFocused ? (
                  <View style={styles.suggestionsPanel}>
                    {filteredPartnerSuggestions.length > 0 ? (
                      filteredPartnerSuggestions
                        .slice(0, 5)
                        .map(partnerName => (
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
                ) : null}
              </View>
            ) : null}

            <View
              style={[
                styles.relationshipActions,
                isRTL ? styles.rowReverse : styles.row,
              ]}>
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={isSubmitting}
                style={[
                  styles.relationshipActionButton,
                  styles.cancelButton,
                  isSubmitting && styles.disabledOption,
                ]}
                onPress={closeRelationshipModal}>
                <CustomText
                  text="cancel"
                  customStyle={styles.relationshipActionText}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                disabled={isSubmitting}
                style={[
                  styles.relationshipActionButton,
                  styles.saveButton,
                  isSubmitting && styles.disabledOption,
                ]}
                onPress={saveRelationshipDraft}>
                <CustomText
                  text="save"
                  customStyle={[
                    styles.relationshipActionText,
                    styles.saveButtonText,
                  ]}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };

  const renderRelationshipFloatingButton = () => {
    if (!isEditMode || shouldRestoreToAvailable) {
      return null;
    }

    return (
      <TouchableOpacity
        activeOpacity={0.86}
        style={[
          styles.relationshipFloatingButton,
          relationshipStatus && styles.relationshipFloatingButtonActive,
        ]}
        onPress={openRelationshipModal}>
        <Image source={RingImage} style={styles.relationshipFloatingImage} />
        {relationshipStatus ? <View style={styles.relationshipFloatingDot} /> : null}
      </TouchableOpacity>
    );
  };

  const renderComp = () => {
    const SpecificStep = currentStep?.comp;
    return SpecificStep ? (
      <SpecificStep
        values={formValues}
        fieldErrors={fieldErrors}
        onChange={updateFormValue}
        onChangeMany={updateFormValues}
      />
    ) : null;
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= wizardSteps.length) {
      setWizardStep(step);
    }
  };

  const finishWizard = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const currentRelationshipStatus =
        formValues.isMarried === 'true'
          ? 'married'
          : formValues.isEngaged === 'true'
            ? 'engaged'
            : '';
      const currentPartnerName = String(formValues.partnerName || '').trim();

      if (isEditMode && currentRelationshipStatus && !currentPartnerName) {
        setSubmitErrorKey('partnerRequired');
        showMessage({type: 'error', message: t('partnerRequired')});
        return;
      }

      const payload = buildProfilePayload(formValues);

      if (isEditMode && currentRelationshipStatus) {
        const matchedPartnerProfileId =
          partnerProfileByName[normalizeName(currentPartnerName)] || '';

        payload.partnerProfileId = matchedPartnerProfileId || undefined;
        payload.partnerOutsideApp = checkPartnerOutsideApp(
          currentRelationshipStatus,
          currentPartnerName,
        );
      }

      if (isEditMode && shouldRestoreToAvailable) {
        payload.status = 'active';
        payload.relationshipStatus = '';
        payload.archivedReason = '';
        payload.partnerName = '';
        payload.partnerProfileId = undefined;
        payload.partnerOutsideApp = false;
      }

      if (isEditMode) {
        if (!editProfileId) {
          setSubmitErrorKey('profileNotFoundForUpdate');
          showMessage({type: 'error', message: t('profileNotFoundForUpdate')});
          return;
        }

        await api.put(`/api/profiles/${editProfileId}`, payload);
      } else {
        await api.post('/api/profiles', payload);
      }

      setSubmitErrorKey(null);
      const sessionRole = await getSessionRole();

      if (!isEditMode && sessionRole === 'user') {
        showMessage({
          type: 'success',
          message: t('candidateDetailsSavedSuccess'),
          autoDismissMs: false,
          onClose: async () => {
            await clearSession();
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
          },
        });
        return;
      }

      showMessage({
        type: 'success',
        message: t('saveChangesSuccess'),
      });
      navigation.navigate('AllCardsScreen');
    } catch (error) {
      const axiosError = error as AxiosError<{message?: string}>;

      if (!isEditMode && axiosError.response?.status === 409) {
        setSubmitErrorKey('candidateAlreadyExists');
        showMessage({type: 'error', message: t('candidateAlreadyExists')});
        return;
      }

      if (isEditMode && axiosError.response?.status === 404) {
        setSubmitErrorKey('profileNotFoundForUpdate');
        showMessage({type: 'error', message: t('profileNotFoundForUpdate')});
        return;
      }

      const messageKey = isEditMode ? 'saveChangesError' : 'errorServer';
      setSubmitErrorKey(messageKey);
      showMessage({type: 'error', message: t(messageKey)});
    } finally {
      setIsSubmitting(false);
    }
  };
  const btnAProps: WizardBtnType = {
    isBtnDis: wizardStep <= 1,
    btnTxt: 'previous',
    btnFunc: () => goToStep(wizardStep - 1),
  };

  const btnBProps: WizardBtnType = {
    isBtnDis: isSubmitting || !isStepComplete(wizardStep),
    btnTxt:
      wizardStep === wizardSteps.length ? (isEditMode ? 'save' : 'finish') : 'next',
    btnFunc: () =>
      wizardStep === wizardSteps.length
        ? finishWizard()
        : goToStep(wizardStep + 1),
  };

  const txtProps: WizardTxtType = {
    text:
      currentStep?.id === 2 && getPartnerGenderFromValues(formValues)
        ? getPartnerGenderFromValues(formValues) === 'female'
          ? 'wizardPartnerFemale'
          : 'wizardPartnerMale'
        : currentStep?.title || '',
  };

  return (
    <HomeScreen
      disableScroll
      pinChildren={
        <WizardHeader
          btnAProps={btnAProps}
          btnBProps={btnBProps}
          textProps={txtProps}
          currentStep={wizardStep}
          totalSteps={wizardSteps.length}
        />
      }>
      <View style={styles.containerDynamicComp}>
        {submitErrorKey && (
          <View style={styles.errorContainer}>
            <ErrorBanner message={submitErrorKey} />
          </View>
        )}
        {renderRelationshipSection()}
        {renderComp()}
      </View>
      {renderRelationshipFloatingButton()}
    </HomeScreen>
  );
};

export default Wizard;
