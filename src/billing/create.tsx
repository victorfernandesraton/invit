import Nullstack, { NullstackClientContext } from 'nullstack'

import { SupabaseClient } from '@supabase/supabase-js'

import { Database } from '../../lib/database.types'
import { Profile } from '../Application'
import { CentralFormContainer } from '../components/centralFrom'

type CreateBillingContext = {
  database: SupabaseClient
  profiles: Profile[]
}

type Tenent = {
  id: string
  name: string
}

class CreateBilling extends Nullstack {

	commitment: Database['public']['Tables']['commitment']['Row'] = null
  tenents: Tenent[] = []
  error = null

  description = null
  remote = true
  currency = null
  price = null

  async initiate(context: NullstackClientContext<CreateBillingContext>) {
    const { data: profiles, error: errorProfile } = await context.database
      .from('profile')
      .select('tenent (name, id), id')
      .neq('status', 0)
      .neq('tenent.status', 0)
    this.tenents = profiles.map((item) => item.tenent)
    const { data: commitment, error: commitmentError } = await context.database
      .from('commitment')
      .select('*')
      .in(
        'tenent_id',
        this.tenents.map((item) => item.id),
      )
      .eq('id', context.params.slug)

    this.error = commitmentError
    this.commitment = commitment?.[0] ?? null

    if (!this.commitment || this.error) {
      context.router.url = '/404'
    }
  }

  render() {
    return (
      <section class="flex w-screen h-screen items-center">
        <CentralFormContainer title="Create Billing">
          <form>
            <div class="flex justify-center flex-col">
              <div class="form-group mb-6">
                <label for="description" class="form-label inline-block mb-2 text-gray-700 capitalize">
                  description
                </label>
                <input
                  id="description"
                  bind={this.description}
                  class="form-control
              block
              h-11
              w-full
              px-3
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding
               border border-b-4 border-r-4 border-black
              rounded
              transition
              ease-in-out
              m-0
              focus:text-gray-700 focus:bg-white focus:border-pink-600 focus:outline-none"
                  aria-describedby="descriptionHelp"
                  placeholder="Enter description"
                  required
                />
              </div>
            </div>
            <div class="form-group mb-6">
              <label for="currency" class="form-label inline-block mb-2 text-gray-700 capitalize">
                Currency
              </label>
              <div class="flex flex-row form-group">
                <input
                  id="currency"
                  name="currency"
                  bind={this.price}
                  class="form-control
             block
             h-11
             w-full
             px-3
             py-1.5
             text-base
             font-normal
             text-gray-700
             bg-white bg-clip-padding
              border border-b-4 border-r-4 border-black
             rounded
             transition
             ease-in-out
             m-0
             focus:text-gray-700 focus:bg-white focus:border-pink-600 focus:outline-none"
                  placeholder="Enter currency value"
                  required
                  type="number"
                  min="0.01"
                />
                <select
                  bind={this.currency}
                  class="form-select form-select-lg mb-3
      appearance-none
      block
      w-1/3
      px-3
      py-1.5
      text-xl
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-b-4 border-r-4 border-black
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-pink-600 focus:outline-none"
                  aria-label=".form-select-lg example"
                >
                  <option selected value="BRL">
                    BRL
                  </option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
            <div class="form-group mb-6 flex flex-row space-x-2 justify-between">
              <label class="form-check-label inline-block text-gray-800 text-lg" for="enableDateEnd">
                Remote evemt
              </label>
              <div class="form-check form-switch">
                <input
                  bind={this.remote}
                  class="form-check-input appearance-none w-9 rounded-full float-left h-5 align-top  bg-no-repeat focus:outline-none cursor-pointer
                    border border-black border-r-2 border-b-2
                    bg-pink-300
                    checked:bg-pink-600
                    checked:border-black
                    "
                  type="checkbox"
                  role="switch"
                  id="enableDateEnd"
                />
              </div>
            </div>
          </form>
        </CentralFormContainer>
      </section>
    )
  }

}

export default CreateBilling
