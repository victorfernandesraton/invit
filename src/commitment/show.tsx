import Nullstack, { NullstackClientContext } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

type ShowOneCommitmentContext = {
  database: SupabaseClient
}

type Billing = {
  description: string
  id: string
  price: number
  remote: boolean
}

class ShowOneCommitment extends Nullstack {

	title: string = null
  description: string = null
  start_at: string = null
  end_at: string = null
  currency: string = null
  billings: Billing[] = []

  async initiate(context: NullstackClientContext<ShowOneCommitmentContext>) {
    const { data, error } = await context.database
      .from('commitment')
      .select('*, billing(id, price, remote, description), tenent(id, status)')
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

    this.title = data[0].title
    this.description = data[0].description
    this.start_at = new Date(data[0].start_at).toISOString()
    this.end_at = new Date(data[0].end_at).toISOString()
    this.billings = data[0].billing
    this.currency = data[0].currency
  }

  render() {
    return (
      <article>
        <h1>{this.title}</h1>
        <h2>{this.description}</h2>
        <div>
          <h3>Prices</h3>
          {this.billings.map((item) => (
            <div>
              <p>{item.description}</p>
              <p>
                {item.price} {this.currency}
              </p>
            </div>
          ))}
        </div>
      </article>
    )
  }

}

export default ShowOneCommitment
