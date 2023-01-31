import Nullstack, { NullstackClientContext } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import { Database } from '../../../lib/database.types'
import ShowContainer from '../../components/showContainer'
import { getProfilesQuery } from '../profile/query'
import { getTenentQuery } from './query'

type ShowTenentContext = {
  database: SupabaseClient
}

class ShowTenent extends Nullstack {

  result: Database['public']['Tables']['tenent']['Row'][] = []

  async hydrate(context: NullstackClientContext<ShowTenentContext>) {
    const profiles = await getProfilesQuery(context.database)

    if (!profiles.find((profile) => profile.level < 2)) {
      context.router.url = '/404'
    }

    this.result = await getTenentQuery(context.database, profiles)
  }

  render() {
    if (!this.initiated) {
      return <div>Loading...</div>
    }
    return (
      <ShowContainer createPath="/tenent/create" title="Tenents">
        {this.result.map((item) => item.name)}
        {!this.result.length && <h1>Empty</h1>}
      </ShowContainer>
    )
  }

}

export default ShowTenent
