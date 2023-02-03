import Nullstack from 'nullstack'

import ShowWallet from './show'

class Wallet extends Nullstack {

	render() {
		return (
			<>
				<ShowWallet route="/wallet" />
			</>
		)
	}

}

export default Wallet
