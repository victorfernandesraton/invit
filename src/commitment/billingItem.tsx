import Nullstack, { NullstackClientContext } from 'nullstack'

import { numToCurrency } from '../../lib/utils/currency'
import { ApplicationProps, Billing } from '../types'

type CheckoutTicket = ApplicationProps & {
	id: string
}

class BillingItem extends Nullstack {

	commitment_id: string = null

	hydrate(context: NullstackClientContext<CheckoutTicket>) {
		this.commitment_id = context.params.slug.toString()
	}

	// TODO: emit to modal 
	async buyTicket(context: NullstackClientContext<CheckoutTicket>) {
		if (!context.auth.session.user?.id) {
			const hosturl = new URL(context.router.base)
			const url = new URL('/auth/signin', hosturl.origin)
			url.searchParams.set('c', this.commitment_id)

			context.router.url = url.toString()
			return
		}
		const { data, error } = await context.database
			.from('ticket')
			.insert({
				billing_id: context.data.id,
				commitment_id: this.commitment_id,
				owner_id: context.auth.session.user.id,
			})
			.select('*')
		if (error) {
			console.log(error)
		}
	}

	render({ description, price, status, id, currency }: NullstackClientContext<Billing>) {
		return (
			<div class="flex flex-row border-b-2 border-black border-dotted justify-between items-center" data={{ id }}>
				<div class="flex flex-col w-1/2 sm:w-2/3">
					<p class="text-truncate md:text-xl">{description}</p>
					<span class="text-pink-700 md:text-2xl">
						{numToCurrency(price / 100)} {currency}
					</span>
				</div>
				<div class="flex flex-col">
					<button
						onclick={() => this.buyTicket({ data: { id } })}
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

}

export default BillingItem
