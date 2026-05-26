import {Option} from '../utils/FormFields.type';

const GOV_DATA_API_URL = 'https://data.gov.il/api/3/action/datastore_search';
const ISRAEL_CITIES_RESOURCE_ID = 'b7cf8f14-64a2-4b33-8d4b-edb286fdbd37';
const CITY_NAME_FIELD = 'שם_ישוב';
const CITY_LIMIT = 20;

type GovCityRecord = {
  _id?: number;
  [CITY_NAME_FIELD]?: string;
};

type GovCitiesResponse = {
  success?: boolean;
  result?: {
    records?: GovCityRecord[];
  };
};

let cachedCities: Option[] = [];

const normalizeCityName = (value: string) => value.replace(/\s+/g, ' ').trim();

const buildCityUrl = (query: string) =>
  `${GOV_DATA_API_URL}?resource_id=${ISRAEL_CITIES_RESOURCE_ID}&limit=${CITY_LIMIT}&q=${encodeURIComponent(
    query.trim(),
  )}`;

export const fetchIsraelCities = async (query: string): Promise<Option[]> => {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length < 2) {
    return cachedCities;
  }

  const response = await fetch(buildCityUrl(normalizedQuery));
  const data = (await response.json()) as GovCitiesResponse;

  if (!response.ok || !data.success) {
    throw new Error('Failed to fetch cities from data.gov.il');
  }

  const seenCities = new Set<string>();
  const cities =
    data.result?.records?.reduce<Option[]>((items, record, index) => {
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
    }, []) || [];

  if (cities.length) {
    cachedCities = cities;
  }

  return cities;
};
