import Nullstack, { NullstackClientContext } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import { Database } from '../../lib/database.types'

type EditCommitmentContext = {
  database: SupabaseClient
}

type Tenent = {
  id: string
  name: string
}

class EditCommitment extends Nullstack {

  loading = false
  error = null
  tenents: Tenent[] = []
  tenent = null
  loadingSubmit = false
  showEndAt = null
  title = null
  description = null
  startAt = null
  endAt = null
  result: Database['public']['Tables']['commitment']['Row'] = null

  async initiate({ database, params }: NullstackClientContext<EditCommitmentContext>) {
    this.loading = true
    const { data: profile, error: errorProfile } = await database
      .from('profile')
      .select('tenent (name, id), id')
      .neq('status', 0)
      .neq('tenent.status', 0)
    this.error = errorProfile
    if (!this.error) {
      this.tenents = profile.map((item) => item.tenent)
      const { data: commitment, error: commitmentError } = await database
        .from('commitment')
        .select('*')
        .in(
          'tenent_id',
          this.tenents.map((item) => item.id),
        )
        .eq('id', params.slug)
      console.log(commitment)
    }
  }

  render() {
    return <></>
  }

}

export default EditCommitment
