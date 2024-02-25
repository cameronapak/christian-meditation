import { fetchAndCache } from '../index';

export interface MeditationData {
  count: number
  next: string
  previous: any
  results: Result[]
}

export interface Result {
  id: number
  order: string
  Title: string
  Notes: string
  "YouTube Video URL": string
  Creator: Creator[]
  Duration: Duration
  "YouTube Video ID": string
  "Thumbnail URL": string
  "Meditation Id": string | number
}

export interface Creator {
  id: number
  value: string
}

export interface Duration {
  id: number
  value: string
  color: string
}


export async function getAllMeditations({
  search = '',
  creatorId,
  randomize = true
}: { search?: string, creatorId?: number, randomize?: boolean } = {}): Promise<MeditationData> {
  const baseUrl = new URL('https://api.baserow.io/api/database/rows/table/259238/?user_field_names=true');

  if (search) {
    baseUrl.searchParams.set('search', search);
  }

  if (creatorId) {
    const filter = { "filter_type": "AND", "filters": [{ "type": "link_row_has", "field": "Creator", "value": creatorId }], "groups": [] };
    baseUrl.searchParams.set('creator', encodeURIComponent(JSON.stringify(filter)));
  }

  const meditations: MeditationData = await fetchAndCache({
    url: baseUrl.href,
    cacheKey: `meditations-all-${search}-${creatorId}`,
    options: {
      method: "GET",
      headers: {
        Authorization: 'Token ' + import.meta.env.BASEROW_API_KEY,
      },
    }
  })

  if (randomize) {
    meditations.results.sort(() => Math.random() - 0.5);
  }

  return meditations
}

export async function getMeditationsByCreatorId(id: number): Promise<MeditationData> {
  const baseUrl = new URL('https://api.baserow.io/api/database/rows/table/259238/?user_field_names=true');

  const filter = { "filter_type": "AND", "filters": [{ "type": "link_row_has", "field": "Creator", "value": id }], "groups": [] };
  baseUrl.searchParams.set('user_field_names', encodeURIComponent(JSON.stringify(filter)));

  const meditations: MeditationData = await fetchAndCache({
    url: baseUrl.href,
    cacheKey: `meditations-${id}`,
    options: {
      method: "GET",
      headers: {
        Authorization: 'Token ' + import.meta.env.BASEROW_API_KEY,
      }
    }
  })

  return meditations
}

export async function getMeditationById(id: string): Promise<Result> {
  const meditation: Result = await fetchAndCache({
    url: `https://api.baserow.io/api/database/rows/table/259238/${id}/?user_field_names=true`,
    cacheKey: `meditation-${id}`,
    options: {
      method: "GET",
      headers: {
        Authorization: 'Token ' + import.meta.env.BASEROW_API_KEY,
      }
    }
  });

  return meditation;
}

export async function getMeditationsByIds(ids: number[]): Promise<MeditationData> {
  // const baseUrl = new URL('https://api.baserow.io/api/database/rows/table/259238/?user_field_names=true');

  // const filters = { "filter_type": "OR", "filters": ids.map(id => ({ "type": "equal", "field": "Meditation Id", "value": `${id}` })), "groups": [] };
  // if (ids.length === 1) {
  //   filters['filter_type'] = "AND";
  // }
  // baseUrl.searchParams.set('filters', encodeURIComponent(JSON.stringify(filters)));

  // try {
  //   const meditations: MeditationData = await fetchAndCache({
  //     url: baseUrl.href,
  //     cacheKey: `meditations-${ids.join('-')}`,
  //     options: {
  //       method: "GET",
  //       headers: {
  //         Authorization: 'Token ' + import.meta.env.BASEROW_API_KEY,
  //       }
  //     }
  //   })

  //   // @ts-ignore - Sometimes the error exists.
  //   if (meditations?.error) {
  //     // @ts-ignore - Sometimes the error exists.
  //     throw new Error(meditations?.detail?.error || 'Failed to fetch meditations');
  //   }

  //   return meditations
  // } catch (error) {
  //   console.error(error);
  //   throw error;
  // }

  console.warn('TODO for Cam - Figure out how to get meditations by ids using standard filter to save API calls.');

  const results = [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const meditation = await getMeditationById(id.toString());

    if (meditation) {
      results.push(meditation);
    }
  }

  return { results } as MeditationData;
}