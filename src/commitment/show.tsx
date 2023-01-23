import Nullstack, { NullstackClientContext, NullstackNode } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import { numToCurrency } from '../../lib/utils/currency'
import { parseDateToString } from '../../lib/utils/date'
import Markdon from '../institutional/markdon'

type ShowOneCommitmentContext = {
  database: SupabaseClient
}

type Billing = {
  description: string
  id: string
  price: number
  remote: boolean
  status: number
}

declare function Billing(props: Billing): NullstackNode

class ShowOneCommitment extends Nullstack {

	id: string = null
  title: string = null
  description: string = null
  start_at: Date = null
  end_at: Date = null
  currency: string = null
  billings: Billing[] = []

  prepare(context: NullstackClientContext) {
    context.page.title = this.title
    context.page.description = this.description
    context.page.changes = 'daily'
  }

  async initiate(context: NullstackClientContext<ShowOneCommitmentContext>) {
    const { data, error } = await context.database
      .from('commitment')
      .select('*, billing(id, price, remote, description, status), tenent(id, status)')
      .eq('id', context.params.slug)
      .neq('billing.status', 0)
      .neq('status', 0)
      .neq('tenent.status', 0)

    if (error) {
      context.router.url = '/error'
      return
    }

    if (!data || !data?.[0]) {
      context.router.url = '/404'
      return
    }

    this.id = data[0].id
    this.title = data[0].title
    this.description = data[0].description
    this.start_at = new Date(data[0].start_at)
    if (data[0].end_at) {
      this.end_at = new Date(data[0].end_at)
    }
    this.billings = data[0].billing
    this.currency = data[0].currency
		this.prepare()
    context.page.title = `Invit - ${this.title}`
    context.page.description = this.description
  }

  renderBilling({ description, price, status }: Billing) {
    return (
      <div class="flex flex-row border-b-2 border-black border-dotted justify-between h-full items-center py-2">
        <div class="flex flex-col w-1/2 sm:w-2/3">
          <p class="text-truncate md:text-xl">{description}</p>
          <span class="text-pink-700 md:text-2xl">
            {numToCurrency(price / 100)} {this.currency}
          </span>
        </div>
        <div class="flex flex-col">
          <button
            disabled={status !== 1}
            class="w-full
						self-center
            px-6
            py-2.5
            bg-pink-600
            text-white
            text-xs
						md:text-md
            leading-tight
            uppercase
            rounded
            border border-b-4 border-r-4 border-black
            hover:bg-white hover:text-pink-700 hover:border-pink-700
            transition
            duration-150
            ease-in-out
						disabled:bg-pink-400
						disabled:text-white
						disabled:border-gray-500
						disabled:cursor-not-allowed"
          >
            {status !== 1 ? 'Not avaliable' : 'Buy'}
          </button>
        </div>
      </div>
    )
  }

  render() {
    if (!this.initiated) {
      return <p>Loading....</p>
    }
    return (
      <article class="flex flex-col  h-screen w-screen items-center">
        <div class="flex flex-col px-6 lg:flex-row w-full max-w-7xl md:w-4/5 mt-12">
          <div class="flex flex-row border-black border-2 border-b-4 lg:border-r-0 p-6 items-center rounded-3xl w-full">
            <div class="flex flex-col gap-1">
              <h1 class="text-2xl md:text-5xl">{this.title}</h1>
              <a class="text-xs text-pink-500" href={`/commitment/${this.id}`}>
                #{`{${this.id}}`}
              </a>
              <h2 class="md:text-2xl text-xl">{this.description}</h2>
              {this.start_at && (
                <p class="md:text-xl">
                  Start At: <span class="text-pink-700">{parseDateToString(this.start_at)}</span>
                </p>
              )}
              {this.end_at && (
                <p class="md:text-xl">
                  End at: <span class="text-pink-700">{parseDateToString(this.end_at)}</span>
                </p>
              )}
            </div>
          </div>
          <div class="flex flex-row p-6 justify-start border-black border-2 border-r-4 items-center border-b-4 rounded-3xl lg:w-2/3">
            <div class="flex flex-col w-full">
              <h3 class="md:text-5xl text-2xl">Prices</h3>
              <div class="flex flex-col">
                {this.billings.map((item) => (
                  <Billing {...{ ...item }} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <Markdon name={'terms'} />
      </article>
    )
  }

}

export default ShowOneCommitment
