import Nullstack, { NullstackClientContext } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import Commitment from './commitment'
import { getProfilesQuery } from './profile/query'
import Tenent from './tenent'

type AdmContext = {
  database: SupabaseClient
}

class Adm extends Nullstack {

  prepare(context: NullstackClientContext) {
    context.page.locale = 'en-US'
    context.page.changes = 'never'
    context.page.title = 'Invit - ADM'
  }

  async initiate(context: NullstackClientContext<AdmContext>) {
    const profiles = await getProfilesQuery(context.database)

    if (!profiles.find((p) => p.level <= 2)) {
      context.router.url = '/404'
    }
  }

  render() {
    return (
      <>
        <Commitment route="/adm/commitment/*" />
        <Tenent route="/adm/tenent/*" />
      </>
    )
  }

}

export default Adm
