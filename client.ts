import Nullstack, { NullstackClientContext } from 'nullstack'

import { createClient } from '@supabase/supabase-js'

import Application from './src/Application'

const context = Nullstack.start(Application) as NullstackClientContext

context.start = async function start({ settings }: NullstackClientContext) {
  console.log(settings)
  const database = createClient(settings.supabaseApiUrl, settings.supabaseAnonKey, {
    db: {
      schema: 'public',
    },
  })
  context.database = database
}

export default context
