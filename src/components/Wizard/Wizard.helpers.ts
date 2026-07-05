import {MatchCardType} from '../MatchCard/MatchCard.type';
import detailsFormArray from '../../utils/DetailsFormFields';
import matchFormArray from '../../utils/MatchFormFields';
import {FormField, Option} from '../../utils/FormFields.type';
import {
  findFieldOptionByValue,
  normalizeWizardFieldValue,
  validateWizardField,
} from '../../utils/formCompletion';
import {WizardFormValues} from './Wizard.type';

export const getInitialWizardValues = (fields: FormField[]) =>
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

export const getAllWizardFields = () => [
  ...detailsFormArray,
  ...matchFormArray,
];

export const normalizeStatusForWizard = (status?: string) => {
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

export const normalizeName = (value?: string) =>
  String(value || '')
    .trim()
    .toLowerCase();

export const normalizePhone = (value?: string) =>
  String(value || '').replace(/\D/g, '');

export const buildMatchmakerOptions = (
  users: any[],
  profiles: any[],
): Option[] => {
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

export const getGenderKey = (gender?: string) => {
  const normalizedGender = String(gender || '')
    .trim()
    .toLowerCase();

  if (
    normalizedGender === 'male' ||
    normalizedGender === 'זכר' ||
    normalizedGender === '1'
  ) {
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

export const getRelationshipStatusTextKey = (
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

export const getPartnerGenderFromValues = (values: WizardFormValues) => {
  const genderOptionId = String(values.genderOptionId || '').trim();
  const gender = String(values.gender || '')
    .trim()
    .toLowerCase();

  if (genderOptionId === '1' || gender === 'male' || gender === 'זכר') {
    return 'female';
  }

  if (genderOptionId === '2' || gender === 'female' || gender === 'נקבה') {
    return 'male';
  }

  return undefined;
};

export const clearRelationshipValues = (
  values: WizardFormValues,
): WizardFormValues => ({
  ...values,
  status: '',
  statusOptionId: '',
  isEngaged: 'false',
  isMarried: 'false',
  partnerName: '',
  partnerProfileId: '',
  partnerOutsideApp: 'false',
  collaborationMatchmaker: '',
});

export const getRelationshipValues = (
  values: WizardFormValues,
): WizardFormValues => ({
  isEngaged: values.isEngaged || 'false',
  isMarried: values.isMarried || 'false',
  partnerName: values.partnerName || '',
  partnerProfileId: values.partnerProfileId || '',
  partnerOutsideApp: values.partnerOutsideApp || 'false',
  collaborationMatchmaker: values.collaborationMatchmaker || '',
});

export const normalizeGenderForPayload = (values: WizardFormValues) => {
  const genderOptionId = String(values.genderOptionId || '');
  const gender = String(values.gender || '')
    .trim()
    .toLowerCase();

  if (genderOptionId === '1' || gender === 'male' || gender === 'זכר') {
    return 'male';
  }

  if (genderOptionId === '2' || gender === 'female' || gender === 'נקבה') {
    return 'female';
  }

  return values.gender;
};

export const normalizeGenderForWizard = (gender?: string) => {
  const normalizedGender = String(gender || '')
    .trim()
    .toLowerCase();

  if (
    normalizedGender === 'male' ||
    normalizedGender === 'זכר' ||
    normalizedGender === '1'
  ) {
    return 'male';
  }

  if (
    normalizedGender === 'female' ||
    normalizedGender === 'נקבה' ||
    normalizedGender === '2'
  ) {
    return 'female';
  }

  return String(gender || '');
};

export const normalizeStatusForPayload = (values: WizardFormValues) => {
  const statusByOptionId: Record<string, string> = {
    '1': 'singleStatus',
    '2': 'widowedStatus',
    '3': 'divorcedStatus',
    '4': 'widowedWithChildrenStatus',
    '5': 'divorcedWithChildrenStatus',
  };
  const statusOptionId = String(values.statusOptionId || '');

  return (
    statusByOptionId[statusOptionId] ?? normalizeStatusForWizard(values.status)
  );
};

export const applyWizardOptionIds = (
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

    if (field.id === 'gender') {
      const normalizedGender = normalizeGenderForWizard(value);
      const genderOptionId =
        normalizedGender === 'male'
          ? '1'
          : normalizedGender === 'female'
            ? '2'
            : '';

      if (genderOptionId) {
        nextValues.gender = normalizedGender;
        nextValues.genderOptionId = genderOptionId;
        return;
      }
    }

    const selectedOption = findFieldOptionByValue(field, value);

    if (selectedOption) {
      nextValues[field.id] = selectedOption.label;
      nextValues[`${field.id}OptionId`] = String(selectedOption.id);
    }
  });

  return nextValues;
};

export const stringifyProfileImages = (images: unknown) => {
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

export const parsePositiveInteger = (value?: string | number) => {
  const numberValue = Number(String(value || '').replace(/[^\d]/g, ''));

  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null;
};

export const parseHeightInCm = (value?: string | number) => {
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

export const hasRangeValue = (value?: string) => {
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

export const parseRangeValue = (value?: string) => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);

    if (
      Array.isArray(parsed) &&
      parsed.length === 2 &&
      parsed.every(item => Number.isFinite(Number(item)))
    ) {
      return parsed.map(item => Number(item));
    }
  } catch {
    return null;
  }

  return null;
};

export const buildHeightRangeDefault = (heightInCm: number) => [
  heightInCm,
  Math.min(heightInCm + 10, 200),
];

export const isSameRange = (value: string | undefined, range: number[]) => {
  const parsedRange = parseRangeValue(value);

  return Boolean(
    parsedRange &&
    parsedRange.length === range.length &&
    parsedRange.every((item, index) => item === range[index]),
  );
};

export const applyCandidateRangeDefaults = (
  values: WizardFormValues,
  previousValues?: WizardFormValues,
): WizardFormValues => {
  const nextValues = {...values};
  const age = parsePositiveInteger(nextValues.age);
  const heightInCm = parseHeightInCm(nextValues.hight);
  const previousHeightInCm = parseHeightInCm(previousValues?.hight);

  if (age && !hasRangeValue(nextValues.matchRangeAges)) {
    nextValues.matchRangeAges = JSON.stringify([age, Math.min(age + 10, 90)]);
  }

  if (heightInCm) {
    const nextHeightRange = buildHeightRangeDefault(heightInCm);
    const previousHeightRange = previousHeightInCm
      ? buildHeightRangeDefault(previousHeightInCm)
      : null;
    const shouldUpdateHeightRange =
      !hasRangeValue(nextValues.matchRangeHeights) ||
      Boolean(
        previousHeightRange &&
        isSameRange(nextValues.matchRangeHeights, previousHeightRange),
      );

    if (shouldUpdateHeightRange) {
      nextValues.matchRangeHeights = JSON.stringify(nextHeightRange);
    }
  }

  return nextValues;
};

export const getWizardValuesFromCard = (
  card?: MatchCardType,
): WizardFormValues => {
  if (!card) {
    return {};
  }

  return applyCandidateRangeDefaults(
    applyWizardOptionIds({
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
    }),
  );
};

export const getWizardValuesFromProfile = (
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

  return applyCandidateRangeDefaults(
    applyWizardOptionIds({
      ...values,
      fullName: String(
        profile.fullName || profile.name || values.fullName || '',
      ),
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
        profile.countOfChildren !== undefined &&
        profile.countOfChildren !== null
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
    }),
  );
};

export type ProfilePayload = Record<string, unknown>;

export const buildProfilePayload = (
  values: WizardFormValues,
): ProfilePayload => {
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

export const validateWizardValues = (values: WizardFormValues) =>
  Object.fromEntries(
    Object.entries(values).map(([id, value]) => [
      id,
      validateWizardField(id, value, values),
    ]),
  );

export const getProfileId = (
  profile?: Record<string, unknown> | MatchCardType,
) =>
  String(
    (profile as any)?.profileId ||
      (profile as any)?._id ||
      (profile as any)?.id ||
      '',
  ).trim();
