import Nullstack, { NullstackClientContext } from 'nullstack'

import { PostgrestError } from '@supabase/supabase-js'

import ShowContainer from '../../components/showContainer'
import { ApplicationProps, Ticket } from '../../types'
import WalletItem from './walletitem'

type TicketResult = Ticket['Row'] & {
	commitment: {
		title: string
		description: string
		start_at: Date
		end_at: Date
		currency: string
	}
	billing: {
		remote: boolean
		price: number
	}
}

class ShowWallet extends Nullstack {

	async launch(context: NullstackClientContext<ApplicationProps>) {
		context.page.title = 'Invit - Wallet'
	}

	error?: PostgrestError
	tickets: TicketResult[] = []

	async hydrate({ database, auth }: NullstackClientContext<ApplicationProps>) {
		const { data, error } = await database
			.from('ticket')
			.select(
				`
				*, 
				commitment(
					id, 
					tenent_id, 
					title, 
					description, 
					currency, 
					start_at, 
					end_at
				),
				billing(
					id,
					remote,
					price
				)`,
			)
			.eq('owner_id', auth.session.user.id)
			.neq('status', 0)

		this.tickets = data
		this.error = error
	}

	render() {
		if (!this.hydrated) {
			return <>Loading</>
		}
		return (
			<ShowContainer>
				{!this.tickets.length && (
					<div class="flex justify-center">
						<h2 class="text-3xl">Wallet is empty</h2>
					</div>
				)}
				<section class="flex flex-col gap-2">
					{this.tickets.map((item) => (
						<WalletItem {...{ ...item }} />
					))}
				</section>
			</ShowContainer>
		)
	}

}

export default ShowWallet
