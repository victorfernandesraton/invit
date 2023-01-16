import Nullstack, { NullstackClientContext } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import { getProfilesQuery } from '../profile/query'
import ShowTenent from './show'

class Tenent extends Nullstack {

  render() {
    return <ShowTenent route="/tenent" />
  }

}

export default Tenent
