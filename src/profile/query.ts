import { SupabaseClient } from '@supabase/supabase-js'

import { Database } from '../../lib/database.types'
import { QueryStorage } from '../storage'

export type ProfileResult = Database['public']['Tables']['profile']['Row'] & {
  tenent?: {
    id: string
    name: string
  }
}

type QueryProfileStorageParams = {
  database: SupabaseClient
}

class QueryProfileStorage extends QueryStorage<QueryProfileStorageParams, ProfileResult[]> {


	constructor() {
    super('profiles', 3)
  }

  async query(params: QueryProfileStorageParams): Promise<ProfileResult[]> {
    const { data, error } = await params.database
      .from('profile')
      .select('*, tenent(id, name)')
      .neq('status', 0)
      .neq('tenent.status', 0)

    if (error) {
      throw error
    }

    return data
  }

}

export async function getProfilesQuery(database: SupabaseClient): Promise<ProfileResult[]> {
  const stub = new QueryProfileStorage()

  return stub.execute({
    database,
  })
}
