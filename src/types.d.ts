import { SupabaseClient } from '@supabase/supabase-js'

import { Database } from '../lib/database.types'

type Ticket = Database['public']['Tables']['ticket']

type BaseClientContext = { database: SupabaseClient }

type Tenent = {
	id: string
	name: string
}
