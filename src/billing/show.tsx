import Nullstack, { NullstackClientContext } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import { Database } from '../../lib/database.types'
import { Profile } from '../Application'
import ShowContainer from '../components/showContainer'

type Tenent = {
  id: string
  name: string
}

type ShowBillingContest = {
  database: SupabaseClient
  profiles: Profile[]
}
type BillingItemProps = NullstackClientContext<Database['public']['Tables']['billing']['Row']>
declare function BillingItem(props: BillingItemProps)

class ShowBilling extends Nullstack {

  result: Database['public']['Tables']['billing']['Row'][] = []
  error: Error = null
  offset = 0
  limit = 5
  tenents: Tenent[] = []

  async initiate(context: NullstackClientContext<ShowBillingContest>) {
    const { data: profile, error: errorProfile } = await context.database
      .from('profile')
      .select('tenent (name, id), id')
      .neq('status', 0)
      .neq('tenent.status', 0)
    this.tenents = profile.map((item) => item.tenent)
    const { data: billing, error: billingError } = await context.database
      .from('billing')
      .select('*, commitment(id, tenent_id)')
      .in(
        'commitment.tenent_id',
        this.tenents.map((item) => item.id),
      )
      .neq('status', 0)
      .eq('commitment.id', context.params.slug)
      .range(this.offset, this.limit)

    this.error = billingError
    if (!this.error) {
      this.result = billing
    }
  }

  renderBillingItem({ price, description }: Database['public']['Tables']['billing']['Row']) {
    return (
      <di>
        <p>{description}</p>
        <p>
          Price <span>{price}</span>
        </p>
      </di>
    )
  }

  render({ params }: NullstackClientContext) {
    if (!this.initiated) {
      return <div>Loading...</div>
    }

    return (
      <ShowContainer title="Billing" createPath={`/commitment/${params.slug}/billing/create`}>
        {!this.result.length && this.initiated && <h1>Empty</h1>}
        {this.result.map((item) => (
          <BillingItem {...{ ...item }} />
        ))}
      </ShowContainer>
    )
  }

}

export default ShowBilling
