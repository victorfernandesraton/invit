import Nullstack, { NullstackClientContext, NullstackNode } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import { Database } from '../../lib/database.types'
import { numToCurrency } from '../../lib/utils/currency'

declare function Item(props: Database['public']['Tables']['commitment']['Row']): NullstackNode

type ShowCommitmentsContext = {
  database: SupabaseClient
}

type Tenent = {
  id: string
  name: string
}

class ShowCommitments extends Nullstack {

  limit= 5
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
    const { data: profile, error: errorProfile } = await database
      .from('profile')
      .select('tenent (name, id), id')
      .neq('status', 0)
      .neq('tenent.status', 0)
    this.error = errorProfile
    if (!this.error) {
      this.tenents = profile.map((item) => item.tenent)
      const { data: commitment, error: commitmentError } = await database
        .from('commitment')
        .select('*')
        .in(
          'tenent_id',
          this.tenents.map((item) => item.id),
        )
        .range(this.offset, this.limit)

      this.result = commitment
      this.error = commitmentError
    }
  }

  renderItem({
    title,
    description,
    start_at,
  }: NullstackClientContext<Database['public']['Tables']['commitment']['Row']>) {
    return (
      <div class="flex flex-col md:flex-row  rounded-lg bg-white border border-black border-b-4 border-r-4">
        <div class="flex flex-col md:flex-row w-full">
          <div class="p-6 flex flex-col flex-1">
            <h5 class="text-black text-lg font-medium mb-2">{title}</h5>
            <p class="text-gray-700 text-base mb-4">{description}</p>
            <p class="text-pink-600 text-xs">
              Start At: <spam class="text-gray-700">{start_at.toString()}</spam>
            </p>
          </div>
          <div class="p-6 py-2 md:py-6 mb-6 md:mb-0 flex flex-row space-x-4 md:w-1/3">
            <div class="flex flex-col">
              <p>Avaliable invites</p>
              <div class="w-full bg-gray-200 rounded-full">
                <div
                  class="bg-pink-600 text-xs font-medium text-blue-100 text-center md:p-1 p-0.25 leading-none rounded-l-full border-2 border-black border-b-4 border-r-4"
                  style={`width: ${(5 / 10) * 100}%`}
                >
                  <p class="text-white">2/10</p>
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <p>Ammount total</p>
              <h5 class="text-pink-700 md:text-xl text-sm">{numToCurrency(200.5)} R$</h5>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div class="mt-8 flex align-middle justify-center">
        <div class="flex flex-col w-5/6 md:w-2/3">
          <h3 class="text-black text-xl font-medium mb-4">Commitments</h3>
          {this.result.map((item) => (
            <Item {...{ ...item }} />
          ))}
        </div>
      </div>
    )
  }

}

export default ShowCommitments