import Nullstack, { NullstackClientContext, NullstackNode } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import { Database } from '../../lib/database.types'
import { numToCurrency } from '../../lib/utils/currency'
import { parseDateToString } from '../../lib/utils/date'
import ShowContainer from '../components/showContainer'
import { getProfilesQuery } from '../profile/query'

declare function Item(props: Database['public']['Tables']['commitment']['Row']): NullstackNode

type ShowCommitmentsContext = {
  database: SupabaseClient
}

type Tenent = {
  id: string
  name: string
}

class ShowCommitments extends Nullstack {

	limit = 5
  offset = 0
  loading = false
  error = null
  tenents: Tenent[] = []
  tenent = null
  loadingSubmit = false
  showEndAt = null
  title = null
  description = null
  startAt = null
  endAt = null
  result: Database['public']['Tables']['commitment']['Row'][] = []

  async initiate({ database }: NullstackClientContext<ShowCommitmentsContext>) {
    this.loading = true
    try {
      const profile = await getProfilesQuery(database)
      if (!this.error) {
        this.tenents = profile.map((item) => item.tenent)
        const request = database.from('commitment').select('*')
        if (!profile.find((item) => !item.tenent && item.level == 0)) {
          request.in(
            'tenent_id',
            this.tenents.map((item) => item.id),
          )
        }
        const { data: commitment, error: commitmentError } = await request
          .neq('status', 0)
          .order('start_at', {
            ascending: true,
          })
          .order('end_at', {
            ascending: true,
            nullsFirst: false,
          })
          .range(this.offset, this.limit)

        this.result = commitment
        this.error = commitmentError
      }
    } catch (error) {
      this.error = error
    }
  }

  renderItem({
    id,
    title,
    description,
    start_at,
    end_at,
  }: NullstackClientContext<Database['public']['Tables']['commitment']['Row']>) {
    return (
      <div class="flex flex-col md:flex-row  rounded-lg bg-white border border-black border-b-4 border-r-4">
        <div class="flex flex-col md:flex-row w-full">
          <div class="p-6 flex flex-col flex-1">
            <div class="flex flex-row mb-2 space-x-2">
              <h5 class="text-black text-lg font-medium text-ellipsis	">{title}</h5>
              <a href={`/commitment/${id}`} class="text-pink-600 font-medium text-md underline underline-offset-1">
                Edit
              </a>
              <a
                href={`/commitment/${id}/billing`}
                class="text-pink-600 font-medium text-md underline underline-offset-1"
              >
                Prices
              </a>
            </div>

            <p class="text-gray-700 text-base mb-4">{description}</p>
            <div class="flex flex-row space-x-6">
              <p class="text-gray-700 text-xs">
                Start At: <spam class="text-pink-700">{parseDateToString(new Date(start_at))}</spam>
              </p>
              {end_at && (
                <p class="text-gray-700 text-xs">
                  End At: <spam class="text-pink-700">{parseDateToString(new Date(end_at))}</spam>
                </p>
              )}
            </div>
          </div>
          <div class="p-6 py-2 md:py-6 mb-6 md:mb-0 flex flex-row space-x-4 md:w-3/5 xl:w-3/6">
            <div class="flex flex-col space-y-2">
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
            <div class="flex flex-col space-y-2">
              <p class="md:text-sm">Ammount total</p>
              <h5 class="text-pink-700 lg:text-xl md:text-md text-xs">{numToCurrency(200.5)} R$</h5>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    if (!this.initiated) {
      return <div>Loading...</div>
    }

    return (
      <ShowContainer title="Commitment">
        {!this.result.length && this.initiated && <h1>Empty</h1>}
        {this.result.map((item) => (
          <Item {...{ ...item }} />
        ))}
      </ShowContainer>
    )
  }

}

export default ShowCommitments
