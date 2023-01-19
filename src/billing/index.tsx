import Nullstack from 'nullstack'

import ShowBilling from '../billing/show'
import CreateBilling from './create'
import EditBilling from './edit'

class Billing extends Nullstack {

  render() {
    return (
      <>
        <ShowBilling route="/commitment/:slug/billing" />
        <CreateBilling route="/commitment/:slug/billing/create" />
        <EditBilling type="Edit" route="/commitment/:commitmentId/billing/:billingId" />
      </>
    )
  }

}

export default Billing
