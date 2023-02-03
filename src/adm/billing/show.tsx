import Nullstack, { NullstackClientContext, NullstackNode } from 'nullstack'

import { PostgrestError } from '@supabase/supabase-js'

import { Database } from '../../../lib/database.types'
import { numToCurrencyString } from '../../../lib/utils/currency'
import ShowContainer from '../../components/showContainer'
import { ApplicationProps, Tenent } from '../../types'
import { getTenentQuery } from '../tenent/query'

type BillingItemType = Database['public']['Tables']['billing']['Row'] & {
	commitment: {
		name: string
		id: string
		currency: string
	}
	ticket: {
		id: string
	}[]
}

declare function BillingItem(props: BillingItemType): NullstackNode

class ShowBilling extends Nullstack {

	result: BillingItemType[] = []
	error: Error | PostgrestError = null
	offset = 0
	limit = 5
	tenents: Tenent[] = []

	async hydrate(context: NullstackClientContext<ApplicationProps>) {
		try {
			this.tenents = await getTenentQuery(context.database, context.auth.profiles ?? [])

			const { data: billing, error: billingError } = await context.database
				.from('billing')
				.select('* , commitment (currency, id), ticket(id)')
				.in(
					'commitment.tenent_id',
					this.tenents.map((item) => item.id),
				)
				.neq('status', 0)
				.eq('commitment_id', context.params.slug)
				.range(this.offset, this.limit)

			this.error = billingError
			if (!this.error) {
				this.result = billing
			}
		} catch (error) {
			this.error = error
		}
	}

	renderBillingItem({ price, description, commitment, id, remote, ticket }: NullstackClientContext<BillingItemType>) {
		const unitValue = price / 100

		return (
			<div class="mb-4 p-6 flex flex-col md:flex-row justify-between rounded-lg bg-white border border-black border-b-4 border-r-4">
				<div class="flex flex-col">
					<div class="flex flex-col mb-2 gap-2">
						<div class="flex text-pink-600 gap-2 font-medium text-xs underline underline-offset-1">
							<a href={`/adm/commitment/${commitment.id}/billing/${id}`} class="">
								Edit
							</a>
							<a href={`/adm/commitment/${commitment.id}/ticket?billing=${id}`} class="">
								Tickets
							</a>
						</div>
						<p class="text-black text-xl font-medium text-ellipsis	">{description}</p>
						<div class="flex flex-row text-xl gap-2">
							<p class="">Remote:</p>
							<spam class="capitalize text-pink-700">{remote ? 'yes' : 'no'}</spam>
						</div>
					</div>
					<div class="flex flex-row gap-2">
						<p class="text-lg">Total selling</p>
						<span class="text-pink-700 text-lg">{ticket.length} Tickets</span>
					</div>
				</div>
				<div class="flex flex-col gap-2 text-lg">
					<div class="flex flex-col">
						<p class="">Price </p>
						<span class="text-pink-700">
							{numToCurrencyString(unitValue, commitment.currency)} {commitment.currency}
						</span>
					</div>

					<div class="flex flex-col">
						<p class="">Ammount total</p>
						<h5 class="text-pink-700 text-lg">
							{numToCurrencyString(unitValue * ticket.length, commitment.currency)} {commitment.currency}
						</h5>
					</div>
				</div>
			</div>
		)
	}

	render({ params }: NullstackClientContext) {
		if (!this.initiated) {
			return <div>Loading...</div>
		}

		return (
			<ShowContainer title="Billing" createPath={`/adm/commitment/${params.slug}/billing/create`}>
				{!this.result.length && this.initiated && <h1>Empty</h1>}
				{this.result.map((item) => (
					<BillingItem {...{ ...item }} commitment={item.commitment} />
				))}
			</ShowContainer>
		)
	}

}

export default ShowBilling
