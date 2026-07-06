import React, {useEffect, useMemo, useState} from 'react';
import CustomButton from '../CustomButton/CustomButton';
import CustomModal from '../CustomModal/CustomModal';
import CloseIcon from '../CloseIcon/CloseIcon';
import {Image, Keyboard, TextInput, View} from 'react-native';
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
import Colors from '../../utils/Colors';
import {
  WizardBtnType,
  WizardFormValues,
  WizardTxtType,
  WizardStep,
} from './Wizard.type';
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
} from '../../utils/formCompletion';
import {RootStackParamList} from '../MainStackNavigation/MainStackNavigation.type';
import {Option} from '../../utils/FormFields.type';
import ErrorBanner from '../ErrorBanner/ErrorBanner';
import {useLanguage} from '../../utils/LanguageProvider';
import {useMessage} from '../../utils/MessageProvider';
import CustomSelect from '../CustomSelect/CustomSelect';
import CustomText from '../CustomText/CustomText';
import AppIconImage from '../../../assets/app-icon/app-icon-1024.png';
import api from '../../services/api';
import {
  clearSession,
  getSessionRole,
  UserRole,
} from '../../services/session';
import {uploadProfileImages} from '../../services/uploads';
import LogoutSvg from '../../assets/images/logout.svg';
import MoreInfoIcon from '../../assets/images/moreInfo.svg';
import {BUTTON_ICON_SIZE} from '../CustomButton/CustomButton';
import {
  applyCandidateRangeDefaults,
  buildMatchmakerOptions,
  buildProfilePayload,
  clearRelationshipValues,
  getAllWizardFields,
  getGenderKey,
  getInitialWizardValues,
  getPartnerGenderFromValues,
  getProfileId,
  getRelationshipStatusTextKey,
  getRelationshipValues,
  getWizardValuesFromCard,
  getWizardValuesFromProfile,
  normalizeName,
  normalizePhone,
  validateWizardValues,
} from './Wizard.helpers';

type WizardNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type WizardRouteProp = RouteProp<RootStackParamList, 'Wizard'>;

type WizardContentProps = {
  isMultipleRegistration: boolean;
};

const WizardContent = ({isMultipleRegistration}: WizardContentProps) => {
  const navigation = useNavigation<WizardNavigationProp>();
  const route = useRoute<WizardRouteProp>();
  const {t, isRTL} = useLanguage();
  const {showMessage} = useMessage();
  const routeParams = route.params;
  const isEditMode = routeParams?.mode === 'edit';
  const shouldRestoreToAvailable = Boolean(routeParams?.restoreToAvailable);
  const routeEditProfileId =
    routeParams?.profileId || getProfileId(routeParams?.card);
  const [loadedEditProfileId, setLoadedEditProfileId] = useState('');
  const editProfileId = routeEditProfileId || loadedEditProfileId;
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [submitErrorKey, setSubmitErrorKey] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<WizardFormValues>(() =>
    applyCandidateRangeDefaults({
      ...getInitialWizardValues(getAllWizardFields()),
      ...(routeParams?.restoreToAvailable
        ? clearRelationshipValues(getWizardValuesFromCard(routeParams?.card))
        : getWizardValuesFromCard(routeParams?.card)),
      ...(routeParams?.candidatePhone
        ? {phone: routeParams.candidatePhone}
        : {}),
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

  const resetForAnotherCandidate = () => {
    setWizardStep(1);
    setSubmitErrorKey(null);
    setFieldErrors({});
    setFormValues(
      applyCandidateRangeDefaults({
        ...getInitialWizardValues(getAllWizardFields()),
        ...(routeParams?.matchmakerPhone
          ? {matcherPhone: routeParams.matchmakerPhone}
          : {}),
      }),
    );
  };

  const finishCreateFlow = async (sessionRole: string | null) => {
    if (sessionRole === 'user') {
      await clearSession();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      );
      return;
    }

    navigation.navigate('AllCardsScreen');
  };

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
        ...(routeParams?.candidatePhone
          ? {phone: routeParams.candidatePhone}
          : {}),
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

    setLoadedEditProfileId('');
    setWizardStep(1);
    setSubmitErrorKey(null);
    setFieldErrors({});
    setFormValues(
      applyCandidateRangeDefaults({
        ...getInitialWizardValues(getAllWizardFields()),
        ...(shouldRestoreToAvailable
          ? clearRelationshipValues(getWizardValuesFromCard(routeParams?.card))
          : getWizardValuesFromCard(routeParams?.card)),
      }),
    );
  }, [
    isEditMode,
    routeParams?.card,
    routeParams?.card?.phone,
    routeEditProfileId,
    shouldRestoreToAvailable,
  ]);

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

        setLoadedEditProfileId(getProfileId(profile));
        setFormValues(
          applyCandidateRangeDefaults({
            ...getInitialWizardValues(getAllWizardFields()),
            ...(shouldRestoreToAvailable
              ? clearRelationshipValues(getWizardValuesFromProfile(profile))
              : getWizardValuesFromProfile(profile)),
          }),
        );
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

          if (!editProfileId && routeParams?.card?.phone) {
            const matchedProfile = profiles.find(
              (profile: any) =>
                normalizePhone(profile.phone) ===
                normalizePhone(routeParams.card?.phone),
            );

            const matchedProfileId = getProfileId(matchedProfile);

            if (matchedProfileId) {
              setLoadedEditProfileId(matchedProfileId);
            }
          }
        }
      } catch (error) {
        console.warn('Failed to load profiles for partner search', error);
      }
    };

    loadProfilesForPartnerSearch();

    return () => {
      isMounted = false;
    };
  }, [editProfileId, isEditMode, routeParams?.card?.phone]);

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
      const nextValues = applyCandidateRangeDefaults(
        {
          ...currentValues,
          [id]: normalizedValue,
        },
        currentValues,
      );

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

      const nextValues = applyCandidateRangeDefaults(
        {
          ...currentValues,
          ...normalizedValues,
        },
        currentValues,
      );

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
    const partnerName = normalizeName(relationshipDraft.partnerName);
    const matchedProfile = profilesCache.find(
      profile => normalizeName(profile.fullName || profile.name) === partnerName,
    );
    const isEligibleProfile = matchedProfile
      ? eligiblePartnerProfiles.some(
          profile => getProfileId(profile) === getProfileId(matchedProfile),
        )
      : true;

    if (partnerName && !isEligibleProfile) {
      showMessage({
        type: 'error',
        message: t('invalidRelationshipPartner'),
      });
      return;
    }

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

  const eligiblePartnerProfiles = useMemo(() => {
    const currentProfileId = String(editProfileId || '');
    const currentPhone = normalizePhone(
      formValues.phone || routeParams?.card?.phone,
    );
    const requiredPartnerGender = getPartnerGenderFromValues(formValues);
    const selectedMatchmakerId = String(
      relationshipDraft.collaborationMatchmaker || '',
    ).trim();

    return profilesCache
      .filter(profile => {
        const profileId = getProfileId(profile);
        const profilePhone = normalizePhone(profile.phone);
        const profileGender = getGenderKey(profile.gender);
        const relationshipStatus = String(profile.relationshipStatus || '');
        const assignedMatchmaker = String(
          profile.assignedMatchmaker || '',
        ).trim();

        return (
          profileId !== currentProfileId &&
          (!currentPhone || profilePhone !== currentPhone) &&
          Boolean(requiredPartnerGender) &&
          profileGender === requiredPartnerGender &&
          (!selectedMatchmakerId ||
            assignedMatchmaker === selectedMatchmakerId) &&
          relationshipStatus !== 'engaged' &&
          relationshipStatus !== 'married'
        );
      });
  }, [
    editProfileId,
    formValues,
    profilesCache,
    relationshipDraft.collaborationMatchmaker,
    routeParams?.card?.phone,
  ]);

  const partnerSuggestions = useMemo(() => {
    return eligiblePartnerProfiles
      .map(profile => String(profile.fullName || profile.name || '').trim())
      .filter(Boolean);
  }, [eligiblePartnerProfiles]);

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
    return eligiblePartnerProfiles.reduce<Record<string, string>>(
      (profilesByName, profile) => {
        const name = normalizeName(profile.fullName || profile.name);
        const profileId = String(profile._id || profile.id || '');

        if (name && profileId) {
          profilesByName[name] = profileId;
        }

        return profilesByName;
      },
      {},
    );
  }, [eligiblePartnerProfiles]);

  const checkPartnerOutsideApp = (
    relationshipStatus: string,
    partnerName: string,
  ) => {
    if (!relationshipStatus || !partnerName) {
      return false;
    }

    const partnerExists = profilesCache.some(
      (item: any) =>
        normalizeName(item.fullName || item.name) ===
        normalizeName(partnerName),
    );

    return !partnerExists;
  };

  const resolveEditProfileIdForSave = async () => {
    if (!isEditMode) {
      return '';
    }

    if (editProfileId) {
      return editProfileId;
    }

    const profilePhone = normalizePhone(
      formValues.phone || routeParams?.card?.phone,
    );

    if (!profilePhone) {
      return '';
    }

    const cachedProfile = profilesCache.find(
      (profile: any) => normalizePhone(profile.phone) === profilePhone,
    );
    const cachedProfileId = getProfileId(cachedProfile);

    if (cachedProfileId) {
      setLoadedEditProfileId(cachedProfileId);
      return cachedProfileId;
    }

    const [activeProfilesResponse, archivedProfilesResponse] =
      await Promise.all([
        api.get('/api/profiles'),
        api.get('/api/profiles', {params: {status: 'archived'}}),
      ]);
    const activeProfiles = Array.isArray(activeProfilesResponse.data?.profiles)
      ? activeProfilesResponse.data.profiles
      : [];
    const archivedProfiles = Array.isArray(
      archivedProfilesResponse.data?.profiles,
    )
      ? archivedProfilesResponse.data.profiles
      : [];
    const matchedProfile = [...activeProfiles, ...archivedProfiles].find(
      (profile: any) => normalizePhone(profile.phone) === profilePhone,
    );
    const matchedProfileId = getProfileId(matchedProfile);

    if (matchedProfileId) {
      setLoadedEditProfileId(matchedProfileId);
    }

    return matchedProfileId;
  };

  const selectPartner = (partnerName: string) => {
    const partnerProfileId =
      partnerProfileByName[normalizeName(partnerName)] || '';

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
      option =>
        String(option.value || '') ===
        relationshipDraft.collaborationMatchmaker,
    )?.label || '';
  const shouldShowPartnerSearch =
    isEditMode && Boolean(draftRelationshipStatus);

  const renderRelationshipSection = () => {
    if (!isEditMode) {
      return null;
    }

    return (
      <CustomModal
        visible={isRelationshipModalOpen}
        onClose={closeRelationshipModal}
        closeOnBackdropPress
        showCloseButton
        overlayStyle={styles.relationshipOverlay}
        contentStyle={styles.relationshipModal}
        headerStyle={styles.relationshipHeader}
        title="relationshipStatus"
        titleContainerStyle={styles.relationshipTitleBlock}
        titleStyle={[
          styles.relationshipTitle,
          isRTL ? styles.textRight : styles.textLeft,
        ]}
        closeButtonStyle={styles.relationshipCloseButton}>
        <View
          style={[
            styles.statusOptions,
            isRTL ? styles.rowReverse : styles.row,
          ]}>
          {[
            {
              value: 'engaged' as const,
              text: engagedStatusTextKey,
              selected: isDraftEngaged,
            },
            {
              value: 'married' as const,
              text: marriedStatusTextKey,
              selected: isDraftMarried,
            },
          ].map(option => (
            <CustomButton
              unstyled
              key={option.value}
              activeOpacity={0.85}
              isDisabled={isSubmitting}
              onPress={() => updateRelationshipStatus(option.value)}
              text={option.text}
              customStyle={[
                styles.statusOption,
                option.selected && styles.statusOptionActive,
              ]}
              customTextStyle={[
                styles.statusOptionText,
                option.selected && styles.statusOptionTextActive,
              ]}
            />
          ))}
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
                isSubmitting && styles.readOnlyInput,
              ]}
              editable={!isSubmitting}
              value={String(relationshipDraft.partnerName || '')}
              placeholder={t('partnerSearchPlaceholder')}
              placeholderTextColor={Colors.placeholder}
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
                  filteredPartnerSuggestions.slice(0, 5).map(partnerName => (
                    <CustomButton
                      unstyled
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
            ) : null}
          </View>
        ) : null}

        <View
          style={[
            styles.relationshipActions,
            isRTL ? styles.rowReverse : styles.row,
          ]}>
          <CustomButton
            unstyled
            activeOpacity={0.85}
            isDisabled={isSubmitting}
            text="cancel"
            customStyle={[styles.relationshipActionButton, styles.cancelButton]}
            customTextStyle={styles.relationshipActionText}
            onPress={closeRelationshipModal}
          />

          <CustomButton
            unstyled
            activeOpacity={0.85}
            isDisabled={isSubmitting}
            text="save"
            customStyle={[styles.relationshipActionButton, styles.saveButton]}
            customTextStyle={[
              styles.relationshipActionText,
              styles.saveButtonText,
            ]}
            onPress={saveRelationshipDraft}
          />
        </View>
      </CustomModal>
    );
  };

  const renderRelationshipFloatingButton = () => {
    if (!isEditMode || shouldRestoreToAvailable) {
      return null;
    }

    return (
      <CustomButton
        unstyled
        activeOpacity={0.86}
        style={[
          styles.relationshipFloatingButton,
          relationshipStatus && styles.relationshipFloatingButtonActive,
        ]}
        onPress={openRelationshipModal}>
        <Image
          accessible={false}
          source={AppIconImage}
          style={styles.relationshipFloatingImage}
        />
        {relationshipStatus ? (
          <View style={styles.relationshipFloatingDot} />
        ) : null}
      </CustomButton>
    );
  };

  const exitEditWithoutSaving = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('AllCardsScreen');
  };

  const showExitConfirmation = () => {
    showMessage({
      type: 'info',
      title: t('exitWithoutSaving'),
      message: t('exitEditWithoutSavingConfirm'),
      cancelText: t('continueEditing'),
      confirmText: t('exitWithoutSaving'),
      onConfirm: exitEditWithoutSaving,
    });
  };

  const exitAction = isEditMode ? (
    <CustomButton
      variant="secondary"
      text="exitEdit"
      accessibilityLabel={t('exitEdit')}
      customStyle={styles.formExitButton}
      customTextStyle={styles.formExitButtonText}
      icon={<LogoutSvg width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />}
      onPress={showExitConfirmation}
    />
  ) : undefined;

  const renderComp = () => {
    const SpecificStep = currentStep?.comp;
    return SpecificStep ? (
      <SpecificStep
        values={formValues}
        fieldErrors={fieldErrors}
        onChange={updateFormValue}
        onChangeMany={updateFormValues}
        headerAction={exitAction}
      />
    ) : null;
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= wizardSteps.length) {
      Keyboard.dismiss();
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

      const targetProfileId = isEditMode
        ? await resolveEditProfileIdForSave()
        : '';

      if (isEditMode && !targetProfileId) {
        setSubmitErrorKey('profileNotFoundForUpdate');
        showMessage({type: 'error', message: t('profileNotFoundForUpdate')});
        return;
      }

      const payloadFullName = String(
        payload.fullName || payload.name || '',
      ).trim();
      const payloadPhone = String(payload.phone || '').trim();

      if (!payloadFullName || !payloadPhone) {
        const messageKey = !payloadFullName
          ? 'candidateNameRequired'
          : 'candidatePhoneRequired';
        setSubmitErrorKey(messageKey);
        showMessage({type: 'error', message: t(messageKey)});
        setWizardStep(1);
        return;
      }

      if (Array.isArray(payload.images) && payload.images.length) {
        try {
          payload.images = await uploadProfileImages(payload.images);
        } catch (uploadError) {
          const uploadAxiosError = uploadError as AxiosError<{
            error?: string;
            message?: string;
          }>;
          const messageKey =
            uploadAxiosError.response?.data?.error === 'storage_not_configured'
              ? 'errorImageStorageNotConfigured'
              : 'errorImageUpload';

          setSubmitErrorKey(messageKey);
          showMessage({type: 'error', message: t(messageKey)});
          setWizardStep(3);
          return;
        }
      }

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
        await api.put(`/api/profiles/${targetProfileId}`, payload);
      } else {
        await api.post('/api/profiles', payload);
      }

      setSubmitErrorKey(null);
      const sessionRole = await getSessionRole();

      if (!isEditMode && isMultipleRegistration) {
        showMessage({
          type: 'success',
          title: t('candidateRegistrationSuccessTitle'),
          message: t('candidateRegistrationSuccessMessage'),
          autoDismissMs: false,
          confirmText: t('registerAnotherCandidate'),
          cancelText: t('finishRegistration'),
          onConfirm: resetForAnotherCandidate,
          onCancel: () => finishCreateFlow(sessionRole),
          onClose: () => finishCreateFlow(sessionRole),
        });
        return;
      }

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
      const axiosError = error as AxiosError<{
        message?: string;
        field?: string;
        error?: string;
      }>;
      const serverMessage = axiosError.response?.data?.message;
      const errorField = axiosError.response?.data?.field;

      if (axiosError.response?.status === 409) {
        setSubmitErrorKey('candidateAlreadyExists');
        showMessage({type: 'error', message: t('candidateAlreadyExists')});
        return;
      }

      if (axiosError.response?.status === 400) {
        const messageKey =
          errorField === 'fullName'
            ? 'candidateNameRequired'
            : errorField === 'phone'
              ? 'candidatePhoneRequired'
              : 'errorRequiredFields';
        setSubmitErrorKey(messageKey);
        showMessage({type: 'error', message: t(messageKey)});
        setWizardStep(1);
        return;
      }

      if (axiosError.response?.status === 403) {
        setSubmitErrorKey('errorProfileCreateDenied');
        showMessage({type: 'error', message: t('errorProfileCreateDenied')});
        return;
      }

      if (isEditMode && axiosError.response?.status === 404) {
        setSubmitErrorKey('profileNotFoundForUpdate');
        showMessage({type: 'error', message: t('profileNotFoundForUpdate')});
        return;
      }

      const messageKey = isEditMode ? 'saveChangesError' : 'errorServer';
      setSubmitErrorKey(messageKey);
      showMessage({
        type: 'error',
        message: serverMessage || t(messageKey),
      });
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
      wizardStep === wizardSteps.length
        ? isEditMode
          ? 'save'
          : 'finish'
        : 'next',
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

const Wizard = () => {
  const navigation = useNavigation<WizardNavigationProp>();
  const route = useRoute<WizardRouteProp>();
  const {t, isRTL} = useLanguage();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [requiresCommitment, setRequiresCommitment] = useState(false);
  const [sessionRole, setSessionRole] = useState<UserRole | null>(null);
  const [hasAcceptedCommitment, setHasAcceptedCommitment] = useState(false);
  const [registrationMode, setRegistrationMode] = useState<
    'single' | 'multiple' | null
  >(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const isEditMode = route.params?.mode === 'edit';

  useEffect(() => {
    let isMounted = true;

    getSessionRole()
      .then(role => {
        if (isMounted) {
          setSessionRole(role);
          setRequiresCommitment(role === 'user');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsCheckingAccess(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(
    () => navigation.addListener('blur', () => setRegistrationMode(null)),
    [navigation],
  );

  const declineCommitment = async () => {
    if (isLeaving) {
      return;
    }

    setIsLeaving(true);
    await clearSession();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  };

  if (isCheckingAccess) {
    return <View style={styles.commitmentGateScreen} />;
  }

  if (requiresCommitment && !hasAcceptedCommitment) {
    return (
      <View style={styles.commitmentGateScreen}>
        <CustomModal
          transparent
          visible
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => undefined}>
          <View style={styles.commitmentOverlay}>
            <View style={styles.commitmentModal}>
              <View
                style={[
                  styles.commitmentHeader,
                  isRTL ? styles.rowReverse : styles.row,
                ]}>
                <CustomText
                  text="candidateCommitmentTitle"
                  customStyle={[
                    styles.commitmentTitle,
                    isRTL ? styles.textRight : styles.textLeft,
                  ]}
                />
                <CustomButton
                  variant="icon"
                  style={styles.relationshipCloseButton}
                  disabled={isLeaving}
                  onPress={declineCommitment}>
                  <CloseIcon />
                </CustomButton>
              </View>
              <CustomText
                text="candidateCommitmentIntro"
                customStyle={[
                  styles.commitmentIntro,
                  isRTL ? styles.textRight : styles.textLeft,
                ]}
              />

              <View style={styles.commitmentItems}>
                {[
                  'candidateCommitmentTruth',
                  'candidateCommitmentObservance',
                  'candidateCommitmentPayment',
                ].map(item => (
                  <View
                    key={item}
                    style={[
                      styles.commitmentItem,
                      isRTL ? styles.rowReverse : styles.row,
                    ]}>
                    <CustomText text="✓" customStyle={styles.commitmentCheck} />
                    <CustomText
                      text={item}
                      customStyle={[
                        styles.commitmentItemText,
                        isRTL ? styles.textRight : styles.textLeft,
                      ]}
                    />
                  </View>
                ))}
              </View>

              <CustomButton
                variant="primary"
                style={styles.commitmentAcceptButton}
                onPress={() => setHasAcceptedCommitment(true)}>
                <CustomText
                  text="candidateCommitmentAccept"
                  customStyle={styles.commitmentAcceptText}
                />
              </CustomButton>
              <CustomButton
                variant="danger"
                style={styles.commitmentDeclineButton}
                disabled={isLeaving}
                onPress={declineCommitment}>
                <CustomText
                  text={isLeaving ? 'loading' : 'candidateCommitmentDecline'}
                  customStyle={styles.commitmentDeclineText}
                />
              </CustomButton>
            </View>
          </View>
        </CustomModal>
      </View>
    );
  }

  if (sessionRole === 'user' && !isEditMode && !registrationMode) {
    return (
      <View style={styles.commitmentGateScreen}>
        <CustomModal
          transparent
          visible
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => undefined}>
          <View style={styles.commitmentOverlay}>
            <View style={styles.registrationModeModal}>
              <CustomButton
                variant="icon"
                accessibilityLabel={t('close')}
                customStyle={styles.registrationModeClose}
                onPress={() => setRegistrationMode('single')}>
                <CloseIcon />
              </CustomButton>
              <View style={styles.registrationModeIconWrap}>
                <MoreInfoIcon
                  width={BUTTON_ICON_SIZE}
                  height={BUTTON_ICON_SIZE}
                  fill={Colors.info}
                />
              </View>
              <CustomText
                text="registrationModeTitle"
                customStyle={styles.registrationModeTitle}
              />
              <CustomText
                text="registrationModeDescription"
                customStyle={styles.registrationModeDescription}
              />
              <View
                style={[
                  styles.registrationModeActions,
                  isRTL ? styles.rowReverse : styles.row,
                ]}>
                <CustomButton
                  variant="primary"
                  text="multipleRegistration"
                  customStyle={styles.registrationModeButton}
                  onPress={() => setRegistrationMode('multiple')}
                />
                <CustomButton
                  variant="secondary"
                  text="singleRegistration"
                  customStyle={styles.registrationModeButton}
                  onPress={() => setRegistrationMode('single')}
                />
              </View>
            </View>
          </View>
        </CustomModal>
      </View>
    );
  }

  return (
    <WizardContent isMultipleRegistration={registrationMode === 'multiple'} />
  );
};

export default Wizard;
