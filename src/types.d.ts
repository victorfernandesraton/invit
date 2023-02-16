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

type Billing = {
	description: string
	id: string
	price: number
	remote: boolean
	status: number
	currency: string
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

type TicketPost = {
	data: {
		ticket: {
			commitment_id: string
			id: number
			title: string
			description: string
			start_at: Date
			end_at?: Date
			price: number
			currency: string
			remote: boolean
		}
		user: {
			email: string
			name?: string
		}
	}
}
