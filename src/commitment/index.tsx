import Nullstack from 'nullstack'

import CreateCommitment from './create'

class Commitment extends Nullstack {

  render() {
    return (
      <main>
        <CreateCommitment route="/commitment/create" />
      </main>
    )
  }

}

export default Commitment
