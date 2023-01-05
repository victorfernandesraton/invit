import Nullstack from 'nullstack'

import ShowBilling from '../billing/show'
import CreateBilling from './create'

class Billing extends Nullstack {

  render() {
    return (
      <main>
        <ShowBilling route="/commitment/:slug/billing" />
        <CreateBilling route="/commitment/:slug/billing/create" />
      </main>
    )
  }

}

export default Billing
