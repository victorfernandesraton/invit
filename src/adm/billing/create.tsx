import { NullstackClientContext } from 'nullstack'

import { Database } from '../../../lib/database.types'
import { ApplicationProps } from '../../types'
import { getCommitmentById } from '../commitment/query'
import BillingForm from './form'

type Tenent = {
	id: string
	name: string
}

class CreateBilling extends BillingForm {

	commitment: Database['public']['Tables']['commitment']['Row'] = null
	tenents: Tenent[] = []
	error = null

	description = null
	remote = true
	currency = null
	price = null

	result: Database['public']['Tables']['billing']
	status = false

	async hydrate(context: NullstackClientContext<ApplicationProps>) {
		try {
			this.tenents = context.auth.profiles.filter((item) => item.tenent_id).map((item) => item.tenent)
			this.commitment = await getCommitmentById({
				database: context.database,
				commitmentId: context.params.slug.toString(),
				profiles: context.auth.profiles,
			})
		} catch (error) {
			this.error = error
		}

		if (!this.commitment) {
			context.router.url = '/404'
		}
	}

	async submit({ database }: NullstackClientContext<ApplicationProps>) {
		const { data, error } = await database
			.from('billing')
			.insert<Database['public']['Tables']['billing']['Insert']>({
				commitment_id: this.commitment.id,
				description: this.description,
				price: this.price * 100,
				remote: this.remote,
				status: !this.status ? 1 : 2,
			})
			.select('*')

		this.error = error
		this.result = data?.[0]
	}

}

export default CreateBilling
