import Nullstack, { NullstackClientContext } from 'nullstack'

import { PostgrestError } from '@supabase/supabase-js'

import ShowContainer from '../../components/showContainer'
import { BaseClientContext, Ticket } from '../../types'
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

	async launch(context: NullstackClientContext<BaseClientContext>) {
		context.page.title = 'Invit - Wallet'
	}

	error?: PostgrestError
	tickets: TicketResult[] = []

	async hydrate({ database }: NullstackClientContext<BaseClientContext>) {

		const { data: user } = await database.auth.getUser()

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
			.eq('owner_id', user.user.id)
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
				{this.tickets.map((item) => (
					<WalletItem {...{ ...item }} />
				))}
			</ShowContainer>
		)
	}

}

export default ShowWallet
