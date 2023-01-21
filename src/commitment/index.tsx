import Nullstack from 'nullstack'

import ShowOneCommitment from './show'

class Commitment extends Nullstack {
	
	render() {
    return (
      <>
        <ShowOneCommitment route="/commitment/:slug" />
      </>
    )
  }

}

export default Commitment
