import AsyncStorage from '@react-native-async-storage/async-storage';

const CANDIDATE_REGISTRY_KEY = 'candidateRegistry';

type CandidateIdentity = {
  fullName?: string;
  phone?: string;
};

const normalizePhone = (phone?: string) => (phone || '').replace(/\D/g, '');
const normalizeName = (name?: string) => (name || '').trim().toLowerCase();

const parseRegistry = (value: string | null): CandidateIdentity[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const isCandidateAlreadyRegistered = async (
  candidate: CandidateIdentity,
) => {
  const registry = parseRegistry(
    await AsyncStorage.getItem(CANDIDATE_REGISTRY_KEY),
  );
  const phone = normalizePhone(candidate.phone);
  const fullName = normalizeName(candidate.fullName);

  return registry.some(registeredCandidate => {
    const registeredPhone = normalizePhone(registeredCandidate.phone);
    const registeredName = normalizeName(registeredCandidate.fullName);

    return Boolean(
      (phone && registeredPhone && phone === registeredPhone) ||
        (fullName && registeredName && fullName === registeredName),
    );
  });
};

export const registerCandidateIdentity = async (
  candidate: CandidateIdentity,
) => {
  const registry = parseRegistry(
    await AsyncStorage.getItem(CANDIDATE_REGISTRY_KEY),
  );
  const nextRegistry = [
    ...registry,
    {
      fullName: candidate.fullName,
      phone: candidate.phone,
    },
  ];

  await AsyncStorage.setItem(
    CANDIDATE_REGISTRY_KEY,
    JSON.stringify(nextRegistry),
  );
};
