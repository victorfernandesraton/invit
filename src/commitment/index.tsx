import Nullstack, { NullstackClientContext } from 'nullstack'

import ShowOneCommitment from './show'

class Commitment extends Nullstack {

	render({ router }: NullstackClientContext) {
		return (
			<>
				<ShowOneCommitment key={router.path} route="/commitment/:slug" />
			</>
		)
	}

}

export default Commitment
