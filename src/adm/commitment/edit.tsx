import { NullstackClientContext } from 'nullstack'

import { Database } from '../../../lib/database.types'
import { ApplicationProps } from '../../types'
import CommitmentForm from './form'
import { getCommitmentById } from './query'

class EditCommitment extends CommitmentForm {


	_setFormValues(commitment) {
		this.title = commitment.title
		this.description = commitment.description
		const start_at = new Date(commitment.start_at)
		this.startAt = new Date(start_at).toISOString().substr(0, start_at.toISOString().indexOf('.'))
		this.showEndAt = commitment?.end_at ?? false
		if (commitment.end_at) {
			const end_at = new Date(commitment.end_at)
			this.endAt = new Date(end_at).toISOString().substr(0, end_at.toISOString().indexOf('.'))
		}

		this.tenent = this.tenents.find((t) => t.id === commitment.tenent_id)
		this.deleted = commitment.status === 0
		this.currency = commitment.currency ?? 'BRL'
	}

	async hydrate(context: NullstackClientContext<ApplicationProps>) {
		try {
			this.commitment = await getCommitmentById({
				commitmentId: context.params.slug.toString(),
				database: context.database,
				profiles: context.auth.profiles,
			})
			this._setFormValues(this.commitment)
			if (!this.commitment) {
				context.router.url = '/404'
			}
		} catch (error) {
			if (error.message === 'not found') {
				context.router.url = '/404'
			}
			this.error = error
		}
	}

	async submit({ database }: NullstackClientContext<ApplicationProps>) {
		const { data, error } = await database
			.from('commitment')
			.update<Database['public']['Tables']['commitment']['Update']>({
				title: this.title,
				start_at: this.startAt,
				description: this.description,
				end_at: this.endAt ?? null,
			})
			.eq('id', this.commitment.id)
			.select('*')

		this.error = error
		this.result = data[0]
		this.commitment = data[0]
		this._setFormValues(data[0])
	}

	async delete({ database }: NullstackClientContext<ApplicationProps>) {
		const { error } = await database
			.from('commitment')
			.update<Database['public']['Tables']['commitment']['Update']>({
				status: 0,
			})
			.eq('id', this.commitment.id)

		this.error = error
		this.deleted = true
	}

	update() {
		if (!this.showEndAt) {
			this.endAt = null
		}
	}

}

export default EditCommitment
