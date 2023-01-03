import Nullstack, { NullstackClientContext } from 'nullstack'

import { createClient } from '@supabase/supabase-js'

import { Database } from './lib/database.types'
import Application from './src/Application'

const context = Nullstack.start(Application) as NullstackClientContext

context.start = async function start({ settings }: NullstackClientContext) {
  const database = createClient<Database>(settings.supabaseApiUrl, settings.supabaseAnonKey, {
    db: {
      schema: 'public',
    },
  })
  context.database = database
}

export default context
