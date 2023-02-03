import { SupabaseClient } from '@supabase/supabase-js'

import { Database } from '../../../lib/database.types'
import { ProfileResult } from '../profile/query'

export async function getTenentQuery(
	database: SupabaseClient,
	profiles: ProfileResult[] = [],
): Promise<Database['public']['Tables']['tenent']['Row'][]> {
	const request = database.from('tenent').select('*').neq('status', 0)
	if (!profiles.find((profile) => profile.level === 0)) {
		request.in(
			'id',
			profiles.filter((item) => item?.tenent_id).map((item) => item.tenent_id),
		)
	}

	const { data, error } = await request

	if (error) {
		throw error
	}

	return data
}
