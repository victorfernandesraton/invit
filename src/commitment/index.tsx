import Nullstack from 'nullstack'

import ShowBilling from '../billing/show'
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
        <ShowBilling route="/commitment/:slug/billing" />
      </main>
    )
  }

}

export default Commitment
