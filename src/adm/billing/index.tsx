import Nullstack from 'nullstack'

import ShowBilling from '../billing/show'
import CreateBilling from './create'
import EditBilling from './edit'

class Billing extends Nullstack {

  render() {
    return (
      <>
        <ShowBilling route="/adm/commitment/:slug/billing" />
        <CreateBilling route="/adm/commitment/:slug/billing/create" />
        <EditBilling type="Edit" route="/adm/commitment/:commitmentId/billing/:billingId" />
      </>
    )
  }

}

export default Billing
