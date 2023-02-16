import Nullstack, { NullstackClientContext } from 'nullstack'

import QRCode from 'qrcode-svg'

import { numToCurrency } from '../../../lib/utils/currency'
import { parseDateToString } from '../../../lib/utils/date'
import GoogleWalletButton from '../../components/googleWalletButton'
import { ApplicationProps, Ticket, TicketPost } from '../../types'

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
		description: string
	}
}

class WalletItem extends Nullstack {

	qrCode = null
	ticketGoogle = null
	static async getQRCode({ data }) {
		const res = new QRCode({ content: data.id, width: 125, height: 125 })
		return res.svg()
	}

	async initiate({ id }: NullstackClientContext<{ id: string }>) {
		this.qrCode = await this.getQRCode({ data: { id } })
	}

	async postTicket({ data }: TicketPost) {
		try {
			const res = await fetch('/api/pass/google', {
				method: 'POST',
				headers: {
					Accept: 'application/json, text/plain, */*',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...data,
				}),
			})
			const result = await res.json()
			this.ticketGoogle = result.link
		} catch (error) {
			console.log(error)
		}
	}

	render({ commitment, billing, auth, id, commitment_id }: NullstackClientContext<ApplicationProps & TicketResult>) {
		return (
			<div class="flex flex-col md:flex-row justify-between border border-b-4 border-r-4 border-black rounded-3xl">
				<div class="flex flex-col w-full p-6 ">
					<p class="text-xl">{commitment.title}</p>
					<p class=" text-pink-700">
						{numToCurrency(billing.price / 100)} {commitment.currency}
					</p>
					<p>{commitment.description}</p>
					<p>
						Start At: <spam class="text-pink-700">{parseDateToString(new Date(commitment.start_at))}</spam>
					</p>
					{commitment?.end_at && (
						<p>
							End At: <spam class="text-pink-700">{parseDateToString(new Date(commitment.end_at))}</spam>
						</p>
					)}
					<p>
						Remote: <span class="text-pink-700">{billing.remote ? 'Yes' : 'No'}</span>
					</p>
				</div>
				<div class="justify-center flex border-0 sm:border-l-2 border-t-2 border-black border-dotted p-2">
					{!this.hydrated ? <p>Loading</p> : <div class="flex items-center" html={this.qrCode} />}
				</div>
				<button
					onclick={() => {
						this.postTicket({
							data: {
								user: { email: auth.session.user.email },
								ticket: {
									id,
									...commitment,
									...billing,
									commitment_id,
									description: billing.description,
								},
							},
						})
					}}
				>
					Google pay tickewt
				</button>
				{/* TODO move to modal */}
				<div class="flex flex-col">{this.ticketGoogle && <GoogleWalletButton link={this.ticketGoogle} />}</div>
			</div>
		)
	}

}

export default WalletItem
