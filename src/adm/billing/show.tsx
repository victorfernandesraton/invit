import Nullstack, { NullstackClientContext, NullstackNode } from 'nullstack'

import { PostgrestError, SupabaseClient } from '@supabase/supabase-js'

import { Database } from '../../../lib/database.types'
import { numToCurrency, numToCurrencyString } from '../../../lib/utils/currency'
import { Profile } from '../../Application'
import ShowContainer from '../../components/showContainer'
import { getProfilesQuery } from '../profile/query'
import { getTenentQuery } from '../tenent/query'

type Tenent = {
  id: string
  name: string
}

type ShowBillingContest = {
  database: SupabaseClient
  profiles: Profile[]
}
type BillingItemType = Database['public']['Tables']['billing']['Row'] & {
  commitment: {
    name
    id
    currency
  }
}

declare function BillingItem(props: BillingItemType): NullstackNode

class ShowBilling extends Nullstack {

	result: BillingItemType[] = []
  error: Error | PostgrestError = null
  offset = 0
  limit = 5
  tenents: Tenent[] = []

  async initiate(context: NullstackClientContext<ShowBillingContest>) {
    try {
      const profile = await getProfilesQuery(context.database)

      this.tenents = await getTenentQuery(context.database, profile)

      const { data: billing, error: billingError } = await context.database
        .from('billing')
        .select('* , commitment (currency, id)')
        .in(
          'commitment.tenent_id',
          this.tenents.map((item) => item.id),
        )
        .neq('status', 0)
        .eq('commitment_id', context.params.slug)
        .range(this.offset, this.limit)


      this.error = billingError
      if (!this.error) {
        this.result = billing
      }
    } catch (error) {
      this.error = error
    }
  }

  renderBillingItem({ price, description, commitment, id, remote }: NullstackClientContext<BillingItemType>) {
    return (
      <div class="mb-4 flex flex-col md:flex-row justify-between rounded-lg bg-white border border-black border-b-4 border-r-4">
        <div class="p-6 flex flex-col">
          <div class="flex flex-row mb-2 justify-between">
            <p class="text-black text-xl font-medium text-ellipsis	">{description}</p>

            {remote && <span>Remote</span>}
          </div>

          <div class="flex">
            <p class="text-lg">
              Price{' '}
              <span class="text-pink-700">
                {numToCurrencyString(price / 100, commitment.currency)} {commitment.currency}
              </span>
            </p>
          </div>
          <div class="flex space-x-6">
            <a
              href={`/adm/commitment/${commitment.id}/billing/${id}`}
              class="text-pink-600 font-medium text-md underline underline-offset-1"
            >
              Edit
            </a>
            <a
              href={`/adm/commitment/${commitment.id}/ticket?billing=${id}`}
              class="text-pink-600 font-medium text-md underline underline-offset-1"
            >
              Tickets
            </a>
          </div>
        </div>
        <div class="p-6 py-2 md:py-6 mb-6 md:mb-0 flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
          <div class="flex flex-col  space-y-2">
            <p class="md:text-sm">Avaliable invites</p>
            <div class="w-full bg-gray-200 rounded-full">
              <div
                class="bg-pink-600 text-xs font-medium text-blue-100 text-center md:p-0.5 p-0.25 leading-none rounded-l-full border-2 border-black border-b-4 border-r-4"
                style={`width: ${(5 / 10) * 100}%`}
              >
                <p class="text-white">2/10</p>
              </div>
            </div>
          </div>
          <div class="flex flex-col">
            <p class="md:text-sm">Ammount total</p>
            <h5 class="text-pink-700 text-lg">
              {numToCurrency(200.5)} {commitment.currency}
            </h5>
          </div>
        </div>
      </div>
    )
  }

  render({ params }: NullstackClientContext) {
    if (!this.initiated) {
      return <div>Loading...</div>
    }

    return (
      <ShowContainer title="Billing" createPath={`/adm/commitment/${params.slug}/billing/create`}>
        {!this.result.length && this.initiated && <h1>Empty</h1>}
        {this.result.map((item) => (
          <BillingItem {...{ ...item }} commitment={item.commitment} />
        ))}
      </ShowContainer>
    )
  }

}

export default ShowBilling
