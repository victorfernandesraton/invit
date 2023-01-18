import Nullstack, { NullstackClientContext } from 'nullstack'

import { createClient, SupabaseClient } from '@supabase/supabase-js'

import { Database } from './lib/database.types'
import Application from './src/Application'

type ClientContext = {
  database: SupabaseClient
}

const context = Nullstack.start(Application) as NullstackClientContext<ClientContext>

context.start = async function start({ settings }: NullstackClientContext<ClientContext>) {
  const database = createClient<Database>(settings.supabaseApiUrl, settings.supabaseRoleKey, {
    db: {
      schema: 'public',
    },
  })
  context.database = database
}

export default context
