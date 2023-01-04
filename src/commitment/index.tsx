import Nullstack from 'nullstack'

import CreateCommitment from './create'
import EditCommitment from './edit'
import ShowCommitments from './show'

class Commitment extends Nullstack {

  render() {
    return (
      <main>
        <ShowCommitments route="/commitment" />
        <CreateCommitment route="/commitment/create" />
        <EditCommitment route="/commitment/:slug" />
      </main>
    )
  }

}

export default Commitment