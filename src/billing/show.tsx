import Nullstack, { NullstackClientContext } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import { Database } from '../../lib/database.types'
import { Profile } from '../Application'
import ShowContainer from '../components/showContainer'

type Tenent = {
  id: string
  name: string
}

type ShowBillingContest = {
  database: SupabaseClient
  profiles: Profile[]
}

class ShowBilling extends Nullstack {

  result: Database['public']['Tables']['billing']['Row'][] = []
  error: Error = null
  offset = 0
  limit = 5
  tenents: Tenent[] = []

  async initiate({ database, profiles }: NullstackClientContext<ShowBillingContest>) {
    console.log('teste')
    this.tenents = profiles.map((item) => item.tenent)
    const { data: commitment, error: commitmentError } = await database
      .from('commitment')
      .select('*')
      .in(
        'tenent_id',
        this.tenents.map((item) => item.id),
      )
      .neq('status', 0)
      .order('start_at', {
        ascending: true,
      })
      .order('end_at', {
        ascending: true,
        nullsFirst: false,
      })
      .range(this.offset, this.limit)

    this.error = commitmentError
  }

  render() {
    if (!this.initiated) {
      return <div>Loading...</div>
    }

    if (!this.result.length && this.initiated) {
      return <h1>Empty</h1>
    }
    return <ShowContainer title="Billing" />
  }

}

export default ShowBilling
