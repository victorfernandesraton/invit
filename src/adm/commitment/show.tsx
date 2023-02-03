import Nullstack, { NullstackClientContext } from 'nullstack'

import { Database } from '../../../lib/database.types'
import ShowContainer from '../../components/showContainer'
import { ApplicationProps, Tenent } from '../../types'
import { CommitmentItem } from './item'

type Commitment = NullstackClientContext<Database['public']['Tables']['commitment']['Row']> & {
	ticket: {
		id: string
		billing: {
			price: number
		}
	}[]
}

class ShowCommitments extends Nullstack {

	limit = 5
	offset = 5
	start = 0
	total = 0
	error = null
	tenents: Tenent[] = []
	tenent = null
	loadingSubmit = false
	showEndAt = null
	title = null
	description = null
	startAt = null
	endAt = null
	result: Commitment[] = []

	async hydrate({ database, auth }: NullstackClientContext<ApplicationProps>) {
		try {
			this.tenents = auth.profiles.map((item) => item.tenent)
			const request = database.from('commitment').select('*, ticket(id, billing(id, price))', {
				count: 'exact',
				head: false,
			})

			if (!auth.superAdmin) {
				request.filter('tenent_id', 'in', `(${this.tenents.map((item) => item.id).join(',')})`)
			}
			const { data, count, error } = await request
				.neq('status', 0)
				.order('start_at', {
					ascending: true,
				})
				.order('end_at', {
					ascending: true,
					nullsFirst: false,
				})
				.range(this.start, this.limit - 1)
			this.result.push(...data)
			this.error = error
			this.total = count
			this.start += this.offset
			this.limit += this.offset
		} catch (error) {
			this.error = error

		}
	}

	render() {
		if (!this.hydrated) {
			return <div>Loading...</div>
		}

		return (
			<ShowContainer title="Commitment" createPath="/adm/commitment/create">
				{!this.result.length && this.hydrated && <h1>Empty</h1>}
				<div class="flex flex-col gap-2">
					{this.result.map((item) => (
						<CommitmentItem {...{ ...item }} />
					))}
					{this.total > this.result.length && (
						<button
							class="w-full
            px-6
            py-2.5
            mb-6
            bg-pink-600
            text-white
            font-medium
            text-xs
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
							onclick={this.initiate}
						>
							Get more
						</button>
					)}
				</div>
			</ShowContainer>
		)
	}

}

export default ShowCommitments
