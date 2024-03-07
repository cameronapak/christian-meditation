import { fetchAndCache } from '../index';

export interface MeditationData {
  count: number
  next: string
  previous: any
  results: Meditation[]
}

export interface Meditation {
  id: number
  order: string
  Title: string
  Notes: string
  "YouTube Video URL"?: string
  Creator: Creator[]
  Duration: Duration
  "YouTube Video ID"?: string
  "Thumbnail URL"?: string
  "Audio File URL": string;
  "Meditation Id": string | number;
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

export async function getMeditationsByCreatorId({ id, size, query }: { id: number | string, size?: number, query?: string }): Promise<MeditationData | null> {
  if (id === -1) {
    return null;
  }

  const baseUrl = new URL('https://api.baserow.io/api/database/rows/table/259238/');

  baseUrl.searchParams.set('user_field_names', 'true');
  const filters = { "filter_type": "AND", "filters": [{ "type": "link_row_has", "field": "Creator", "value": "14" }, ], "groups": [] }
  if (query) {
    filters['filters'].push({ "type": "contains", "field": "Title", "value": query });
  }
  baseUrl.searchParams.set('filters', JSON.stringify(filters));
  if (size) {
    baseUrl.searchParams.set('size', size.toString());
  }

  const meditations: MeditationData = await fetchAndCache({
    url: baseUrl.href,
    cacheKey: `meditations-${id}-${query}-${size}`,
    options: {
      method: "GET",
      headers: {
        Authorization: 'Token ' + import.meta.env.BASEROW_API_KEY,
      }
    }
  })

  return meditations
}

export async function getMeditationById(id: string): Promise<Meditation> {
  const meditation: Meditation = await fetchAndCache({
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

  if (ids.includes(-1)) {
    return {
      count: 0,
      next: '',
      previous: null,
      results: []
    }
  }

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

export const DURATIONS = {
  '~5 min': 1362559,
  '~10 min': 1362560,
  '~15 min': 1362562,
  '~20 min': 1362563,
  '~30 min+': 1362564,
}

function pickDurationIdFromSeconds(seconds: number) {
  // if less than 6.5 minutes, then it's around 5 min
  if (seconds < 6.5 * 60) {
    return DURATIONS['~5 min'];
  } else if (seconds < 12 * 60) {
    return DURATIONS['~10 min'];
  } else if (seconds < 17 * 60) {
    return DURATIONS['~15 min'];
  } else if (seconds < 25 * 60) {
    return DURATIONS['~20 min'];
  } else {
    return DURATIONS['~30 min+'];
  }
}

export async function createMeditation({
  title,
  adminNotes,
  creatorId,
  durationInSeconds,
  audioFileUrl,
}: {
  title: string,
  adminNotes: string,
  creatorId: number,
  durationInSeconds: number,
  audioFileUrl: string
}): Promise<Meditation> {
  const baseUrl = new URL('https://api.baserow.io/api/database/rows/table/259238/?user_field_names=true');

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Authorization: 'Token ' + import.meta.env.BASEROW_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "Title": title,
      "Notes": adminNotes,
      "YouTube Video URL": "",
      "Creator": [
        creatorId
      ],
      "Duration": pickDurationIdFromSeconds(durationInSeconds),
      "Audio File URL": audioFileUrl
    })
  })

  const data = await response.json();

  return data;
}
