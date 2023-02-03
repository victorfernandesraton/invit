import Nullstack, { NullstackClientContext } from 'nullstack'

import { Database } from '../../../lib/database.types'
import ShowContainer from '../../components/showContainer'
import { ApplicationProps } from '../../types'
import { getTenentQuery } from './query'

class ShowTenent extends Nullstack {

	result: Database['public']['Tables']['tenent']['Row'][] = []

	async hydrate(context: NullstackClientContext<ApplicationProps>) {
		if (!context.auth.profiles.find((profile) => profile.level < 2)) {
			context.router.url = '/404'
		}

		this.result = await getTenentQuery(context.database, context.auth.profiles)
	}

	render() {
		if (!this.initiated) {
			return <div>Loading...</div>
		}
		return (
			<ShowContainer createPath="/tenent/create" title="Tenents">
				{this.result.map((item) => item.name)}
				{!this.result.length && <h1>Empty</h1>}
			</ShowContainer>
		)
	}

}

export default ShowTenent
