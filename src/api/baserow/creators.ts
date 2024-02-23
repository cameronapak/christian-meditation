export interface CreatorData {
  count: number
  next: string
  previous: any
  results: Result[]
}

export interface Result {
  id: number
  order: string
  Name: string
  "Admin Notes": string
  "YouTube Channel": string
  Avatar: Avatar[]
  "Short Description": string
  Website: string
  Approved: boolean
  Meditations: Meditation[]
}

export interface Avatar {
  url: string
  thumbnails: Thumbnails
  name: string
  size: number
  mime_type: string
  is_image: boolean
  image_width: number
  image_height: number
  uploaded_at: string
}

export interface Thumbnails {
  tiny: Tiny
  small: Small
}

export interface Tiny {
  url: string
  width: number
  height: number
}

export interface Small {
  url: string
  width: number
  height: number
}

export interface Meditation {
  id: number
  value: string
}

export async function getAllCreators({
  search = '',
}: { search?: string }): Promise<CreatorData> {
  const baseUrl = new URL('https://api.baserow.io/api/database/rows/table/259237/?user_field_names=true');

  if (search) {
    baseUrl.searchParams.set('search', search);
  }

  const response = await fetch(baseUrl, {
    method: "GET",
    headers: {
      Authorization: 'Token ' + import.meta.env.BASEROW_API_KEY,
    }
  })

  const creators: CreatorData = await response.json()

  return creators
}

export async function getCreatorByID(id: number): Promise<Result> {
  const response = await fetch(`https://api.baserow.io/api/database/rows/table/259237/${id}/?user_field_names=true`, {
    method: "GET",
    headers: {
      Authorization: 'Token ' + import.meta.env.BASEROW_API_KEY,
    }
  })

  const creator: Result = await response.json()

  return creator
}
