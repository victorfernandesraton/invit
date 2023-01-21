import Nullstack, { NullstackClientContext } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

type ShowOneCommitmentContext = {
  database: SupabaseClient
}

class ShowOneCommitment extends Nullstack {

	title: string = null
  description: string = null
  start_at: string = null
  end_at: string = null

  async initiate(context: NullstackClientContext<ShowOneCommitmentContext>) {
    const { data, error } = await context.database.from('commitment').select('*').eq('id', context.params.slug)

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
  }

  render() {
    return (
      <article>
        <h1>{this.title}</h1>
        <h2>{this.description}</h2>
      </article>
    )
  }

}

export default ShowOneCommitment
