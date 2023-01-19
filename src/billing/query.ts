import { SupabaseClient } from '@supabase/supabase-js'

import { Database } from '../../lib/database.types'

type GetBillingByIdParams = {
  database: SupabaseClient
  commitmentId: string
  billingId: string
}
type GetBillingByIdResult = Database['public']['Tables']['billing']['Row'] & {
  commitment: {
    id: string
    tenent_id: string
    currency: string
  }
}

export async function getBillingById(params: GetBillingByIdParams): Promise<GetBillingByIdResult[]> {
  const { data, error } = await params.database
    .from('billing')
    .select('*, commitment(id, tenent_id, currency, tenent(id, status))')
    .neq('status', 0)
    .neq('commitment.tenent.status', 0)
    .neq('commitment.status', 0)
    .eq('commitment.id', params.commitmentId)
    .eq('id', params.billingId)

  if (error) {
    throw error
  }
  return data
}
