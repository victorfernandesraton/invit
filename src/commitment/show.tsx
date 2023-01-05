import Nullstack, { NullstackClientContext, NullstackNode } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import { Database } from '../../lib/database.types'
import { numToCurrency } from '../../lib/utils/currency'
import { parseDateToString } from '../../lib/utils/date'

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
              <a href={`/commitment/${id}`} class="text-pink-600 font-medium underline underline-offset-1">
                Edit
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

    if (!this.result.length && this.initiated) {
      return <h1>Empty</h1>
    }
    return (
      <div class="mt-8 flex align-middle justify-center">
        <div class="flex flex-col w-5/6 lg:w-2/3">
          <div class="flex flex-row align-middle justify-between mb-4 w-full">
            <h3 class="text-black text-xl font-medium">Commitments</h3>
            <a href="/commitment/create">
              <button
                class=" w-20
              bg-pink-600
            text-white
            font-medium
            text-xs
            h-8
            leading-tight
            uppercase
            rounded
            border border-b-4 border-r-4 border-black
            hover:bg-white hover:text-pink-700 hover:border-pink-700
            transition
            duration-150
            ease-in-out"
              >
                Create
              </button>
            </a>
          </div>
          {this.result.map((item) => (
            <Item {...{ ...item }} />
          ))}
        </div>
      </div>
    )
  }

}

export default ShowCommitments
