import {MatchCardType} from '../components/MatchCard/MatchCard.type';
import {mapProfileToCard} from './generalFunction';
import i18n from './i18n';

type ScoreResult = {
  score: number;
  reasons: string[];
};

const MIN_VISIBLE_MATCH_SCORE = 70;

const parseJsonArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(item => String(item));
  }

  if (value === undefined || value === null || value === '') {
    return [];
  }

  try {
    const parsed = JSON.parse(String(value));

    if (Array.isArray(parsed)) {
      return parsed.map(item => String(item));
    }
  } catch {
    return String(value)
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }

  return [];
};

const parseRange = (value: unknown): [number, number] | null => {
  const values = parseJsonArray(value).map(Number);

  if (values.length !== 2 || values.some(item => !Number.isFinite(item))) {
    return null;
  }

  return [Math.min(values[0], values[1]), Math.max(values[0], values[1])];
};

const normalizeId = (value: unknown, map: Record<string, string> = {}) => {
  const rawValue = String(value || '').trim();
  const normalized = rawValue.toLowerCase().replace(/\s+/g, '');

  return map[rawValue] ?? map[normalized] ?? rawValue;
};

const normalizeHeight = (height: unknown) => {
  const value = Number(String(height || '').replace(/[^\d.]/g, ''));

  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return value < 3 ? Math.round(value * 100) : Math.round(value);
};

const STATUS_MAP: Record<string, string> = {
  single: '1',
  singlestatus: '1',
  widower: '2',
  widowedstatus: '2',
  divorced: '3',
  divorcedstatus: '3',
  widowerwithchildren: '4',
  widowedwithchildrenstatus: '4',
  divorcedwithchildren: '5',
  divorcedwithchildrenstatus: '5',
};

const HASHKAFA_MAP: Record<string, string> = {
  religious: '1',
  religiousstatus: '1',
  haredi: '2',
  haredistatus: '2',
  modernharedi: '3',
  modernharedistatus: '3',
  baalteshuva: '4',
  baalteshuvastatus: '4',
  datileumi: '5',
  datileumistatus: '5',
};

const ZEREM_MAP: Record<string, string> = {
  hasidic: '1',
  litvish: '2',
  lithuanian: '2',
  sephardic: '3',
  sephardiccommunity: '3',
};

const AREA_MAP: Record<string, string> = {
  centralarea: '1',
  center: '1',
  mercaz: '1',
  southernarea: '2',
  south: '2',
  darom: '2',
  northernarea: '3',
  north: '3',
  tzafon: '3',
  jerusalemarea: '4',
  jerusalem: '4',
  yerushalayim: '4',
  shfelaarea: '5',
  shfela: '5',
};

const addScore = (result: ScoreResult, points: number, reasonKey?: string) => {
  result.score += points;

  if (reasonKey) {
    result.reasons.push(i18n.t(reasonKey));
  }
};

const scoreRange = (
  result: ScoreResult,
  range: [number, number] | null,
  targetValue: number,
  points: number,
  reasonKey: string,
) => {
  if (!range || !Number.isFinite(targetValue) || targetValue <= 0) {
    return;
  }

  if (targetValue >= range[0] && targetValue <= range[1]) {
    addScore(result, points, reasonKey);
  }
};

const scoreCheckbox = (
  result: ScoreResult,
  preferredValues: string[],
  targetValue: unknown,
  points: number,
  reasonKey: string,
  map: Record<string, string> = {},
) => {
  if (!preferredValues.length || !targetValue) {
    return;
  }

  const normalizedTarget = normalizeId(targetValue, map);

  if (
    preferredValues
      .map(item => normalizeId(item, map))
      .includes(normalizedTarget)
  ) {
    addScore(result, points, reasonKey);
  }
};

const scorePreference = (
  result: ScoreResult,
  preferredValue: unknown,
  targetValue: unknown,
  points: number,
  reasonKey: string,
  map: Record<string, string> = {},
) => {
  if (!preferredValue || !targetValue) {
    return;
  }

  const preferredValues = parseJsonArray(preferredValue);
  const normalizedPreferredValues = (
    preferredValues.length ? preferredValues : [String(preferredValue)]
  ).map(item => normalizeId(item, map));
  const normalizedTarget = normalizeId(targetValue, map);

  if (normalizedPreferredValues.includes(normalizedTarget)) {
    addScore(result, points, reasonKey);
  }
};

const hasPreference = (
  preferredValue: unknown,
  targetValue: unknown,
  map: Record<string, string> = {},
) => {
  if (!preferredValue || !targetValue) {
    return false;
  }

  const preferredValues = parseJsonArray(preferredValue);
  const normalizedPreferredValues = (
    preferredValues.length ? preferredValues : [String(preferredValue)]
  ).map(item => normalizeId(item, map));
  const normalizedTarget = normalizeId(targetValue, map);

  return normalizedPreferredValues.includes(normalizedTarget);
};

const normalizeText = (value: unknown) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');

const normalizeCity = (value: unknown) =>
  String(value || '')
    .trim()
    .replace(/[־-]/g, ' ')
    .replace(/\s+/g, '');

const getCityArea = (profile: any) => {
  const explicitArea =
    profile?.area || profile?.residentialArea || profile?.cityArea;

  if (explicitArea) {
    return normalizeId(explicitArea, AREA_MAP);
  }

  return '';
};

const isTrueValue = (value: unknown) => String(value) === 'true';

const scoreTextPreference = (
  result: ScoreResult,
  preferredValue: unknown,
  targetValue: unknown,
  points: number,
  reasonKey: string,
) => {
  const normalizedPreferred = normalizeText(preferredValue);
  const normalizedTarget = normalizeText(targetValue);

  if (
    normalizedPreferred &&
    normalizedTarget &&
    normalizedPreferred === normalizedTarget
  ) {
    addScore(result, points, reasonKey);
  }
};

const getProfileId = (profile: any) =>
  String(profile?._id || profile?.id || '');

const scoreOneWay = (source: any, target: any) => {
  const result: ScoreResult = {score: 0, reasons: []};

  scoreRange(
    result,
    parseRange(source.matchRangeAges),
    Number(target.age),
    18,
    'matchReasonAge',
  );
  scoreRange(
    result,
    parseRange(source.matchRangeHeights),
    normalizeHeight(target.hight || target.height),
    14,
    'matchReasonHeight',
  );

  scoreCheckbox(
    result,
    parseJsonArray(source.matchStatus),
    target.status,
    14,
    'matchReasonStatus',
    STATUS_MAP,
  );

  const targetStatus = normalizeId(target.status, STATUS_MAP);
  const targetChildren = Number(target.countOfChildren);
  const childrenRange = parseRange(source.matchCountOfChildren);

  if (
    (targetStatus === '4' || targetStatus === '5') &&
    childrenRange &&
    Number.isFinite(targetChildren) &&
    targetChildren >= childrenRange[0] &&
    targetChildren <= childrenRange[1]
  ) {
    addScore(result, 8, 'matchReasonChildren');
  }

  scoreCheckbox(
    result,
    parseJsonArray(source.matchHashkafa),
    target.hashkafa,
    12,
    'matchReasonHashkafa',
    HASHKAFA_MAP,
  );
  scorePreference(
    result,
    source.matchZerem,
    target.zerem,
    8,
    'matchReasonCommunity',
    ZEREM_MAP,
  );
  scoreTextPreference(
    result,
    source.matchHasidut,
    target.hasidut,
    5,
    'matchReasonHasidut',
  );
  scoreTextPreference(
    result,
    source.matchTribe,
    target.tribe,
    5,
    'matchReasonEthnicCommunity',
  );

  const targetArea = getCityArea(target);
  const isPreferredArea = hasPreference(source.matchArea, targetArea, AREA_MAP);

  if (isPreferredArea) {
    addScore(result, 7, 'matchReasonArea');
  }

  if (
    isTrueValue(target.isStayInCurrentLocation) &&
    normalizeCity(source.city) === normalizeCity(target.city)
  ) {
    addScore(result, 4, 'matchReasonStayInArea');
  }

  scoreCheckbox(
    result,
    parseJsonArray(source.matchWhatWorks),
    target.whatWorks,
    8,
    'matchReasonOccupation',
  );
  scoreCheckbox(
    result,
    parseJsonArray(source.matchEducation),
    target.education,
    7,
    'matchReasonEducation',
  );
  scoreCheckbox(
    result,
    parseJsonArray(source.matchBodyStructure),
    target.bodyStructure,
    6,
    'matchReasonBodyType',
  );

  if (
    String(source.matchIsGer) !== 'false' ||
    String(target.isGer) !== 'true'
  ) {
    addScore(result, 3);
  }

  return result;
};

export const scoreMatchProfiles = (
  currentProfile: any,
  targetProfile: any,
): ScoreResult => {
  const result: ScoreResult = {score: 0, reasons: []};

  const currentToTarget = scoreOneWay(currentProfile, targetProfile);
  const targetToCurrent = scoreOneWay(targetProfile, currentProfile);

  result.score += Math.round(
    ((currentToTarget.score + targetToCurrent.score) / 2) * 1.45,
  );
  result.reasons.push(...currentToTarget.reasons, ...targetToCurrent.reasons);

  if (normalizeCity(currentProfile.city) === normalizeCity(targetProfile.city)) {
    addScore(result, 5, 'matchReasonCity');
  }

  const score = Math.max(1, Math.min(99, Math.round(result.score)));

  return {
    score,
    reasons: Array.from(new Set(result.reasons.filter(Boolean))).slice(0, 3),
  };
};

export const buildAiSortedMatches = (
  currentCard: MatchCardType,
  profiles: any[],
  options: {minScore?: number} = {},
) => {
  const minScore = options.minScore ?? MIN_VISIBLE_MATCH_SCORE;
  const currentProfile =
    profiles.find(profile => getProfileId(profile) === currentCard.profileId) ||
    profiles.find(
      profile =>
        String(profile.phone || '').replace(/\D/g, '') ===
        String(currentCard.phone || '').replace(/\D/g, ''),
    ) ||
    currentCard;

  return profiles
    .filter(profile => getProfileId(profile) !== getProfileId(currentProfile))
    .map(profile => {
      const score = scoreMatchProfiles(currentProfile, profile);

      return {
        ...mapProfileToCard(profile),
        aiMatchScore: score.score,
        aiMatchReasons: score.reasons,
      };
    })
    .filter(match => (match.aiMatchScore || 0) >= minScore)
    .sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0));
};
