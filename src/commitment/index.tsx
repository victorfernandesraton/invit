import Nullstack, { NullstackClientContext } from 'nullstack'

import Billing from '../billing'
import CreateCommitment from './create'
import EditCommitment from './edit'
import ShowCommitments from './show'

class Commitment extends Nullstack {

	prepare(context: NullstackClientContext) {
    context.page.title = 'Invit - Commitment'
  }

  render() {
    return (
      <>
        <ShowCommitments route="/commitment" />
        <CreateCommitment route="/commitment/create" />
        <EditCommitment type="Edit" route="/commitment/:slug" />
        <Billing route="/commitment/:slug/billing/*" />
      </>
    )
  }

}

export default Commitment
