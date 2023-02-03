import { SupabaseClient } from '@supabase/supabase-js'

import { Database } from '../../../lib/database.types'
import { ProfileResult } from '../profile/query'

type Response = Database['public']['Tables']['commitment']['Row']

type GetCommitmentByIdParams = {
	database: SupabaseClient
	profiles: ProfileResult[]
	commitmentId: string
}

export async function getCommitmentById({
	database,
	commitmentId,
	profiles = [],
}: GetCommitmentByIdParams): Promise<Response> {
	const request = database.from('commitment').select('*')

	if (!profiles.find((item) => item.level === 0)) {
		request.in(
			'tenent_id',
			profiles.filter((item) => item.tenent_id).map((item) => item.tenent_id),
		)
	}
	request.eq('id', commitmentId)

	const { data, error } = await request

	if (error) {
		throw error
	}
	if (!data?.[0]) {
		throw new Error('not found')
	}
	return data[0]
}
