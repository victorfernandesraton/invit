import Nullstack, { NullstackClientContext, NullstackNode } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import { numToCurrency } from '../../lib/utils/currency'
import { parseDateToString } from '../../lib/utils/date'
import Markdon from '../institutional/markdon'

type ShowOneCommitmentContext = {
	database: SupabaseClient
}

type CheckoutTicket = ShowOneCommitmentContext & {
	billing_id: string
}

type Billing = {
	description: string
	id: string
	price: number
	remote: boolean
	status: number
}

declare function Billing(props: Billing): NullstackNode

class ShowOneCommitment extends Nullstack {

	id: string = null
	title: string = null
	description: string = null
	start_at: Date = null
	end_at: Date = null
	currency: string = null
	billings: Billing[] = []
	isLogged = false
	error = null
	result = null
	sucess = false

	prepare(context: NullstackClientContext) {
		context.page.title = this.title
		context.page.description = this.description
		context.page.changes = 'daily'
	}

	launch(context: NullstackClientContext) {
		context.page.description = this.description
	}

	async hydrate(context: NullstackClientContext<ShowOneCommitmentContext>) {
		const { data: user } = await context.database.auth.getUser()
		this.isLogged = !!user?.user?.id
		const { data: commitment, error } = await context.database
			.from('commitment')
			.select('*, billing(id, price, remote, description, status), tenent(id, status)')
			.eq('id', context.params.slug)
			.neq('billing.status', 0)
			.neq('status', 0)
			.neq('tenent.status', 0)
			.limit(1)
			.single()

		if (error) {
			context.router.url = '/error'
			return
		}

		if (!commitment) {
			context.router.url = '/404'
			return
		}

		this.id = commitment.id
		this.title = commitment.title
		this.description = commitment.description
		this.start_at = new Date(commitment.start_at)
		if (commitment.end_at) {
			this.end_at = new Date(commitment.end_at)
		}
		this.billings = commitment.billing
		this.currency = commitment.currency
		context.page.title = `Invit - ${this.title}`
		context.page.description = this.description
	}

	async buyTicket(context: NullstackClientContext<CheckoutTicket>) {
		const { data: user } = await context.database.auth.getUser()
		if (!user?.user?.id) {
			const hosturl = new URL(context.router.base)
			const url = new URL('/auth/signin', hosturl.origin)
			url.searchParams.set('c', this.id)

			context.router.url = url.toString()
			return
		}
		const { data, error } = await context.database
			.from('ticket')
			.insert({
				billing_id: context.billing_id,
				commitment_id: this.id,
				owner_id: user?.user?.id,
			})
			.select('*')
		if (error) {
			context.router.url = '/error'
			return
		}
		this.result = data[0]
		this.sucess = true
	}

	renderBilling({ description, price, status, id }: Billing) {
		return (
			<div class="flex flex-row border-b-2 border-black border-dotted justify-between items-center">
				<div class="flex flex-col w-1/2 sm:w-2/3">
					<p class="text-truncate md:text-xl">{description}</p>
					<span class="text-pink-700 md:text-2xl">
						{numToCurrency(price / 100)} {this.currency}
					</span>
				</div>
				<div class="flex flex-col">
					<button
						onclick={() => this.buyTicket({ billing_id: id })}
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

	render() {
		if (!this.hydrated) {
			return <p>Loading....</p>
		}
		return (
			<article class="flex flex-col w-screen items-center mt-12 mb-6">
				<dialog open={this.sucess} class="backdrop:bg-red-500">
					<p>Sucess</p>
					<button
						onclick={() => {
							this.sucess = false
						}}
					>
						Close
					</button>
				</dialog>
				<div class="flex flex-col px-6 lg:flex-row w-full max-w-7xl md:w-4/5 mt-12">
					<div class="flex flex-row border-black border-2 border-b-4 lg:border-r-0 p-6 items-center rounded-3xl w-full">
						<div class="flex flex-col gap-1">
							<h1 class="text-2xl md:text-5xl">{this.title}</h1>
							<a class="text-xs text-pink-500" href={`/commitment/${this.id}`}>
								#{`{${this.id}}`}
							</a>
							<h2 class="md:text-2xl text-xl">{this.description}</h2>
							{this.start_at && (
								<p class="md:text-xl">
									Start At: <span class="text-pink-700">{parseDateToString(this.start_at)}</span>
								</p>
							)}
							{this.end_at && (
								<p class="md:text-xl">
									End at: <span class="text-pink-700">{parseDateToString(this.end_at)}</span>
								</p>
							)}
						</div>
					</div>
					<div class="flex flex-row p-6 justify-start border-black border-2 border-r-4 items-center border-b-4 rounded-3xl lg:w-2/3">
						<div class="flex flex-col w-full">
							<h3 class="md:text-5xl text-2xl">Prices</h3>
							<div class="flex flex-col">
								{this.billings.map((item) => (
									<Billing {...{ ...item }} />
								))}
							</div>
						</div>
					</div>
				</div>
				<div class="p-6 w-full md:w-4/5">
					<Markdon name={'terms'} />
				</div>
			</article>
		)
	}

}

export default ShowOneCommitment
