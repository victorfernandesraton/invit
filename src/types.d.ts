import { Session, SupabaseClient } from '@supabase/supabase-js'

import { Database } from '../lib/database.types'

type Ticket = Database['public']['Tables']['ticket']

type BaseClientContext = { database: SupabaseClient }

type Tenent = {
	id: string
	name: string
}

type Profile = Database['public']['Tables']['profile']['Row'] & {
	tenent?: Tenent
}

type ApplicationProps = {
	database: SupabaseClient
	auth: {
		superAdmin: boolean
		manager: boolean
		session?: Session
		profiles?: Profile[]
	}
}
