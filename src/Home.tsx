import Nullstack, { NullstackClientContext } from 'nullstack'

import { ApplicationProps } from './types'

class Home extends Nullstack {

	hydrate(context: NullstackClientContext<ApplicationProps>) {
		if (context.router.path === '/') {
			context.router.path = context.auth.manager ? '/adm/commitment' : '/wallet'
		}
	}

	render() {
		return <section class="" />
	}

}

export default Home
