import { NullstackClientContext } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import { Database } from '../../../lib/database.types'
import { getProfilesQuery } from '../profile/query'
import BillingForm from './form'
import { getBillingById } from './query'

type EditBillingContext = {
  database: SupabaseClient
}

class EditBilling extends BillingForm {

	commitment: {
    currency: string
    id: string
  } = null

  error = null

  description = null
  remote = true
  currency = null
  price = null

  result: Database['public']['Tables']['billing']

  setBillingData() {
    this.description = this.billing.description
    this.price = this.billing.price / 100
    this.remote = this.billing.remote
    this.status = this.billing.status === 2
  }

  async initiate(context: NullstackClientContext<EditBillingContext>) {
    try {
      const profiles = await getProfilesQuery(context.database)

      const data = await getBillingById({
        commitmentId: context.params.commitmentId.toString(),
        database: context.database,
        billingId: context.params.billingId.toString(),
      })

      this.billing = data?.[0]

      this.setBillingData()

      this.commitment = data?.[0].commitment
      if (!profiles.find((p) => p.level === 0 || p.tenent_id === data?.[0].commitment.tenent_id)) {
        context.router.url = '/404'
      }
    } catch (error) {
      this.error = error
    }

    if (!this.billing) {
      context.router.url = '/404'
    }
  }

  async submit({ database }: NullstackClientContext<EditBillingContext>) {
    const { data, error } = await database
      .from('billing')
      .update<Database['public']['Tables']['billing']['Update']>({
        description: this.description,
        price: this.price * 100,
        remote: this.remote,
        status: !this.status ? 1 : 2,
      })
      .eq('id', this.billing.id)
      .select('*')

    this.result = data[0]
    this.billing = data[0]
    this.error = error
  }

  async delete({ database }: NullstackClientContext<EditBillingContext>) {
    const { error } = await database
      .from('commitment')
      .update<Database['public']['Tables']['billing']['Update']>({
        status: 0,
      })
      .eq('id', this.billing.id)

    this.error = error
    this.deleted = true
  }

}

export default EditBilling
