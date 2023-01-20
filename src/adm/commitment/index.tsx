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
        <ShowCommitments route="/adm/commitment" />
        <CreateCommitment route="/adm/commitment/create" />
        <EditCommitment type="Edit" route="/adm/commitment/:slug" />
        <Billing route="/adm/commitment/:slug/billing/*" />
      </>
    )
  }

}

export default Commitment
