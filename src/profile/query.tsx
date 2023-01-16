import { SupabaseClient } from '@supabase/supabase-js'

import { Database } from '../../lib/database.types'

export type ProfileResult = Database['public']['Tables']['profile']['Row'] & {
  tenent?: {
    id: string
    name: string
  }
}

export async function getProfilesQuery(database: SupabaseClient): Promise<ProfileResult[]> {
  const { data, error } = await database
    .from('profile')
    .select('*, tenent(id, name)')
    .neq('status', 0)
    .neq('tenent.status', 0)

  if (error) {
    throw error
  }

  return data
}
