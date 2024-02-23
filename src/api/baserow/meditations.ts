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
}: { search?: string, creatorId?: number } = {}): Promise<MeditationData> {
  const baseUrl = new URL('https://api.baserow.io/api/database/rows/table/259238/?user_field_names=true');

  if (search) {
    baseUrl.searchParams.set('search', search);
  }

  if (creatorId) {
    const filter = { "filter_type": "AND", "filters": [{ "type": "link_row_has", "field": "Creator", "value": creatorId }], "groups": [] };
    baseUrl.searchParams.set('creator', encodeURI(JSON.stringify(filter)));
  }

  const response = await fetch(baseUrl, {
    method: "GET",
    headers: {
      Authorization: 'Token ' + import.meta.env.BASEROW_API_KEY,
    }
  })

  const meditations: MeditationData = await response.json()

  return meditations
}

export async function getMeditationsByCreatorId(id: number): Promise<MeditationData> {
  const baseUrl = new URL('https://api.baserow.io/api/database/rows/table/259238/?user_field_names=true');

  const filter = { "filter_type": "AND", "filters": [{ "type": "link_row_has", "field": "Creator", "value": id }], "groups": [] };
  baseUrl.searchParams.set('creator', encodeURI(JSON.stringify(filter)));

  const response = await fetch(baseUrl, {
    method: "GET",
    headers: {
      Authorization: 'Token ' + import.meta.env.BASEROW_API_KEY,
    }
  })

  const meditations: MeditationData = await response.json()

  return meditations
}