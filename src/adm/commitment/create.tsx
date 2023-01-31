import { NullstackClientContext } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import { Database } from '../../lib/database.types'
import { getProfilesQuery } from '../profile/query'
import { getTenentQuery } from '../tenent/query'
import CommitmentForm from './form'

type CreateCommitmentContext = {
  database: SupabaseClient
}

class CreateCommitment extends CommitmentForm {


	async hydrate({ database }: NullstackClientContext<CreateCommitmentContext>) {
    try {
      const profile = await getProfilesQuery(database)
      this.tenents = await getTenentQuery(database, profile)
    } catch (error) {
      this.error = error
    }

    if (this.tenents.length === 1) {
      this.tenent = this.tenents[0].id
    }
  }

  update() {
    if (!this.showEndAt) {
      this.endAt = null
    }
  }

  async submit({ database }: NullstackClientContext<CreateCommitmentContext>) {
    this.loadingSubmit = true
    const { data, error } = await database
      .from('commitment')
      .insert<Database['public']['Tables']['commitment']['Insert']>([
        {
          title: this.title,
          start_at: this.startAt,
          description: this.description,
          end_at: this.endAt?.toString?.() ?? null,
          tenent_id: this.tenent,
          currency: this.currency,
        },
      ])
      .select('*')

    this.loadingSubmit = false
    this.result = data?.[0]
    this.error = error
  }

}

export default CreateCommitment
