import AsyncStorage from '@react-native-async-storage/async-storage';
import {getSessionUser} from './session';

export type WizardDraftValues = Record<string, string>;

const DRAFT_PREFIX = 'candidateWizardDraft:';

const normalizePhone = (phone?: string) => String(phone || '').replace(/\D/g, '');

const getDraftPhone = async (phone?: string) => {
  const explicitPhone = normalizePhone(phone);

  if (explicitPhone) {
    return explicitPhone;
  }

  const sessionUser = await getSessionUser();
  return normalizePhone(sessionUser?.phone);
};

const getDraftKey = async (phone?: string) => {
  const draftPhone = await getDraftPhone(phone);

  return draftPhone ? `${DRAFT_PREFIX}${draftPhone}` : '';
};

export const loadCandidateWizardDraft = async (phone?: string) => {
  const draftKey = await getDraftKey(phone);

  if (!draftKey) {
    return null;
  }

  const rawDraft = await AsyncStorage.getItem(draftKey);

  if (!rawDraft) {
    return null;
  }

  try {
    const parsedDraft = JSON.parse(rawDraft);

    if (!parsedDraft || typeof parsedDraft !== 'object') {
      return null;
    }

    return parsedDraft as WizardDraftValues;
  } catch {
    return null;
  }
};

export const saveCandidateWizardDraft = async (
  values: WizardDraftValues,
  phone?: string,
) => {
  const draftKey = await getDraftKey(phone || values.phone);

  if (!draftKey) {
    return;
  }

  const currentDraft = (await loadCandidateWizardDraft(phone || values.phone)) || {};
  const nextDraft = {
    ...currentDraft,
    ...values,
  };

  await AsyncStorage.setItem(draftKey, JSON.stringify(nextDraft));
};

export const clearCandidateWizardDraft = async (phone?: string) => {
  const draftKey = await getDraftKey(phone);

  if (draftKey) {
    await AsyncStorage.removeItem(draftKey);
  }
};
