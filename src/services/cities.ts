import {Option} from '../utils/FormFields.type';

const GOV_DATA_API_URL = 'https://data.gov.il/api/3/action/datastore_search';
const ISRAEL_CITIES_RESOURCE_ID = 'b7cf8f14-64a2-4b33-8d4b-edb286fdbd37';
const CITY_NAME_FIELD = 'שם_ישוב';
const PAGE_LIMIT = 500;

type GovCityRecord = {
  _id?: number;
  [CITY_NAME_FIELD]?: string;
};

type GovCitiesResponse = {
  success?: boolean;
  result?: {
    records?: GovCityRecord[];
    total?: number;
  };
};

let cachedCities: Option[] = [];

const normalizeCityName = (value: string) => value.replace(/\s+/g, ' ').trim();

const buildCityUrl = (limit: number, offset: number) =>
  `${GOV_DATA_API_URL}?resource_id=${ISRAEL_CITIES_RESOURCE_ID}&limit=${limit}&offset=${offset}`;

const loadAllIsraelCities = async (): Promise<Option[]> => {
  if (cachedCities.length) {
    return cachedCities;
  }

  let offset = 0;
  let total = Infinity;
  const records: GovCityRecord[] = [];

  while (offset < total) {
    const response = await fetch(buildCityUrl(PAGE_LIMIT, offset));
    const data = (await response.json()) as GovCitiesResponse;

    if (!response.ok || !data.success) {
      throw new Error('Failed to fetch cities from data.gov.il');
    }

    const pageRecords = data.result?.records || [];
    total = data.result?.total ?? pageRecords.length;

    records.push(...pageRecords);

    if (!pageRecords.length) {
      break;
    }

    offset += PAGE_LIMIT;
  }

  const seenCities = new Set<string>();

  cachedCities = records.reduce<Option[]>((items, record, index) => {
    const cityName = normalizeCityName(record[CITY_NAME_FIELD] || '');

    if (!cityName || seenCities.has(cityName)) {
      return items;
    }

    seenCities.add(cityName);

    items.push({
      id: record._id || index + 1,
      name: 'city',
      label: cityName,
    });

    return items;
  }, []);

  return cachedCities;
};

export const fetchIsraelCities = async (query: string): Promise<Option[]> => {
  const normalizedQuery = query.trim().toLowerCase();

  const cities = await loadAllIsraelCities();

  if (normalizedQuery.length < 2) {
    return cities.slice(0, 20);
  }

  return cities
    .filter(city => city.label.toLowerCase().includes(normalizedQuery))
    .slice(0, 20);
};
