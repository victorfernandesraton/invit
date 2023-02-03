import { NullstackClientContext } from 'nullstack'

import { Database } from '../../../lib/database.types'
import { ApplicationProps } from '../../types'
import { getTenentQuery } from '../tenent/query'
import CommitmentForm from './form'

class CreateCommitment extends CommitmentForm {

	async hydrate({ database, auth }: NullstackClientContext<ApplicationProps>) {
		try {
			this.tenents = await getTenentQuery(database, auth.profiles)
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

	async submit({ database }: NullstackClientContext<ApplicationProps>) {
		this.loadingSubmit = true
		const { data, error } = await database
			.from('commitment')
			.insert<Database['public']['Tables']['commitment']['Insert']>([
				{
					title: this.title,
					start_at: this.startAt.toString?.() ?? null,
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
